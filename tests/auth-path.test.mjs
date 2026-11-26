// Auth, password-recovery and verification paths, exercised at the real production URL.
// Every request to the GitHub Pages origin is served from this working copy; supabase-js is replaced by a
// recording stub and any request to *.supabase.co is blocked and counted. No real users or records are touched.
// Needs: Node 18+, `npm i --no-save playwright-core`, Google Chrome (or CHROME=<path>).
// Usage: node tests/auth-path.test.mjs [screenshotDir]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const shots = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (shots) fs.mkdirSync(shots, { recursive: true });
const SITE = 'https://shepmurashiki-ship-it.github.io/iab-certificate-generator/';
const PROJECT = 'https://meyodifbsxibnvhjsnvf.supabase.co';
const NEUTRAL = 'If an authorised account exists for this email address, password recovery instructions have been sent.';
const GOOD = 'Navy&Gold-2026'; // arbitrary test value, not a credential
const RECOVERY_HASH = '#access_token=stub&refresh_token=stub&expires_in=3600&token_type=bearer&type=recovery';
const TYPES = { html: 'text/html', js: 'application/javascript', mjs: 'application/javascript', css: 'text/css', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', json: 'application/json', woff2: 'font/woff2', ttf: 'font/ttf' };

let mode = {};       // stub behaviour for the next page load
let configBody = null; // replacement config.js (null = the real one)
const stub = (m) => `window.__calls = window.__calls || []; // x-dc injects head scripts twice
window.supabase = { createClient: (url, key, opts) => {
  __calls.push(['createClient', url, key.slice(0, 15), opts && opts.auth && opts.auth.flowType]);
  const auth = {
    signInWithPassword: async (c) => { __calls.push(['signIn', c.email]);
      return ${m.signInError ? `{ data: { user: null }, error: ${JSON.stringify(m.signInError)} }` : `{ data: { user: { id: 'u1', email: c.email } }, error: null }`}; },
    signOut: async () => { __calls.push(['signOut']); return { error: null }; },
    resetPasswordForEmail: async (email, o) => { __calls.push(['reset', email, o && o.redirectTo]); return { data: {}, error: ${JSON.stringify(m.resetError || null)} }; },
    updateUser: async (a) => { __calls.push(['updateUser', Object.keys(a).join(','), a.password]); return { data: {}, error: ${JSON.stringify(m.updateError || null)} }; },
    onAuthStateChange: (cb) => { if (/type=recovery/.test(location.hash)) setTimeout(() => cb('PASSWORD_RECOVERY', { user: { id: 'u1' } }), 50);
      return { data: { subscription: { unsubscribe() {} } } }; },
    getSession: async () => ({ data: { session: null }, error: null })
  };
  auth.getSession = async () => ({ data: { session: { user: { id: '00000000-0000-0000-0000-0000000000aa' } } }, error: null });
  const prof = { select: () => prof, eq: () => prof, single: async () => ({ data: { full_name: 'Stub Staff', role: ${JSON.stringify(m.role || 'Viewer')} } }) };
  const from = (t) => t === 'staff_profiles' ? prof : {
    insert: (row) => { __calls.push(['insert', t, row]); const r = { select: () => r, single: async () => ({ data: { id: 'db-1' }, error: null }) }; return r; },
    update: (patch) => { const r = { eq: (k, v) => { __calls.push(['update', t, patch.status, k, v]); return r; }, select: async () => ({ data: [{ id: 'db-1' }], error: null }) }; return r; }
  };
  return { auth, from,
    rpc: async (fn, a) => {
      if (fn === 'reserve_certificate_reference') { __calls.push(['rpc', fn, a.p_course_code]); return { data: { reference: 'IAB/CERT/LTI/2026MAR/202611/0001', sequence: 1 }, error: null }; }
      __calls.push(['rpc', fn, a.p_reference, a.p_token || null]);
      return ${m.verify ? JSON.stringify(m.verify) : `{ data: { result: 'found', detail: a.p_token ? 'full' : 'limited', certificate_reference: a.p_reference, status: 'Issued', course: 'Introduction to Long Term Insurance', award_date: '2026-06-05', issue_date: '2026-07-01', learner_name: a.p_token ? 'Test Learner' : null, learner_initials: a.p_token ? null : 'T. L.' }, error: null }`}; } };
} };`;

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
const supabaseHits = [];
await ctx.route(/\.supabase\.co\//, (r) => { supabaseHits.push(r.request().url()); r.abort(); });
await ctx.route(/supabase-js/, (r) => r.fulfill({ contentType: 'application/javascript', body: stub(mode) }));
await ctx.route(SITE + '**', (r) => {
  const rel = decodeURIComponent(new URL(r.request().url()).pathname.slice('/iab-certificate-generator/'.length)) || 'index.html';
  if (rel === 'config.js' && configBody) return r.fulfill({ contentType: TYPES.js, body: configBody });
  const f = path.join(repo, rel);
  if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 404, body: '' });
  r.fulfill({ contentType: TYPES[path.extname(f).slice(1)] || 'application/octet-stream', body: fs.readFileSync(f) });
});
const page = await ctx.newPage();
const calls = () => page.evaluate(() => window.__calls);
const text = () => page.evaluate(() => document.body.innerText);
const shot = async (name) => { if (shots) await page.screenshot({ path: path.join(shots, name + '.png') }); };
const fresh = async (url, m = {}) => {
  mode = m;
  await page.goto(SITE + 'index.html');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.goto('about:blank'); // a hash-only change would not reload the document
  await page.goto(url);
};
const signIn = async (email) => {
  await page.waitForSelector('input[type=email]');
  await page.fill('input[type=email]', email);
  await page.fill('input[type=password]', 'x'.repeat(12));
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(600);
};
let n = 0; const ok = (label) => console.log(`  ok ${++n} - ${label}`);

