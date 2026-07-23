/* iAB Certificate Generator — core engine (no UI).
   Exposed as window.IABEngine. Used by the app DC and reusable in tests. */
(function () {
  'use strict';
  const MM = 2.834645669; // 1mm in PDF points
  const A4 = { w: 210, h: 297, wPt: 595.28, hPt: 841.89 };
  const SAFE = { left: 8, right: 8, top: 7, bottom: 7 };

  const COURSES = {
    LTI: { code: 'LTI', name: 'Introduction to Long Term Insurance' },
    STI: { code: 'STI', name: 'Introduction to Short Term Insurance: Personal Lines' },
    HCBA: { code: 'HCBA', name: 'Introduction to Healthcare & Healthcare Benefits Administration' },
    WMT: { code: 'WMT', name: 'Introduction to Wealth Management' }
  };
  const COURSE_ALIASES = {
    LTI: ['lti', 'lt-ins', 'long term insurance', 'introduction to long term insurance', 'long-term insurance'],
    STI: ['sti', 'st-pl', 'short term insurance', 'short-term insurance', 'introduction to short term insurance: personal lines', 'introduction to short term insurance personal lines', 'short term insurance: personal lines'],
    HCBA: ['hcba', 'mca', 'healthcare benefits administration', 'healthcare and healthcare benefits administration', 'introduction to healthcare & healthcare benefits administration', 'introduction to healthcare and healthcare benefits administration', 'healthcare & healthcare benefits administration'],
    WMT: ['wmt', 'wlm', 'wealth management', 'introduction to wealth management']
  };
  const PAYMENT_STATUS_RULES = {
    eligible: ['Paid', 'Fully Paid', 'Settled'],
    blocked: ['Outstanding Fees', 'Unpaid', 'In Arrears'],
    review: ['Updated', 'Pending', 'Unknown']
  };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MONTH_CODES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const INSTITUTION_DEFAULTS = {
    officialName: 'Insurance Academy of Botswana',
    brandName: 'iAB',
    tagline: 'Study. Learn. Earn.',
    bqaEtp: 'ETP0198',
    tvet: 'TVET 000700',
    hrdc: 'HRDC ACCREDITED',
    companyReg: 'BW0000132853',
    telephone: '+267 311 7200',
    email: 'admin@iab.co.bw',
    address: 'Unit 1, Plot 102, Light Industrial, Commerce Park, Gaborone, Botswana',
    website: 'https://iab.co.bw',
    verifyUrl: 'https://iab.co.bw/verify',
    city: 'Gaborone',
    templateVersion: 'CERT-2026-REF-7',
    qrEnabled: true,
    signatories: [
      { name: 'S. Murashiki', title: 'Chief Executive', image: 'assets/sig-ceo.png' },
      { name: '', title: 'Quality Assurance', image: 'assets/sig-qa.png' }
    ]
  };

  // ---------- Field definitions & alias-based mapping ----------
  const FIELDS = [
    { key: 'registration_id', label: 'Registration ID', required: true, aliases: ['registration id', 'registration number', 'student number', 'learner number', 'reg id', 'reg no'] },
    { key: 'full_name', label: 'Full Name', required: true, aliases: ['full name', 'student name', 'learner name', 'name'] },
    { key: 'first_names', label: 'First name(s)', required: false, aliases: ['first name (s)', 'first name(s)', 'first name', 'first names', 'given names'] },
    { key: 'surname', label: 'Surname', required: false, aliases: ['surname/last name', 'surname', 'last name'] },
    { key: 'omang', label: 'Omang number', required: false, aliases: ['omang no.', 'omang', 'omang number', 'id', 'id number', 'identity number'] },
    { key: 'passport', label: 'Passport number', required: false, aliases: ['passport', 'passport no.', 'passport number'] },
    { key: 'intake_month', label: 'Intake month', required: true, aliases: ['intake month', 'intake'] },
    { key: 'intake_year', label: 'Intake year', required: true, aliases: ['intake year'] },
    { key: 'course', label: 'Course', required: true, aliases: ['course', 'course name', 'programme', 'programme name', 'program'] },
    { key: 'payment_status', label: 'Payment status', required: true, aliases: ['payment status', 'account status', 'fee status'] },
    { key: 'formative_total', label: 'Formative total', required: false, aliases: ['form tot', 'formative total', 'assignment result', 'overall formative'] },
    { key: 'exam_mark', label: 'Exam mark', required: true, aliases: ['exam mark', 'examination mark', 'summative result', 'exam result'] },
    { key: 'resit_mark', label: 'Resit mark', required: false, aliases: ['resit mark', 'rewrite mark', 'reassessment mark', 'supplementary exam mark'] },
    { key: 'overall_mark', label: 'Overall mark', required: true, aliases: ['overall mark', 'overall result', 'final mark'] },
    { key: 'exam_date', label: 'Award / exam date', required: false, aliases: ['exam date', 'examination date', 'completion date', 'award date'] },
    { key: 'statement_date', label: 'Statement date', required: false, aliases: ['statement date', 'certificate date', 'issue date'] },
    { key: 'email', label: 'Email', required: false, aliases: ['email address', 'email', 'e-mail'] },
    { key: 'telephone', label: 'Telephone', required: false, aliases: ['cell phone no', 'cell phone', 'phone', 'telephone', 'mobile'] }
  ];

  const norm = (s) => String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');

  function detectMapping(headers) {
    const map = {};
    FIELDS.forEach((f) => {
      let best = -1, conf = 'none';
      headers.forEach((h, i) => {
        const n = norm(h);
        if (!n) return;
        if (f.aliases.includes(n)) { if (best < 0 || conf !== 'exact') { best = i; conf = 'exact'; } }
        else if (conf === 'none' && f.aliases.some((a) => n.startsWith(a) || a.startsWith(n))) { best = i; conf = 'partial'; }
      });
      map[f.key] = { col: best, confidence: conf };
    });
    return map;
  }

  function colLetter(i) { let s = ''; i = +i; while (i >= 0) { s = String.fromCharCode(65 + (i % 26)) + s; i = Math.floor(i / 26) - 1; } return s; }

  // ---------- Dates ----------
  function excelSerialToDate(n) {
    // 1900 date system
    const ms = Math.round((n - 25569) * 86400 * 1000);
    return new Date(ms);
  }
  function parseDateAny(v) {
    if (v == null || v === '') return null;
    if (typeof v === 'number' && v > 20000 && v < 60000) return excelSerialToDate(v);
    const s = String(v).trim();
    if (/^\d{4,5}(\.\d+)?$/.test(s)) { const n = +s; if (n > 20000 && n < 60000) return excelSerialToDate(n); }
    const mdy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (mdy) { let y = +mdy[3]; if (y < 100) y += 2000; const d = new Date(Date.UTC(y, +mdy[1] - 1, +mdy[2])); if (!isNaN(d)) return d; }
    const iso = new Date(s);
    if (isNaN(iso)) return null;
    return new Date(Date.UTC(iso.getFullYear(), iso.getMonth(), iso.getDate()));
  }
  function fmtDate(d) {
    if (!d) return '';
    return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
  }
  function isoDate(d) { return d ? d.toISOString().slice(0, 10) : null; }
  function monthCode(m) {
    if (m == null || m === '') return null;
    if (typeof m === 'number' || /^\d+$/.test(String(m).trim())) { const i = +m - 1; return MONTH_CODES[i] || null; }
    const n = norm(m).slice(0, 3);
    const i = MONTH_CODES.findIndex((c) => c.toLowerCase() === n);
    return i >= 0 ? MONTH_CODES[i] : null;
  }

  // ---------- Course / status ----------
  function resolveCourse(v) {
    const n = norm(v);
    if (!n) return null;
    for (const code of Object.keys(COURSE_ALIASES)) if (COURSE_ALIASES[code].includes(n)) return COURSES[code];
    for (const code of Object.keys(COURSES)) if (norm(COURSES[code].name) === n) return COURSES[code];
    return null;
  }
  function paymentCategory(status, rules) {
    const r = rules || PAYMENT_STATUS_RULES;
    const n = norm(status);
    if (r.eligible.some((s) => norm(s) === n)) return 'eligible';
    if (r.blocked.some((s) => norm(s) === n)) return 'blocked';
    if (r.review.some((s) => norm(s) === n)) return 'review';
    return 'review';
  }

  // ---------- Row normalisation & validation ----------
  function cellText(v) { return v == null ? '' : String(v).trim(); }
  function cellNum(v) { if (v == null || v === '') return null; const n = parseFloat(String(v).replace(/[%\s]/g, '')); return isNaN(n) ? null : n; }

  function rowToLearner(row, mapping, rowIndex) {
    const g = (k) => { const m = mapping[k]; return m && m.col >= 0 ? row[m.col] : null; };
    const rec = {
      rowIndex,
      registration_id: cellText(g('registration_id')),
      full_name: cellText(g('full_name')).replace(/\s+/g, ' '),
      first_names: cellText(g('first_names')),
      surname: cellText(g('surname')),
      omang: cellText(g('omang')),
      passport: cellText(g('passport')),
      intake_month_raw: cellText(g('intake_month')),
      intake_year: cellText(g('intake_year')),
      course_raw: cellText(g('course')),
      payment_status: cellText(g('payment_status')),
      formative_total: cellNum(g('formative_total')),
      exam_mark: cellNum(g('exam_mark')),
      resit_mark: cellNum(g('resit_mark')),
      overall_mark: cellNum(g('overall_mark')),
      exam_date: parseDateAny(g('exam_date')),
      statement_date: parseDateAny(g('statement_date')),
      email: cellText(g('email')),
      telephone: cellText(g('telephone'))
    };
    rec.intake_month_code = monthCode(rec.intake_month_raw);
    rec.course = resolveCourse(rec.course_raw);
    rec.id_type = rec.omang ? 'Omang No.' : (rec.passport ? 'Passport No.' : null);
    rec.id_number = rec.omang || rec.passport || '';
    rec.effective_exam = (rec.resit_mark != null && rec.resit_mark > 0) ? rec.resit_mark : rec.exam_mark;
    return rec;
  }

  function isBlankRow(row) { return !row || row.every((c) => c == null || String(c).trim() === ''); }

  function validateLearner(rec, opts) {
    const o = opts || {};
    const rules = o.paymentRules || PAYMENT_STATUS_RULES;
    const blocks = [], warnings = [];
    if (!rec.registration_id) blocks.push('Missing Registration ID');
    if (!rec.full_name) blocks.push('Missing full name');
    if (!rec.id_number) blocks.push('No Omang or passport number');
    if (!rec.course) blocks.push(rec.course_raw ? 'Course not recognised: "' + rec.course_raw + '" — confirm manually' : 'Missing course');
    if (!rec.intake_month_code) blocks.push('Missing or invalid intake month');
    if (!rec.intake_year || !/^\d{4}$/.test(rec.intake_year)) blocks.push('Missing or invalid intake year');
    // Academic
    let academic = true;
    if (rec.overall_mark == null) { academic = false; blocks.push('Missing overall mark'); }
    else if (rec.overall_mark < 50) { academic = false; blocks.push('Overall mark below 50 (' + rec.overall_mark + ')'); }
    if (rec.effective_exam == null) { academic = false; blocks.push('Missing exam mark'); }
    else if (rec.effective_exam < 40) { academic = false; blocks.push('Effective exam mark below 40 (' + rec.effective_exam + ')'); }
    // Payment
    const payCat = paymentCategory(rec.payment_status, rules);
    if (payCat === 'blocked') blocks.push('Payment status blocked: "' + rec.payment_status + '"');
    else if (payCat === 'review') blocks.push('Payment status requires review: "' + (rec.payment_status || '—') + '"');
    if (!rec.exam_date) warnings.push('No award date — confirmation required before issue');
    const blockKinds = {
      payment: payCat !== 'eligible',
      academic: !academic,
      validation: blocks.some((b) => /Missing|No Omang|not recognised|invalid/.test(b))
    };
    return { blocks, warnings, payCat, academic, blockKinds, eligible: blocks.length === 0 };
  }

  // ---------- References ----------
  function buildReference(p) {
    return 'IAB/CERT/' + p.course_code + '/' + p.intake_year + p.intake_month + '/' + p.issue_year + String(p.issue_month).padStart(2, '0') + '/' + String(p.sequence).padStart(4, '0') + (p.revision ? '-R' + p.revision : '');
  }
  function fileSafe(ref) { return ref.replace(/\//g, '-'); }
  function certFilename(ref, name) {
    const clean = String(name).replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
    return fileSafe(ref) + ' - ' + clean + '.pdf';
  }
  function maskId(id) {
    const s = String(id || '');
    if (s.length <= 5) return s ? s[0] + '****' : '';
    return s.slice(0, 3) + '****' + s.slice(-2);
  }

  async function sha256Hex(bytes) {
    const h = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // ---------- Local (demo) database adapter ----------
  const LS_KEY = 'iab_cert_registry_v1';
  const isProductionBuild = () => !!(window.DEPLOYMENT_CONFIG && window.DEPLOYMENT_CONFIG.production);
  function emptyDB() {
    // Demo accounts exist ONLY in non-production builds (local evaluation registry).
    return { certificates: [], counters: {}, events: [], batches: [], learners: [], users: isProductionBuild() ? [] : [
      { email: 'admin@iab.co.bw', name: 'iAB Administrator', role: 'Administrator', password: 'iab2026' },
      { email: 'issuer@iab.co.bw', name: 'Certificate Issuer', role: 'Certificate Issuer', password: 'iab2026' },
      { email: 'viewer@iab.co.bw', name: 'Records Viewer', role: 'Viewer', password: 'iab2026' }
    ], settings: null, mappings: {} };
  }
  const LocalDB = {
    mode: 'local',
    load() { try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : emptyDB(); } catch (e) { return emptyDB(); } },
    save(db) { localStorage.setItem(LS_KEY, JSON.stringify(db)); },
    signIn(db, email, password) {
      if (isProductionBuild()) return null; // demo sign-in is disabled in production builds
      const u = db.users.find((x) => norm(x.email) === norm(email));
      if (!u || u.password !== password) return null;
      return { email: u.email, name: u.name, role: u.role };
    },
    reserveReference(db, course_code, intake_year, intake_month, issueDate) {
      const key = course_code + ':' + intake_year + ':' + intake_month;
      const seq = (db.counters[key] || 0) + 1;
      db.counters[key] = seq;
      const p = { course_code, intake_year, intake_month, issue_year: issueDate.getUTCFullYear(), issue_month: issueDate.getUTCMonth() + 1, sequence: seq };
      return { parts: p, reference: buildReference(p), sequence: seq };
    },
    findActiveCert(db, registration_id, course_code, intake_year, intake_month) {
      return db.certificates.find((c) => c.status === 'Issued' && norm(c.registration_id) === norm(registration_id) && c.course_code === course_code && c.intake_year === intake_year && c.intake_month === intake_month) || null;
    },
    addEvent(db, ev) { db.events.unshift(Object.assign({ id: 'ev' + Date.now() + Math.random().toString(36).slice(2, 6), event_date: new Date().toISOString() }, ev)); }
  };

  // ---------- Supabase adapter (used once configured in Settings) ----------
  function makeSupabase(url, anonKey) {
    if (!window.supabase || !url || !anonKey) return null;
    const client = window.supabase.createClient(url, anonKey);
    return {
      mode: 'supabase', client,
      async signIn(email, password) {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: prof } = await client.from('staff_profiles').select('*').eq('user_id', data.user.id).single();
        return { email: data.user.email, name: (prof && prof.full_name) || data.user.email, role: (prof && prof.role) || 'Viewer' };
      },
      async signOut() { await client.auth.signOut(); },
      async reserveReference(course_code, intake_year, intake_month, issueDate) {
        const { data, error } = await client.rpc('reserve_certificate_reference', {
          p_course_code: course_code, p_intake_year: +intake_year, p_intake_month: intake_month, p_issue_date: isoDate(issueDate)
        });
        if (error) throw error;
        return data; // { reference, sequence, ... }
      },
      async insertCertificate(rec) { const { data, error } = await client.from('certificates').insert(rec).select().single(); if (error) throw error; return data; },
      async updateCertificate(id, patch) { const { error } = await client.from('certificates').update(patch).eq('id', id); if (error) throw error; },
      async addEvent(ev) { const { error } = await client.from('certificate_events').insert(ev); if (error) throw error; },
      async listCertificates() { const { data, error } = await client.from('certificates').select('*').order('created_at', { ascending: false }); if (error) throw error; return data; },
      async uploadPdf(path, bytes) {
        const { error } = await client.storage.from('certificates').upload(path, new Blob([bytes], { type: 'application/pdf' }), { upsert: false });
        if (error) throw error; return path;
      },
      async downloadPdf(path) { const { data, error } = await client.storage.from('certificates').download(path); if (error) throw error; return new Uint8Array(await data.arrayBuffer()); }
    };
  }

  // ---------- Certificate layout (shared mm coordinate model: preview + PDF) ----------
  // Reference-family composition: white body, sculptural navy/gold left feature,
  // ceremonial content on cx=130, signatures, left accreditation block, navy brand band.
  // Art baked into assets/cert-bg-v5.jpg on the same mm grid.
  const L = {
    cx: 130, contentLeft: 68, contentRight: 196,
    titleY: 42, subY: 52, ruleY: 58,
    certifyY: 70, nameY: 87, nameRuleY: 94, idY: 101.5,
    wordingY: 112.5, courseY: 133,
    sigLineY: 198, sigNameY: 204, sigTitleY: 209.5,
    lowCx: 130, recogHeadY: 215.5, logoRowMid: 227,
    zoneRuleY: 247.5, refY: 254, refIssY: 259.5,
    footTop: 266, footTextX: 45.5,
    qr: { x: 168, y: 249, size: 14 }
  };
  const NAME_FIT_PRESETS = [
    { maxLength: 22, fontSize: 42 }, { maxLength: 30, fontSize: 37 },
    { maxLength: 40, fontSize: 32 }, { maxLength: 55, fontSize: 27 }
  ];

  function nameStartSize(name) {
    for (const p of NAME_FIT_PRESETS) if (name.length <= p.maxLength) return p.fontSize;
    return 20;
  }

  // Font cache: try brand TTFs (variable fonts from google/fonts via jsDelivr), fall back to standard PDF fonts.
  const fontCache = {};
  async function fetchFont(url) {
    if (fontCache[url] !== undefined) return fontCache[url];
    try { const r = await fetch(url); fontCache[url] = r.ok ? await r.arrayBuffer() : null; }
    catch (e) { fontCache[url] = null; }
    return fontCache[url];
  }
  const FONT_URLS = {
    serif: 'https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/Newsreader%5Bopsz,wght%5D.ttf',
    serifItalic: 'https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/Newsreader-Italic%5Bopsz,wght%5D.ttf',
    sans: 'https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf'
  };

  const imgCache = {};
  async function fetchBytes(url) {
    if (imgCache[url] !== undefined) return imgCache[url];
    try { const r = await fetch(url); imgCache[url] = r.ok ? new Uint8Array(await r.arrayBuffer()) : null; }
    catch (e) { imgCache[url] = null; }
    return imgCache[url];
  }
  function dataUrlToBytes(du) {
    const b64 = du.split(',')[1];
    const bin = atob(b64); const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  function wrapText(text, font, size, maxWidthPt) {
    const words = String(text).split(/\s+/); const lines = []; let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (font.widthOfTextAtSize(t, size) <= maxWidthPt) cur = t;
      else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // Central certificate colour tokens (print-safe corporate blue — CERT-2026-REF-7)
  const CERTIFICATE_COLOURS = { primaryBlue: [0x17, 0x3A, 0x5E], secondaryBlue: [0x21, 0x4F, 0x7A] };
  const COLORS_PDF = () => {
    const { rgb } = window.PDFLib;
    const t = (a) => rgb(a[0] / 255, a[1] / 255, a[2] / 255);
    return {
      navy: t(CERTIFICATE_COLOURS.primaryBlue),
      navyInk: t(CERTIFICATE_COLOURS.primaryBlue),
      navy700: t(CERTIFICATE_COLOURS.secondaryBlue),
      gold: rgb(0xC8 / 255, 0x9B / 255, 0x2D / 255),
      goldDeep: rgb(0xA8 / 255, 0x80 / 255, 0x1F / 255),
      goldMet: rgb(0xD4 / 255, 0xAF / 255, 0x37 / 255),
      ivory: rgb(0xFB / 255, 0xF9 / 255, 0xF5 / 255),
      slate: rgb(0x5A / 255, 0x64 / 255, 0x74 / 255),
      graphite: rgb(0x2C / 255, 0x37 / 255, 0x4A / 255),
      white: rgb(1, 1, 1),
      onNavyMuted: rgb(0xAE / 255, 0xB8 / 255, 0xC7 / 255)
    };
  };

  /* cert model fields expected:
     full_name, id_type, id_number, course_name, award_date_text, issue_date_text,
     reference, qr_url (optional) */
  async function renderCertificatePDF(cert, settings, opts) {
    const o = opts || {};
    const PDF = window.PDFLib;
    const doc = await PDF.PDFDocument.create();
    if (window.fontkit) doc.registerFontkit(window.fontkit);
    doc.setTitle('Certificate of Proficiency — ' + cert.full_name);
    doc.setAuthor(settings.officialName);
    const page = doc.addPage([A4.wPt, A4.hPt]);
    const C = COLORS_PDF();
    const X = (mm) => mm * MM;
    const Y = (mm) => A4.hPt - mm * MM; // top-based mm -> pdf y

    // Fonts
    let serif, serifIt, sans, sansBold;
    try {
      const [sB, siB, aB] = await Promise.all([fetchFont(FONT_URLS.serif), fetchFont(FONT_URLS.serifItalic), fetchFont(FONT_URLS.sans)]);
      if (window.fontkit && sB && aB) {
        serif = await doc.embedFont(sB); serifIt = siB ? await doc.embedFont(siB) : serif;
        sans = await doc.embedFont(aB); sansBold = sans;
      }
    } catch (e) { /* fall through */ }
    if (!serif) {
      serif = await doc.embedFont(PDF.StandardFonts.TimesRoman);
      serifIt = await doc.embedFont(PDF.StandardFonts.TimesRomanItalic);
      sans = await doc.embedFont(PDF.StandardFonts.Helvetica);
      sansBold = await doc.embedFont(PDF.StandardFonts.HelveticaBold);
    } else { sansBold = sans; }

    const preflight = {
      pageWidthCorrect: Math.abs(page.getWidth() - A4.wPt) < 0.5,
      pageHeightCorrect: Math.abs(page.getHeight() - A4.hPt) < 0.5,
      pageCount: 1, noHorizontalOverflow: true, noVerticalOverflow: true,
      noCriticalElementsOutsideSafeArea: true, logoVisible: false,
      studentNameVisible: false, courseNameVisible: false, signaturesVisible: false,
      regulatoryLogosVisible: false, referenceVisible: false, accreditationVisible: false
    };

    // ---- Background: white body + navy/gold left feature + brand band (baked art) ----
    let bgEmbedded = false;
    const bgBytes = await fetchBytes(o.backgroundUrl || 'assets/cert-bg-v9.jpg');
    if (bgBytes) {
      try {
        const bg = await doc.embedJpg(bgBytes);
        page.drawImage(bg, { x: 0, y: 0, width: A4.wPt, height: A4.hPt });
        bgEmbedded = true;
        preflight.logoVisible = true; // iAB mark is baked into the brand band art
      } catch (e) { /* fall through to flat fallback */ }
    }
    if (!bgEmbedded) {
      page.drawRectangle({ x: 0, y: 0, width: A4.wPt, height: A4.hPt, color: C.white });
      page.drawRectangle({ x: 0, y: 0, width: A4.wPt, height: X(27), color: C.navy });
      page.drawLine({ start: { x: 0, y: Y(270) }, end: { x: A4.wPt, y: Y(270) }, thickness: 2, color: C.goldMet });
      page.drawSvgPath('M0 0 L' + X(46) + ' 0 L' + X(20) + ' ' + X(200) + ' L0 ' + X(200) + ' Z', { x: 0, y: A4.hPt, color: C.navy700, opacity: 0.9 });
      const markBytes = await fetchBytes('assets/iab-logo-mark.png');
      if (markBytes) {
        try { const img = await doc.embedPng(markBytes); const h = X(12), w = h * (img.width / img.height); page.drawImage(img, { x: X(193) - w, y: Y(286), width: w, height: h }); preflight.logoVisible = true; } catch (e) {}
      }
      if (!preflight.logoVisible) { page.drawText('iAB', { x: X(172), y: Y(285), size: 22, font: serif, color: C.goldMet }); preflight.logoVisible = true; }
    }

    // ---- Title block ----
    // (drawn after `centre` helper below)

    // ---- Content ----
    const centre = (t, ymm, size, font, color, spacing) => {
      let w = font.widthOfTextAtSize(t, size) + (spacing ? spacing * (t.length - 1) : 0);
      let x = X(L.cx) - w / 2;
      if (spacing) { for (const ch of t) { page.drawText(ch, { x, y: Y(ymm), size, font, color }); x += font.widthOfTextAtSize(ch, size) + spacing; } }
      else page.drawText(t, { x, y: Y(ymm), size, font, color });
      return { x, w };
    };
    centre('CERTIFICATE', L.titleY, 38, serif, C.navyInk, 2);
    centre('OF PROFICIENCY', L.subY, 12.5, sans, C.goldDeep, 3.4);
    page.drawLine({ start: { x: X(L.cx - 16), y: Y(L.ruleY) }, end: { x: X(L.cx + 16), y: Y(L.ruleY) }, thickness: 0.8, color: C.goldMet });
    page.drawCircle({ x: X(L.cx), y: Y(L.ruleY), size: 1.7, color: C.goldMet });

    centre('This is to certify that', L.certifyY, 13.5, serifIt, C.slate);

    // Student name — dynamic fit, measured width
    const name = cert.full_name;
    const maxNameW = X(120);
    let nSize = nameStartSize(name);
    while (nSize > 13 && serif.widthOfTextAtSize(name, nSize) > maxNameW) nSize -= 0.5;
    const nameFits = serif.widthOfTextAtSize(name, nSize) <= maxNameW;
    centre(name, L.nameY, nSize, serif, C.navyInk);
    preflight.studentNameVisible = nameFits;
    if (!nameFits) preflight.noHorizontalOverflow = false;
    const nw = Math.min(serif.widthOfTextAtSize(name, nSize) * 0.9, X(104));
    // name ornament: longer fine rule with centred diamond
    page.drawLine({ start: { x: X(L.cx) - nw / 2, y: Y(L.nameRuleY) }, end: { x: X(L.cx) + nw / 2, y: Y(L.nameRuleY) }, thickness: 0.5, color: C.goldMet });
    page.drawSvgPath('M0 -4 L3 0 L0 4 L-3 0 Z', { x: X(L.cx), y: Y(L.nameRuleY), color: C.goldMet, scale: 0.55 });

    centre(cert.id_type + '  ' + cert.id_number, L.idY, 9.5, sans, C.slate);

    const wording = 'has successfully completed the prescribed assessment and examination requirements of the ' + settings.officialName + ' in';
    const wLines = wrapText(wording, sans, 9.5, X(102));
    wLines.forEach((ln, i) => centre(ln, L.wordingY + i * 5.8, 9.5, sans, C.slate));

    // Course name — up to 2 lines with fitting
    let cSize = 19;
    let cLines = wrapText(cert.course_name, serif, cSize, X(122));
    while (cLines.length > 2 && cSize > 13) { cSize -= 0.5; cLines = wrapText(cert.course_name, serif, cSize, X(122)); }
    cLines.forEach((ln, i) => centre(ln, L.courseY + i * 8.8, cSize, serif, C.navyInk));
    preflight.courseNameVisible = cLines.length <= 2;
    const courseRuleYmm = L.courseY + (cLines.length - 1) * 8.8 + 6.5;
    page.drawLine({ start: { x: X(L.cx - 36), y: Y(courseRuleYmm) }, end: { x: X(L.cx + 36), y: Y(courseRuleYmm) }, thickness: 0.7, color: C.goldMet });

    const datesTop = courseRuleYmm + 10;
    centre('Awarded at the Academy in ' + settings.city + ' on ' + cert.award_date_text, datesTop, 10, sans, C.graphite);
    centre('Issued on ' + cert.issue_date_text, datesTop + 6.2, 9.5, sans, C.slate);

    // ---- Signatures (two columns, supplied images) ----
    const sigs = (settings.signatories || []).filter((s) => s && s.title).slice(0, 2);
    const cols = sigs.length === 1 ? [L.cx] : [L.cx - 33, L.cx + 33];
    const sigTextCentre = (t, xmm, ymm, size, font, color, spacing) => {
      let w = font.widthOfTextAtSize(t, size) + (spacing ? spacing * (t.length - 1) : 0);
      let x = X(xmm) - w / 2;
      if (spacing) { for (const ch of t) { page.drawText(ch, { x, y: Y(ymm), size, font, color }); x += font.widthOfTextAtSize(ch, size) + spacing; } }
      else page.drawText(t, { x, y: Y(ymm), size, font, color });
    };
    let sigImgCount = 0;
    for (let i = 0; i < sigs.length; i++) {
      const s = sigs[i], xm = cols[i];
      if (s.image) {
        try {
          const bytes = String(s.image).startsWith('data:') ? dataUrlToBytes(s.image) : await fetchBytes(s.image);
          if (bytes) {
            const img = await doc.embedPng(bytes);
            const h = Math.min(X(17), X(34) * (img.height / img.width));
            const w = h * (img.width / img.height);
            page.drawImage(img, { x: X(xm) - w / 2, y: Y(L.sigLineY) + 3, width: w, height: h });
            sigImgCount++;
          }
        } catch (e) { /* signature image skipped */ }
      }
      page.drawLine({ start: { x: X(xm - 26), y: Y(L.sigLineY) }, end: { x: X(xm + 26), y: Y(L.sigLineY) }, thickness: 0.4, color: C.graphite });
      if (s.name) sigTextCentre(s.name, xm, L.sigNameY, 10.5, serif, C.navyInk);
      sigTextCentre(s.title.toUpperCase(), xm, L.sigTitleY, 7, sans, C.slate, 1);
    }
    // small gold marker between the two signature blocks
    if (sigs.length === 2) page.drawSvgPath('M0 -3.5 L2.6 0 L0 3.5 L-2.6 0 Z', { x: X(L.cx), y: Y(L.sigLineY - 4), color: C.goldMet, scale: 0.6 });
    preflight.signaturesVisible = sigs.length >= 2 && sigImgCount >= 2;

    // ---- Unified lower-information zone (centred on the page) ----
    const lowCentre = (t, ymm, size, font, color, spacing, bold) => {
      const f = bold ? sansBold : font;
      let w = f.widthOfTextAtSize(t, size) + (spacing ? spacing * (t.length - 1) : 0);
      let x = X(L.lowCx) - w / 2;
      if (spacing) { for (const ch of t) { page.drawText(ch, { x, y: Y(ymm), size, font: f, color }); x += f.widthOfTextAtSize(ch, size) + spacing; } }
      else page.drawText(t, { x, y: Y(ymm), size, font: f, color });
    };
    // heading with short gold side rules
    lowCentre('ACCREDITATION AND RECOGNITION', L.recogHeadY, 7.2, sans, C.navyInk, 1.2);
    const headW = sans.widthOfTextAtSize('ACCREDITATION AND RECOGNITION', 7.2) + 1.2 * 28;
    page.drawLine({ start: { x: X(L.lowCx) - headW / 2 - X(9), y: Y(L.recogHeadY - 0.9) }, end: { x: X(L.lowCx) - headW / 2 - X(3), y: Y(L.recogHeadY - 0.9) }, thickness: 0.6, color: C.goldMet });
    page.drawLine({ start: { x: X(L.lowCx) + headW / 2 + X(3), y: Y(L.recogHeadY - 0.9) }, end: { x: X(L.lowCx) + headW / 2 + X(9), y: Y(L.recogHeadY - 0.9) }, thickness: 0.6, color: C.goldMet });
    const [bqaBytes, hrdcBytes] = await Promise.all([fetchBytes('assets/bqa-logo.png'), fetchBytes('assets/hrdc-logo.png')]);
    let bqaImg = null, hrdcImg = null;
    try { if (bqaBytes) bqaImg = await doc.embedPng(bqaBytes); } catch (e) {}
    try { if (hrdcBytes) hrdcImg = await doc.embedPng(hrdcBytes); } catch (e) {}
    const bqaH = X(17), hrdcH = X(11.5);
    const bqaW = bqaImg ? bqaH * (bqaImg.width / bqaImg.height) : 0;
    const hrdcW = hrdcImg ? hrdcH * (hrdcImg.width / hrdcImg.height) : 0;
    const gap = X(11);
    let lx = X(L.lowCx) - (bqaW + hrdcW + gap) / 2;
    const midY = Y(L.logoRowMid);
    if (bqaImg) { page.drawImage(bqaImg, { x: lx, y: midY - bqaH / 2, width: bqaW, height: bqaH }); lx += bqaW + gap; }
    if (hrdcImg) { page.drawImage(hrdcImg, { x: lx, y: midY - hrdcH / 2, width: hrdcW, height: hrdcH }); }
    preflight.regulatoryLogosVisible = !!(bqaImg && hrdcImg);

    // ---- Verification band: gold rule, ref + issue date left, QR right ----
    page.drawLine({ start: { x: X(26), y: Y(L.zoneRuleY) }, end: { x: X(184), y: Y(L.zoneRuleY) }, thickness: 0.5, color: C.goldMet });
    page.drawText('Ref No.: ', { x: X(26), y: Y(L.refY), size: 10, font: sansBold, color: C.goldDeep });
    page.drawText(cert.reference, { x: X(26) + sansBold.widthOfTextAtSize('Ref No.: ', 10), y: Y(L.refY), size: 10, font: sansBold, color: C.navyInk });
    page.drawText('Issued: ' + cert.issue_date_text, { x: X(26), y: Y(L.refIssY), size: 8.5, font: sans, color: C.slate });
    preflight.referenceVisible = true;

    // ---- Footer band (Statement-header language; mark + divider baked at left/x148) ----
    const tx0 = X(L.footTextX);
    // institution name, letterspaced white
    const instT = settings.officialName.toUpperCase();
    let ix = tx0;
    for (const ch of instT) { page.drawText(ch, { x: ix, y: Y(275.8), size: 9.5, font: sansBold, color: C.white }); ix += sansBold.widthOfTextAtSize(ch, 9.5) + 1.1; }
    // tagline
    const tagWords = (settings.tagline || '').split(' ');
    let tfx = tx0;
    tagWords.forEach((wd) => {
      page.drawText(wd, { x: tfx, y: Y(281.4), size: 8.5, font: sansBold, color: /^learn/i.test(wd) ? C.goldMet : C.white });
      tfx += sansBold.widthOfTextAtSize(wd, 8.5) + sansBold.widthOfTextAtSize(' ', 8.5) * 1.6;
    });
    // accreditation chip (gold outline, statement-style)
    const chipSegs = [
      { t: 'BQA ETP No.: ' + settings.bqaEtp, c: C.white },
      { t: '   |   ', c: C.goldMet },
      { t: 'TVET No.: ' + settings.tvet, c: C.white },
      { t: '   |   ', c: C.goldMet },
      { t: settings.hrdc, c: C.goldMet }
    ];
    const chipTextW = chipSegs.reduce((a, s) => a + sansBold.widthOfTextAtSize(s.t, 6.8), 0);
    const chipPad = X(2.6), chipH = X(5.2);
    const chipTop = Y(285.2);
    page.drawRectangle({ x: tx0, y: chipTop - chipH, width: chipTextW + chipPad * 2, height: chipH, borderColor: C.goldMet, borderWidth: 0.7 });
    let cx2 = tx0 + chipPad;
    const chipBaseY = chipTop - chipH / 2 - 6.8 * 0.36;
    chipSegs.forEach((s) => { page.drawText(s.t, { x: cx2, y: chipBaseY, size: 6.8, font: sansBold, color: s.c }); cx2 += sansBold.widthOfTextAtSize(s.t, 6.8); });
    preflight.accreditationVisible = true;
    // right contact block (right-aligned at 194, mirroring the statement header)
    const web = (settings.website || '').replace(/^https?:\/\//, '');
    const addrParts = (settings.address || '').split(/,\s*/);
    const addrLines = addrParts.length >= 4
      ? [addrParts.slice(0, 2).join(', '), addrParts.slice(2, addrParts.length - 2).join(', '), addrParts.slice(-2).join(', ')]
      : [settings.address];
    const rightLines = [
      { t: addrLines[0] || '', size: 7, font: sans, c: C.onNavyMuted },
      { t: addrLines[1] || '', size: 7, font: sans, c: C.onNavyMuted },
      { t: addrLines[2] || '', size: 7, font: sans, c: C.onNavyMuted },
      { t: settings.telephone, size: 7.5, font: sansBold, c: C.white, gapBefore: 1.6 },
      { t: settings.email, size: 7.5, font: sansBold, c: C.white },
      { t: web, size: 7.5, font: sansBold, c: C.goldMet }
    ].filter((l) => l.t);
    let ry = 272.8;
    rightLines.forEach((l) => {
      ry += (l.gapBefore || 0);
      page.drawText(l.t, { x: X(194) - l.font.widthOfTextAtSize(l.t, l.size), y: Y(ry), size: l.size, font: l.font, color: l.c });
      ry += 3.4;
    });

    if (settings.qrEnabled && cert.qr_url && window.qrcode) {
      try {
        const qr = window.qrcode(0, 'M'); qr.addData(cert.qr_url); qr.make();
        const n = qr.getModuleCount(); const size = X(L.qr.size); const cell = size / n;
        const qx = X(L.qr.x), qyTop = Y(L.qr.y);
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c))
          page.drawRectangle({ x: qx + c * cell, y: qyTop - (r + 1) * cell, width: cell + 0.15, height: cell + 0.15, color: C.navyInk });
        page.drawText('Scan to verify', { x: qx + size / 2 - sans.widthOfTextAtSize('Scan to verify', 6.5) / 2, y: qyTop - size - 4.5, size: 6.5, font: sans, color: C.slate });
      } catch (e) { /* QR optional */ }
    }

    // ---- Draft watermark ----
    if (o.draft) {
      page.drawText('DRAFT', {
        x: X(78), y: Y(160), size: 84, font: sansBold,
        color: C.slate, opacity: 0.12, rotate: PDF.degrees(32)
      });
      page.drawText('PREVIEW — NOT ISSUED', { x: X(95), y: Y(264.2), size: 7, font: sans, color: C.slate, opacity: 0.7 });
    }

    preflight.pageCount = doc.getPageCount();
    const ok = preflight.pageCount === 1 && Object.keys(preflight).every((k) => k === 'pageCount' ? true : preflight[k] !== false);
    const bytes = await doc.save();
    return { bytes, preflight, preflightOk: ok, fontsEmbedded: !!fontCache[FONT_URLS.serif] };
  }

  // ---------- Import template workbook ----------
  function makeTemplateWorkbook() {
    const XLSX = window.XLSX;
    const headers = ['Registration ID', 'Intake Month', 'Intake Year', 'Full Name', 'Omang No.', 'Passport No.', 'Course', 'Payment Status', 'Formative Total', 'Exam Mark', 'Resit Mark', 'Overall Mark', 'Award Date'];
    const example = ['IAB-2026FEB-000123', 'March', '2026', 'Example Learner', '463022810', '', 'Introduction to Long Term Insurance', 'Paid', 72, 55, 0, 63, '5 June 2026'];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 4, 14) }));
    const guide = [
      ['Column', 'Required', 'Notes'],
      ['Registration ID', 'Yes', 'Unique learner registration number, e.g. IAB-2026FEB-000123'],
      ['Intake Month', 'Yes', 'Full month name or number (March or 3)'],
      ['Intake Year', 'Yes', 'Four digits, e.g. 2026'],
      ['Full Name', 'Yes', 'Name exactly as it must appear on the certificate'],
      ['Omang No.', 'One of Omang/Passport', 'Format the column as TEXT — leading zeros must be preserved'],
      ['Passport No.', 'One of Omang/Passport', 'Used only where Omang is blank. Keep as TEXT'],
      ['Course', 'Yes', 'Accepted codes/names: LTI — Introduction to Long Term Insurance · STI — Introduction to Short Term Insurance: Personal Lines · HCBA — Introduction to Healthcare & Healthcare Benefits Administration · WMT — Introduction to Wealth Management'],
      ['Payment Status', 'Yes', 'Eligible: Paid, Fully Paid, Settled · Blocked: Outstanding Fees, Unpaid, In Arrears · Review: Updated, Pending, Unknown'],
      ['Formative Total', 'Optional', 'Numeric 0–100'],
      ['Exam Mark', 'Yes', 'Numeric 0–100'],
      ['Resit Mark', 'Optional', 'If greater than 0 it replaces the exam mark for eligibility'],
      ['Overall Mark', 'Yes', 'Numeric 0–100'],
      ['Award Date', 'Recommended', 'Date of exam/completion, e.g. 5 June 2026 or 2026-06-05'],
      [],
      ['Eligibility', '', 'Overall Mark >= 50 AND effective exam mark (resit if > 0, otherwise exam) >= 40, AND payment status in the Eligible list'],
      ['References', '', 'IAB/CERT/{COURSE}/{INTAKEYEAR}{INTAKEMONTH}/{ISSUEYEARMONTH}/{SEQUENCE} — sequence resets per course + intake and is assigned by the database at issue']
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(guide);
    ws2['!cols'] = [{ wch: 18 }, { wch: 22 }, { wch: 110 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Import Template');
    XLSX.utils.book_append_sheet(wb, ws2, 'Column Guide');
    XLSX.writeFile(wb, 'iAB Certificate Import Template.xlsx');
  }

  function downloadBlob(bytes, filename, type) {
    const blob = bytes instanceof Blob ? bytes : new Blob([bytes], { type: type || 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }

  window.IABEngine = {
    MM, A4, SAFE, L, COURSES, COURSE_ALIASES, PAYMENT_STATUS_RULES, MONTHS, MONTH_CODES,
    INSTITUTION_DEFAULTS, FIELDS, NAME_FIT_PRESETS,
    norm, detectMapping, colLetter, excelSerialToDate, parseDateAny, fmtDate, isoDate, monthCode,
    resolveCourse, paymentCategory, rowToLearner, isBlankRow, validateLearner,
    buildReference, fileSafe, certFilename, maskId, sha256Hex,
    LocalDB, makeSupabase, renderCertificatePDF, nameStartSize,
    makeTemplateWorkbook, downloadBlob, dataUrlToBytes
  };
})();
