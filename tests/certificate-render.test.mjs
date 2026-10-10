// Certificate render check: PDF engine (src/engine.js) + preview markup (index.html).
// Asserts regulator (BQA/HRDC) logos are absent and all certificate content remains.
// Needs: Node 18+, `npm i --no-save playwright-core`, Google Chrome (or CHROME=<path>), poppler (pdftotext, pdfimages, pdftoppm).
// Usage: node tests/certificate-render.test.mjs [outDir]   (writes PDFs + PNGs to outDir for visual QA)
import { chromium } from 'playwright-core';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.resolve(process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'iab-cert-')));
fs.mkdirSync(out, { recursive: true });
const PORT = 8765;
const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: repo, stdio: 'ignore' });
process.on('exit', () => srv.kill());
await new Promise((r) => setTimeout(r, 1200));

const CASES = [
  { id: '01-short-name-short-course', full_name: 'Ann Moyo', course: 'WMT', resit: false },
  { id: '02-long-name-hcba', full_name: 'Kgomotso Tshepiso Boitumelo Mmualefhe-Ramotswa', course: 'HCBA', resit: false },
  { id: '03-sti-personal-lines', full_name: 'Thabo Kealeboga Sebina', course: 'STI', resit: false },
  { id: '04-resit-lti', full_name: 'Onalenna Gaolatlhe', course: 'LTI', resit: true } // resit only affects eligibility; same template
];

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage({ viewport: { width: 1000, height: 1300 }, deviceScaleFactor: 2 });
const requests = [];
page.on('request', (r) => requests.push(r.url()));
const base = `http://127.0.0.1:${PORT}/`;
await page.route(base + '__harness.html', (route) => route.fulfill({
  contentType: 'text/html',
  body: `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Archivo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>body{margin:0;font-family:Archivo,sans-serif}</style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
  <script>window.DEPLOYMENT_CONFIG={production:true}</script><script src="src/engine.js"></script>
  </head><body><div id="host"></div></body></html>`
}));
await page.goto(base + '__harness.html');
await page.waitForFunction(() => window.IABEngine && window.PDFLib && window.qrcode);

// Extract the real preview template from index.html
const html = fs.readFileSync(path.join(repo, 'index.html'), 'utf8');
const startTok = '<div style="width:210mm;height:297mm;transform:scale({{ zoom }})';
const s = html.indexOf(startTok);
const e = html.indexOf('<!-- ======================= REGISTER');
let tpl = html.slice(s, e);
tpl = tpl.slice(0, tpl.lastIndexOf('</sc-if>'));
tpl = tpl.slice(0, tpl.lastIndexOf('</div>')); tpl = tpl.slice(0, tpl.lastIndexOf('</div>'));