// 1-2. Fresh browser at the production URL: approved config auto-loads; no setup screen or warning.
await fresh(SITE);
await page.waitForSelector('text=Staff sign in');
let t = await text();
assert.doesNotMatch(t, /not yet been configured|configure supabase|not configured correctly/i);
assert.deepEqual((await calls()).find((c) => c[0] === 'createClient'), ['createClient', PROJECT, 'sb_publishable_', 'implicit']);
assert.match(t, /Forgot password\?/);
await shot('01-sign-in');
ok('fresh browser loads approved project config automatically (no manual setup, no warning)');

// Legacy per-browser connection + demo users from older builds: ignored, removed, cannot redirect the client.
await page.evaluate((filler) => localStorage.setItem('iab_cert_registry_v1', JSON.stringify({ certificates: [], counters: {}, events: [], batches: [], learners: [], mappings: {},
  users: [{ email: 'legacy@demo.invalid', role: 'Administrator', password: filler }],
  settings: Object.assign({}, window.IABEngine.INSTITUTION_DEFAULTS, { supabaseUrl: 'https://attacker00000000000000.supabase.co', supabaseAnonKey: 'legacy-key' }) })), 'x'.repeat(12));
mode = { signInError: { status: 400, message: 'Invalid login credentials' } };
await page.reload();
await signIn('legacy@demo.invalid');
const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('iab_cert_registry_v1')).settings);
assert.ok(!('supabaseUrl' in stored) && !('supabaseAnonKey' in stored), 'legacy connection settings removed');
assert.equal((await calls()).find((c) => c[0] === 'createClient')[1], PROJECT, 'legacy URL ignored');
ok('saved browser connection settings are migrated away and ignored');

// 7. Invalid sign-in: safe generic error, no session, Supabase called once (no local fallback for demo users).
t = await text();
assert.match(t, /Invalid email or password\./);
assert.equal(await page.evaluate(() => sessionStorage.getItem('iab_cert_session')), null);
assert.deepEqual((await calls()).filter((c) => c[0] === 'signIn'), [['signIn', 'legacy@demo.invalid']]);
ok('invalid sign-in shows a safe error; legacy demo user cannot sign in');

// Service outage on sign-in is reported as unavailable, not as bad credentials.
mode = { signInError: { status: 0, message: 'Failed to fetch' } };
await page.reload(); await signIn('staff@example.invalid');
assert.match(await text(), /sign-in service is unavailable/i);
ok('sign-in outage shows an unavailable message');

