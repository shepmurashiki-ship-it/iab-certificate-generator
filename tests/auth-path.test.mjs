// Auth-path check for index.html: staff sign-in must be Supabase-only, with no demo/local fallback.
// The Supabase CDN script is replaced by a recording stub; no real auth requests are made.
// Needs: Node 18+, `npm i --no-save playwright-core`, Google Chrome (or CHROME=<path>).
// Usage: node tests/auth-path.test.mjs
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PORT = 8766;
const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: repo, stdio: 'ignore' });
process.on('exit', () => srv.kill());
await new Promise((r) => setTimeout(r, 1200));

const STUB = `window.__authCalls = [];
window.supabase = { createClient: () => ({
  auth: { signInWithPassword: async (c) => { window.__authCalls.push(c.email); return { data: { user: { id: 'u1', email: c.email } }, error: null }; }, signOut: async () => {} },
  from: () => { const q = { select: () => q, eq: () => q, single: async () => ({ data: { full_name: 'Stub Staff', role: 'Viewer' } }) }; return q; }
}) };`;
const LS_KEY = 'iab_cert_registry_v1';
const pw = 'x'.repeat(12); // arbitrary, not a credential

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage();
await page.route(/supabase-js/, (r) => r.fulfill({ contentType: 'application/javascript', body: STUB }));
const url = `http://127.0.0.1:${PORT}/index.html`;

async function attempt(email) {
  await page.waitForSelector('input[type=email]');
  await page.fill('input[type=email]', email);
  await page.fill('input[type=password]', pw);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(800);
  return page.evaluate(() => ({
    session: sessionStorage.getItem('iab_cert_session'),
    body: document.body.innerText,
    calls: window.__authCalls
  }));
}
const seed = (extra) => page.evaluate(([k, extra]) => {
  localStorage.setItem(k, JSON.stringify(Object.assign({ certificates: [], counters: {}, events: [], batches: [], learners: [], mappings: {},
    settings: Object.assign({}, window.IABEngine.INSTITUTION_DEFAULTS) }, extra)));
  sessionStorage.clear();
}, [LS_KEY, extra]);

// 1. Fresh browser, Supabase not configured: sign-in refused, no demo hint, no session.
await page.goto(url);
await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
await page.reload();
let r = await attempt('anyone@example.invalid');
assert.equal(r.session, null, 'no session without Supabase');
assert.match(r.body, /Please contact the iAB system administrator/);
assert.doesNotMatch(r.body, /Local demo mode/i);
assert.equal(r.calls.length, 0);

// 2. Legacy registry from an older build still holding demo users: no local credential path accepts them.
await seed({ users: [{ email: 'legacy@demo.invalid', name: 'Legacy', role: 'Administrator', password: pw }] });
await page.reload();
r = await attempt('legacy@demo.invalid');
assert.equal(r.session, null, 'legacy demo user must not sign in');
assert.equal(r.calls.length, 0);

// 3. Supabase configured: sign-in goes through supabase.auth.signInWithPassword only.
await seed({ settings: Object.assign(await page.evaluate(() => Object.assign({}, window.IABEngine.INSTITUTION_DEFAULTS)),
  { supabaseUrl: 'https://project.example.invalid', supabaseAnonKey: 'placeholder-publishable' }) });
await page.reload();
r = await attempt('staff@example.invalid');
assert.deepEqual(r.calls, ['staff@example.invalid'], 'Supabase auth called once');
assert.equal(JSON.parse(r.session).email, 'staff@example.invalid');

await browser.close();
console.log('PASS: auth path is Supabase-only (3 cases)');
process.exit(0);