const results = [];
for (const c of CASES) {
  const res = await page.evaluate(async ({ c, tpl }) => {
    const E = window.IABEngine;
    const st = JSON.parse(JSON.stringify(E.INSTITUTION_DEFAULTS));
    st.verifyUrl = 'https://shepmurashiki-ship-it.github.io/iab-certificate-generator/verify.html';
    const course = E.COURSES[c.course];
    const reference = E.buildReference({ course_code: c.course, intake_year: 2026, intake_month: 'MAR', issue_year: 2026, issue_month: 6, sequence: 7 });
    const cert = {
      full_name: c.full_name, id_type: 'Omang', id_number: '463022810', course_name: course.name,
      award_date_text: '5 June 2026', issue_date_text: '12 June 2026', reference,
      qr_url: st.verifyUrl + '?ref=' + encodeURIComponent(reference)
    };
    const out = await E.renderCertificatePDF(cert, st, { draft: false });
    let b = ''; const u = out.bytes; for (let i = 0; i < u.length; i += 0x8000) b += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));

    // --- preview: mirror index.html pv computation ---
    const nameLen = c.full_name.length;
    let nameSize = E.nameStartSize(c.full_name);
    const estW = nameLen * nameSize * 0.52, maxW = 120 / 0.3528;
    if (estW > maxW) nameSize = Math.max(13, Math.floor(maxW / (nameLen * 0.52)));
    const courseRuleTop = course.name.length > 40 ? 148.3 : 139.5;
    const q = window.qrcode(0, 'M'); q.addData(cert.qr_url); q.make();
    const n = q.getModuleCount(), cell = 4, cv = document.createElement('canvas'); cv.width = cv.height = n * cell;
    const g = cv.getContext('2d'); g.fillStyle = '#FFF'; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = '#16233B';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) g.fillRect(k * cell, r * cell, cell, cell);
    const sigLefts = [71, 137];
    const L = E.L;
    const pv = {
      zoom: 1, pvName: c.full_name, pvNameSize: nameSize, pvIdLine: 'Omang: 463022810',
      pvWording: 'has successfully completed the prescribed assessment and examination requirements of the ' + st.officialName + ' in',
      pvCourse: course.name, pvCourseRuleTop: courseRuleTop, pvAwardTop: courseRuleTop + 6.8, pvIssuedTop: courseRuleTop + 13.2,
      pvAward: cert.award_date_text, pvIssue: cert.issue_date_text, pvRef: reference, pvDraft: false, pvQr: cv.toDataURL(), pvHasQr: true,
      pvSigTop: L.sigLineY - 20.5, pvSigMarkTop: L.sigLineY - 5,
      setCity: st.city, setNameUpper: st.officialName.toUpperCase(), setBqa: st.bqaEtp, setTvet: st.tvet, setHrdc: st.hrdc,
      setAddr1: 'Unit 1, Plot 102', setAddr2: 'Light Industrial, Commerce Park', setAddr3: 'Gaborone, Botswana',
      setPhone: st.telephone, setEmail: st.email, setWebsite: 'iab.co.bw',
      pvSigs: st.signatories.map((sg, i) => ({ left: sigLefts[i], top: L.sigLineY - 20.5, name: sg.name || ' ', titleUpper: sg.title.toUpperCase(), image: sg.image, hasImage: true, noImage: false }))
    };
    const get = (expr, scope) => expr.split('.').reduce((o, k) => o == null ? o : o[k], scope);
    const fill = (str, scope) => str.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, x) => { const v = get(x, scope); return v == null ? '' : v; });
    const host = document.getElementById('host');
    // expand sc-for / sc-if textually then interpolate
    let markup = tpl.replace(/<sc-for list="\{\{ (\w+) \}\}" as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g, (_, list, as, body) =>
      pv[list].map((item) => fill(body, { ...pv, [as]: item })).join(''));
    for (let i = 0; i < 5; i++) markup = markup.replace(/<sc-if value="\{\{ ([\w.]+) \}\}"[^>]*>((?:(?!<sc-if)[\s\S])*?)<\/sc-if>/g, (_, v, body) => get(v, pv) ? body : '');
    markup = markup.replace(/<sc-if value="(true|false)"[^>]*>([\s\S]*?)<\/sc-if>/g, (_, v, body) => v === 'true' ? body : '');
    host.innerHTML = fill(markup, pv);
    host.firstElementChild.id = 'cert';
    await document.fonts.ready;
    await Promise.all([...host.querySelectorAll('img')].map((im) => im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })));
    await new Promise((r) => setTimeout(r, 600));
    return { courseName: course.name, b64: btoa(b), preflight: out.preflight, ok: out.preflightOk, fonts: out.fontsEmbedded, qr: cert.qr_url, reference,
      imgs: [...host.querySelectorAll('img')].map((i) => i.getAttribute('src')),
      text: host.innerText };
  }, { c, tpl });
  fs.writeFileSync(path.join(out, c.id + '.pdf'), Buffer.from(res.b64, 'base64'));
  await page.locator('#cert').screenshot({ path: path.join(out, c.id + '-preview.png') });
  delete res.b64;
  results.push({ id: c.id, ...res });
}
const assetRequests = [...new Set(requests)].filter((u) => u.startsWith(base));