// 6. Valid sign-in calls Supabase exactly once.
await fresh(SITE + 'index.html');
await signIn('staff@example.invalid');
assert.deepEqual((await calls()).filter((c) => c[0] === 'signIn'), [['signIn', 'staff@example.invalid']]);
assert.equal(JSON.parse(await page.evaluate(() => sessionStorage.getItem('iab_cert_session'))).email, 'staff@example.invalid');
await page.getByRole('button', { name: 'Settings' }).click();
t = await text();
assert.match(t, /meyodifbsxibnvhjsnvf/); assert.match(t, /sb_publishable_…[A-Za-z0-9_-]{4}\b/);
assert.ok(!(await page.evaluate(() => document.body.innerHTML)).includes(await page.evaluate(() => window.IAB_SUPABASE.publishableKey)), 'full key never rendered');
ok('valid sign-in calls Supabase once; Settings shows read-only project + redacted key');

// 8-10. Forgot-password form, production redirect URL, neutral response.
await fresh(SITE);
await page.getByRole('button', { name: 'Forgot password?' }).click();
await page.waitForSelector('text=Reset your password');
assert.ok(await page.getByRole('button', { name: 'Send reset link' }).isVisible());
await shot('02-forgot-password');
await page.fill('input[type=email]', 'not-an-email');
await page.getByRole('button', { name: 'Send reset link' }).click();
await page.waitForTimeout(200);
assert.match(await text(), /Enter a valid email address/);
assert.equal((await calls()).filter((c) => c[0] === 'reset').length, 0);
await page.fill('input[type=email]', 'staff@example.invalid');
await page.getByRole('button', { name: 'Send reset link' }).click();
await page.waitForSelector(`text=${NEUTRAL}`);
assert.deepEqual((await calls()).filter((c) => c[0] === 'reset'), [['reset', 'staff@example.invalid', SITE + 'reset-password.html']]);
await shot('02b-forgot-sent');
const sentText = await page.locator('[role=status]').innerText();
mode = { resetError: { status: 400, message: 'User not found' } };
await page.reload();
await page.getByRole('button', { name: 'Forgot password?' }).click();
await page.fill('input[type=email]', 'nobody@example.invalid');
await page.getByRole('button', { name: 'Send reset link' }).click();
await page.waitForSelector(`text=${NEUTRAL}`);
assert.equal(await page.locator('[role=status]').innerText(), sentText, 'identical response whether or not the account exists');
await page.getByRole('button', { name: '← Back to sign in' }).click();
await page.waitForSelector('text=Staff sign in');
ok('forgot-password: renders, validates, uses production redirect URL, neutral wording');

// Old recovery links that land on the sign-in page are forwarded to the reset page.
await fresh(SITE + 'index.html' + RECOVERY_HASH);
await page.waitForSelector('body[data-state=form]');
assert.equal(page.url(), SITE + 'reset-password.html' + RECOVERY_HASH);
await fresh(SITE + 'index.html#access_token=stub&type=signup');
await page.waitForSelector('text=Staff sign in');
assert.equal(new URL(page.url()).pathname, '/iab-certificate-generator/index.html', 'non-recovery fragment not forwarded');
await fresh(SITE + 'index.html#section-2');
await page.waitForSelector('text=Staff sign in');
assert.equal(new URL(page.url()).pathname, '/iab-certificate-generator/index.html');
ok('recovery link landing on sign-in page is forwarded to reset-password.html; other links are not');

// 15. Expired / used link, and a page opened without a link.
await fresh(SITE + 'reset-password.html#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired');
assert.equal(await page.getAttribute('body', 'data-state'), 'expired');
assert.match(await text(), /expired or has already been used/);
await shot('04-link-expired');
await fresh(SITE + 'reset-password.html');
assert.equal(await page.getAttribute('body', 'data-state'), 'invalid');
assert.equal((await calls()).filter((c) => c[0] === 'createClient').length, 0, 'no client without a recovery link');
for (const bad of ['#type=recovery', '#access_token=stub', '#access_token=&type=recovery', '#error=server_error&error_description=x']) {
  await fresh(SITE + 'reset-password.html' + bad);
  assert.equal(await page.getAttribute('body', 'data-state'), 'invalid', 'malformed link ' + bad);
}
ok('expired/used, missing and malformed links get clear messages');

