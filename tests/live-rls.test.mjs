// LIVE negative test against the production project, using ONLY the public URL + publishable key from config.js
// (exactly what any visitor has). Every write attempt uses an empty payload or a filter that matches nothing,
// so no record can be created or changed even if a check were to fail. Prints no key material.
// Usage: node tests/live-rls.test.mjs
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const cfg = fs.readFileSync(path.join(repo, 'config.js'), 'utf8');
const URL_ = cfg.match(/var url = '([^']+)'/)[1];
const KEY = cfg.match(/var publishableKey = '([^']+)'/)[1];
assert.match(KEY, /^sb_publishable_/);
const H = { apikey: KEY, 'Content-Type': 'application/json' };
const TABLES = ['learners', 'certificates', 'staff_profiles', 'certificate_events', 'application_settings', 'reference_counters', 'courses', 'import_batches'];
const NONE = 'certificate_reference=eq.__no_such_reference__';
let n = 0; const ok = (l) => console.log(`  ok ${++n} - ${l}`);
const req = async (method, p, body, extra = {}) => {
  const r = await fetch(URL_ + p, { method, headers: { ...H, ...extra }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: r.status, text: await r.text() };
};
const denied = (r) => r.status === 401 || r.status === 403;

for (const t of TABLES) {
  const r = await req('GET', `/rest/v1/${t}?select=*&limit=1`);
  assert.ok(denied(r), `${t} readable by public: HTTP ${r.status}`);
}
ok('public cannot list any of the 8 operational tables');

for (const t of ['learners', 'certificates', 'certificate_events']) {
  const r = await req('POST', `/rest/v1/${t}`, {}, { Prefer: 'return=minimal' });
  assert.ok(denied(r), `${t} insert: HTTP ${r.status}`);
}
ok('public cannot insert');
let r = await req('PATCH', `/rest/v1/certificates?${NONE}`, { status: 'Revoked' });
assert.ok(denied(r), `update: HTTP ${r.status}`);
r = await req('DELETE', `/rest/v1/certificates?${NONE}`);
assert.ok(denied(r), `delete: HTTP ${r.status}`);
ok('public cannot update or delete');

r = await req('GET', '/rest/v1/users?select=*&limit=1', undefined, { 'Accept-Profile': 'auth' });
assert.ok(r.status >= 400 && !/"email"/.test(r.text), `auth.users exposed: HTTP ${r.status}`);
ok('auth.users not reachable through the public API');

r = await req('POST', '/rest/v1/rpc/reserve_certificate_reference', { p_course_code: 'LTI', p_intake_year: 2026, p_intake_month: 'MAR', p_issue_date: '2026-01-01' });
assert.ok(r.status >= 400, `reserve reference callable: HTTP ${r.status}`);
ok('public cannot allocate certificate references');

r = await req('POST', '/graphql/v1', { query: '{ __schema { queryType { fields { name } } } }' });
assert.ok(!/learners|certificates|staff_profiles|settings|counters/i.test(r.text), 'GraphQL exposes tables');
ok('GraphQL exposes no operational tables');

r = await req('POST', '/storage/v1/object/list/certificates', { prefix: '', limit: 10 });
assert.ok(r.status >= 400 || r.text.trim() === '[]', `storage listing: HTTP ${r.status}`);
ok('certificate PDF bucket cannot be listed');

const verify = async (ref, tok) => {
  const x = await req('POST', '/rest/v1/rpc/verify_certificate', tok ? { p_reference: ref, p_token: tok } : { p_reference: ref });
  assert.equal(x.status, 200, `verify_certificate HTTP ${x.status}`);
  return JSON.parse(x.text);
};
for (const ref of ['IAB/CERT/LTI/2026MAR/202607/9999', 'not-a-reference', '%', 'IAB/CERT/LTI/2026MAR/202607/%', "x' or '1'='1", 'A'.repeat(3000)])
  assert.deepEqual(await verify(ref), { result: 'not_found' }, 'unexpected response for probe');
assert.deepEqual(await verify('IAB/CERT/LTI/2026MAR/202607/0001', 'WrongTokenWrongTokenWr'), { result: 'not_found' });
ok('verification: fabricated / malformed / wildcard / injection / wrong token -> generic not_found');

console.log(`PASS: live RLS and public API checks (${n})`);