// ---- assertions ----
const REGULATOR = /bqa|hrdc|qualifications authority|resource development council/i;
const sh = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' });
assert.ok(!assetRequests.some((u) => REGULATOR.test(u)), 'regulator logo asset requested: ' + assetRequests.join(', '));
for (const r of results) {
  const pdf = path.join(out, r.id + '.pdf');
  assert.ok(r.ok, r.id + ': preflight failed ' + JSON.stringify(r.preflight));
  assert.ok(!('regulatoryLogosVisible' in r.preflight), r.id + ': stale regulator preflight flag');
  // embedded images: background 2480x3508 + two signatures only
  const imgs = sh('pdfimages', ['-list', pdf]).split('\n').slice(2).map((l) => l.trim().split(/\s+/)).filter((c) => c[2] === 'image').map((c) => c[3] + 'x' + c[4]);
  assert.deepEqual(imgs.sort(), ['2480x3508', '895x550', '951x552'].sort(), r.id + ': unexpected embedded images ' + imgs);
  const text = sh('pdftotext', ['-raw', pdf, '-']).replace(/\s+/g, ''); // extraction drops some spaces: compare space-free
  assert.ok(!/ACCREDITATIONANDRECOGNITION/i.test(text), r.id + ': old heading in PDF');
  const c = CASES.find((x) => x.id === r.id);
  for (const want of [c.full_name, 'Omang 463022810', 'S. Murashiki', 'CHIEF EXECUTIVE', 'QUALITY ASSURANCE', r.reference, 'Scan to verify',
    'BQA ETP No.: ETP0198', 'TVET No.: TVET 000700', 'HRDC ACCREDITED', 'Awarded at the Academy in Gaborone on 5 June 2026', 'Issued on 12 June 2026'])
    assert.ok(text.includes(want.replace(/\s+/g, '')), r.id + ': PDF missing "' + want + '"');
  assert.ok(text.includes(r.courseName.replace(/\s+/g, '')), r.id + ': course name missing');
  // QR decodes to the unchanged verification link
  execFileSync('pdftoppm', ['-r', '300', '-png', '-singlefile', pdf, path.join(out, r.id + '-pdf')]);
  const png = fs.readFileSync(path.join(out, r.id + '-pdf.png')).toString('base64');
  const decoded = await page.evaluate(async (b64) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height;
    const g = cv.getContext('2d'); g.drawImage(im, 0, 0);
    const x = Math.round(im.width * 0.78), y = Math.round(im.height * 0.82), w = Math.round(im.width * 0.14), h = Math.round(im.height * 0.11);
    const d = g.getImageData(x, y, w, h); const q = window.jsQR(d.data, w, h); return q && q.data;
  }, png);
  assert.equal(decoded, r.qr, r.id + ': QR destination');
  // preview markup
  assert.deepEqual(r.imgs, [], r.id + ': preview has <img> elements ' + r.imgs);
  assert.ok(!/ACCREDITATION AND RECOGNITION/i.test(r.text), r.id + ': old heading in preview');
  assert.ok(r.text.includes(c.full_name) && r.text.includes('S. Murashiki') && r.text.includes('HRDC ACCREDITED'), r.id + ': preview content missing');
}
// iAB logo: baked into the background art, which must still be embedded (checked above) and requested
assert.ok(assetRequests.some((u) => u.endsWith('assets/cert-bg-v9.jpg')), 'iAB background/logo art not loaded');
// static source scan: no regulator logo references in active source
for (const f of ['index.html', 'verify.html', 'src/engine.js'])
  assert.ok(!/(bqa|hrdc)[-_]?logo|ACCREDITATION AND RECOGNITION/i.test(fs.readFileSync(path.join(repo, f), 'utf8')), f + ': regulator logo reference');

fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ results, assetRequests }, null, 2));
await browser.close(); srv.kill();
console.log('PASS: ' + results.length + ' certificates checked. Output: ' + out);