// 11-14, 16. Valid recovery session -> form; empty/weak/mismatch rejected; valid -> updateUser; sign out; back to sign-in.
await fresh(SITE + 'reset-password.html' + RECOVERY_HASH);
await page.waitForSelector('body[data-state=form]');
const submit = () => page.getByRole('button', { name: 'Update password' }).click();
const formMsg = () => page.locator('#form-msg').innerText();
await submit(); assert.match(await formMsg(), /Enter a new password/);
await page.fill('#pw1', 'short1A!'); await page.fill('#pw2', 'short1A!'); await submit();
assert.match(await formMsg(), /does not meet all of the requirements/);
await page.fill('#pw1', 'alllowercaseletters'); await page.fill('#pw2', 'alllowercaseletters'); await submit();
assert.match(await formMsg(), /does not meet all of the requirements/);
await shot('03a-weak-password');
await page.fill('#pw1', GOOD); await page.fill('#pw2', GOOD + 'x'); await submit();
assert.match(await formMsg(), /do not match/);
assert.equal((await calls()).filter((c) => c[0] === 'updateUser').length, 0, 'no update for rejected input');
await page.check('#show');
assert.equal(await page.getAttribute('#pw1', 'type'), 'text');
await page.uncheck('#show');
await page.fill('#pw2', GOOD);
assert.equal(await page.locator('#rules li.met').count(), 5);
await shot('03-new-password');
const logs = []; page.on('console', (m) => logs.push(m.text()));
await submit();
await page.waitForSelector('body[data-state=done]');
const c = await calls();
assert.deepEqual(c.filter((x) => x[0] === 'updateUser'), [['updateUser', 'password', GOOD]]);
assert.ok(c.some((x) => x[0] === 'signOut'), 'recovery session signed out');
assert.equal(await page.inputValue('#pw1'), '');
assert.ok(!(await text()).includes(GOOD) && !logs.some((l) => l.includes(GOOD)), 'password never displayed or logged');
await shot('05-password-updated');
await page.waitForURL(SITE + 'index.html', { timeout: 8000 });
ok('recovery session detected; empty/weak/mismatch rejected; updateUser({password}) once; signed out; returned to sign-in');

// Recovery session expired at submit time -> expired state.
await fresh(SITE + 'reset-password.html' + RECOVERY_HASH, { updateError: { status: 403, code: 'session_not_found', message: 'Session not found' } });
await page.waitForSelector('body[data-state=form]');
await page.fill('#pw1', GOOD); await page.fill('#pw2', GOOD); await submit();
await page.waitForSelector('body[data-state=expired]');
// Server-side failure -> explicit update-failed message, form still usable.
await fresh(SITE + 'reset-password.html' + RECOVERY_HASH, { updateError: { status: 500, message: 'boom' } });
await page.waitForSelector('body[data-state=form]');
await page.fill('#pw1', GOOD); await page.fill('#pw2', GOOD); await submit();
assert.match(await formMsg(), /temporarily unavailable/);
await fresh(SITE + 'reset-password.html' + RECOVERY_HASH, { updateError: { status: 422, code: 'same_password', message: 'same' } });
await page.waitForSelector('body[data-state=form]');
await page.fill('#pw1', GOOD); await page.fill('#pw2', GOOD); await submit();
assert.match(await formMsg(), /must be different/);
ok('expired session, outage and reused-password errors handled at submit');

// Issue -> the certificate row (with a random QR token) is written to the central register; revoke updates it there.
await fresh(SITE, { role: 'Administrator' });
await signIn('admin@example.invalid');
await page.getByRole('button', { name: 'Import & Issue' }).first().click();
const xlsx = await page.evaluate(() => { const X = window.XLSX, wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([['Registration ID', 'Intake Month', 'Intake Year', 'Full Name', 'Omang No.', 'Passport No.', 'Course', 'Payment Status', 'Formative Total', 'Exam Mark', 'Resit Mark', 'Overall Mark', 'Exam Date'],
    ['TEST-000001', 'March', '2026', 'Synthetic Test Learner', '000000001', '', 'Introduction to Long Term Insurance', 'Paid', 72, 55, 0, 63, '5 June 2026']]), 'Results');
  return X.write(wb, { type: 'base64', bookType: 'xlsx' }); });
await page.setInputFiles('input[type=file]', { name: 'synthetic.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(xlsx, 'base64') });
await page.getByRole('button', { name: 'Validate learners' }).click();
await page.getByRole('button', { name: /Generate 1 selected/ }).waitFor();
const dl = page.waitForEvent('download', { timeout: 60000 });
await page.getByRole('button', { name: /Generate 1 selected/ }).click();
await dl; await page.waitForTimeout(500);
let cs = await calls();
assert.deepEqual(cs.filter((x) => x[0] === 'rpc').map((x) => x[1]), ['reserve_certificate_reference']);
const ins = cs.filter((x) => x[0] === 'insert');
assert.equal(ins.length, 1, 'one central register insert');
const row = ins[0][2];
assert.equal(ins[0][1], 'certificates');
assert.equal(row.certificate_reference, 'IAB/CERT/LTI/2026MAR/202611/0001');
assert.equal(row.status, 'Issued');
assert.match(row.verification_token, /^[A-Za-z0-9_-]{22}$/);
assert.equal(row.generated_by, '00000000-0000-0000-0000-0000000000aa');
assert.ok(!('id' in row) && !('course_code' in row), 'local-only fields are not sent');
const local = await page.evaluate(() => JSON.parse(localStorage.getItem('iab_cert_registry_v1')));
assert.equal(local.certificates[0].verification_token, row.verification_token, 'register keeps the token for reprints');
assert.equal(local.settings.verifyUrl, SITE + 'verify.html', 'QR points at the production verify page');
await page.getByRole('button', { name: 'Register' }).first().click();
await page.getByRole('button', { name: 'Open' }).first().click();
await page.getByRole('button', { name: /^Revoke/ }).first().click();
await page.locator('textarea').fill('Synthetic test revocation');
await page.getByRole('button', { name: /Revoke/ }).last().click();
await page.waitForTimeout(500);
assert.deepEqual((await calls()).filter((x) => x[0] === 'update'), [['update', 'certificates', 'Revoked', 'certificate_reference', 'IAB/CERT/LTI/2026MAR/202611/0001']]);
ok('issue writes one tokenised certificate row to the central register; revoke updates it there');

// 19. Public QR verification (fresh, signed-out browser): token from the QR, limited typed lookup, all failure modes.
const REF = 'IAB/CERT/LTI/2026MAR/202607/0001', TOK = 'AbCdEfGhIjKlMnOpQrStUv';
const vcalls = async () => (await calls()).filter((x) => x[0] === 'rpc');
await fresh(SITE + 'verify.html?ref=' + encodeURIComponent(REF) + '&t=' + TOK);
await page.waitForSelector('text=Test Learner');
assert.deepEqual(await vcalls(), [['rpc', 'verify_certificate', REF, TOK]]);
t = await text();
assert.match(t, /VALID/); assert.match(t, /5 June 2026/); assert.match(t, /Introduction to Long Term Insurance/);
assert.doesNotMatch(t, /Omang|000000001|Paid/);
await shot('06-verify-valid');
const mob = await ctx.newPage(); await mob.setViewportSize({ width: 375, height: 812 });
for (const [name, u] of [['06m-verify-valid-mobile', 'verify.html?ref=' + encodeURIComponent(REF) + '&t=' + TOK], ['01m-sign-in-mobile', ''], ['03m-reset-mobile', 'reset-password.html' + RECOVERY_HASH], ['04m-expired-mobile', 'reset-password.html#error_code=otp_expired']]) {
  await mob.goto(SITE + u); await mob.waitForTimeout(1200);
  assert.ok(await mob.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), name + ': no horizontal scroll');
  if (shots) await mob.screenshot({ path: path.join(shots, name + '.png'), fullPage: true });
}
await mob.close();
await fresh(SITE + 'verify.html?ref=' + encodeURIComponent(REF));
await page.waitForSelector('text=T. L. (initials)');
assert.deepEqual(await vcalls(), [['rpc', 'verify_certificate', REF, null]]);
assert.match(await text(), /Scan the QR code on the original certificate/);
await fresh(SITE + 'verify.html?ref=' + encodeURIComponent(REF) + '&t=' + TOK);
await page.waitForSelector('text=Test Learner');
await page.fill('input[aria-label="Certificate reference"]', REF.replace(/0001$/, '0002'));
await page.getByRole('button', { name: 'Verify' }).click(); await page.waitForTimeout(300);
assert.deepEqual((await vcalls()).at(-1), ['rpc', 'verify_certificate', REF.replace(/0001$/, '0002'), null], 'token never sent for a different reference');
await fresh(SITE + 'verify.html?ref=' + encodeURIComponent("x' or 1=1"));
await page.waitForSelector('text=not a valid iAB certificate reference');
assert.equal((await vcalls()).length, 0, 'malformed reference never reaches the server');
await fresh(SITE + 'verify.html?ref=' + encodeURIComponent(REF.replace(/0001$/, '9999')), { verify: { data: { result: 'not_found' }, error: null } });
await page.waitForSelector('text=No certificate matches this reference');
await shot('07-verify-not-found');
await fresh(SITE + 'verify.html?ref=' + encodeURIComponent(REF) + '&t=' + TOK, { verify: { data: { result: 'found', detail: 'full', certificate_reference: REF, status: 'Revoked', course: 'X', issue_date: '2026-07-01', award_date: null, learner_name: 'Test Learner' }, error: null } });
await page.waitForSelector('text=has been revoked');
assert.match(await text(), /REVOKED/);
await fresh(SITE + 'verify.html?ref=' + encodeURIComponent(REF), { verify: { data: null, error: { message: 'relation "certificates" does not exist', code: '42P01' } } });
await page.waitForSelector('text=Verification service unavailable');
assert.doesNotMatch(await text(), /relation|42P01/, 'raw database errors never shown');
ok('verify.html: QR token, limited typed lookup, token scoping, malformed, not found, revoked, internal error; mobile layout');

// Fail closed: invalid config (e.g. someone pastes a secret key) disables sign-in, recovery and verification.
configBody = fs.readFileSync(path.join(repo, 'config.js'), 'utf8').replace(/var publishableKey = '[^']*'/, `var publishableKey = '${'sb_' + 'secret_' + 'x'.repeat(24)}'`);
await fresh(SITE);
await page.waitForSelector('text=not configured correctly');
assert.equal(await page.getByRole('button', { name: /configure/i }).count(), 0, 'no manual override in production');
await signIn('staff@example.invalid');
assert.equal(await page.evaluate(() => sessionStorage.getItem('iab_cert_session')), null);
assert.equal((await calls()).filter((x) => x[0] === 'createClient' || x[0] === 'signIn').length, 0);
await page.getByRole('button', { name: 'Forgot password?' }).click();
await page.fill('input[type=email]', 'staff@example.invalid');
await page.getByRole('button', { name: 'Send reset link' }).click();
await page.waitForSelector('text=Password recovery is currently unavailable');
await fresh(SITE + 'reset-password.html' + RECOVERY_HASH);
assert.equal(await page.getAttribute('body', 'data-state'), 'unavailable');
await fresh(SITE + 'verify.html?ref=' + encodeURIComponent(REF));
await page.waitForSelector('text=Verification service unavailable');
configBody = null;
ok('invalid configuration fails closed everywhere (no setup modal, no demo fallback)');

// 22. Nothing reached Supabase.
assert.deepEqual(supabaseHits, [], 'no network requests to Supabase');
ok('no requests reached any Supabase project');

await browser.close();
console.log(`PASS: auth, recovery and verification paths (${n} checks)`);
process.exit(0);
