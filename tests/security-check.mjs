// Secret / demo-auth guard. Never prints matched values, only file:line and rule.
// Usage: node tests/security-check.mjs            (every file GitHub Pages would serve)
//        node tests/security-check.mjs --staged   (added lines in the index; used by .githooks/pre-commit)
// Optional local denylist (never committed): .git/info/secret-denylist, one "<length> <sha256hex>" per line.
// Any exact occurrence of a denylisted value fails the check.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const git = (...a) => execFileSync('git', a, { cwd: repo, encoding: 'utf8', maxBuffer: 64 << 20 });
const staged = process.argv.includes('--staged');

const PW_LITERAL = /(pass(word|wd|phrase)?|pwd)\w*["']?\s*[:=]\s*["'`][^"'`\s]+["'`]/i;
const SECRET_LITERAL = /(secret|smtp|api[_-]?key|service[_-]?role|private[_-]?key|auth[_-]?token)\w*["']?\s*[:=]\s*["'`][^"'`\s]{6,}["'`]/i;
const URL_CRED = /[a-z][a-z0-9+.-]*:\/\/[^/\s:@"'`]+:[^@\s"'`/]+@/i;
const COMPANY_EMAIL = /@iab\.co\.bw/i;
const SECRET_FILE = /(^|\/)(\.env(\..*)?|[^/]*\.(pem|key|p12|pfx))$/i;

const problems = [];
const fail = (where, rule) => problems.push(`${where}  ${rule}`);

// ---- collect units: { name, lines: [{ n, text }] } ----
const units = [];
if (staged) {
  let cur = null, n = 0;
  for (const l of git('diff', '--cached', '-U0', '--no-color', '--diff-filter=ACMR').split('\n')) {
    if (l.startsWith('+++ ')) { cur = { name: l.slice(6), lines: [] }; units.push(cur); continue; }
    const h = l.match(/^@@ -\S+ \+(\d+)/); if (h) { n = +h[1]; continue; }
    if (cur && l.startsWith('+')) cur.lines.push({ n: n++, text: l.slice(1) });
  }
  for (const f of git('diff', '--cached', '--name-only', '--diff-filter=A').split('\n').filter(Boolean))
    if (SECRET_FILE.test(f)) fail(f, 'secret-bearing file type must not be committed');
} else {
  for (const f of git('ls-files', '-co', '--exclude-standard').split('\n').filter(Boolean)) {
    if (!fs.existsSync(path.join(repo, f))) continue;
    if (SECRET_FILE.test(f)) fail(f, 'secret-bearing file type is not git-ignored');
    const buf = fs.readFileSync(path.join(repo, f));
    if (buf.includes(0)) continue; // binary
    units.push({ name: f, lines: buf.toString('utf8').split('\n').map((text, i) => ({ n: i + 1, text })) });
  }
}

// ---- line rules ----
for (const u of units) {
  u.lines.forEach(({ n, text }, i) => {
    const at = `${u.name}:${n}`;
    if (PW_LITERAL.test(text)) fail(at, 'hard-coded password literal');
    if (SECRET_LITERAL.test(text)) fail(at, 'hard-coded secret/key literal');
    if (URL_CRED.test(text)) fail(at, 'credentials embedded in URL');
    const near = u.lines.slice(Math.max(0, i - 3), i + 4).map((x) => x.text).join('\n');
    if (COMPANY_EMAIL.test(text) && PW_LITERAL.test(near)) fail(at, '@iab.co.bw address beside a password');
    if (/LocalDB\.signIn|\.users\.find\(/.test(text)) fail(at, 'local (non-Supabase) credential check');
  });
}

// ---- denylisted exact values (hash compare over every substring of the listed length) ----
const denyFile = path.resolve(repo, git('rev-parse', '--git-common-dir').trim(), 'info', 'secret-denylist');
const deny = fs.existsSync(denyFile)
  ? fs.readFileSync(denyFile, 'utf8').split('\n').map((l) => l.trim().split(/\s+/)).filter((p) => p.length === 2).map(([len, h]) => ({ len: +len, h }))
  : [];
for (const { len, h } of deny) {
  for (const u of units) for (const { n, text } of u.lines) {
    for (let i = 0; i + len <= text.length; i++) {
      if (createHash('sha256').update(text.slice(i, i + len)).digest('hex') === h) { fail(`${u.name}:${n}`, 'known exposed value (denylist)'); break; }
    }
  }
}

// ---- demo auth must be impossible in the served app (full-tree mode) ----
if (!staged) {
  const read = (f) => fs.readFileSync(path.join(repo, f), 'utf8');
  for (const f of ['index.html', 'verify.html'])
    if (!/window\.DEPLOYMENT_CONFIG\s*=\s*\{\s*production:\s*true/.test(read(f))) fail(f, 'DEPLOYMENT_CONFIG.production must be true');
  const login = read('index.html').match(/async doLogin\(\)[\s\S]*?\n {2}\}/);
  if (!login || !/if \(!this\._supa\) throw/.test(login[0]) || /LocalDB/.test(login[0])) fail('index.html', 'doLogin must be Supabase-only');
  if (/\bsignIn\s*\(\s*db\b/.test(read('src/engine.js'))) fail('src/engine.js', 'local signIn(db, ...) must not exist');
  if (/showDemoHint|Local demo mode/.test(read('index.html'))) fail('index.html', 'demo sign-in hint present');
}

if (problems.length) {
  console.error(`security-check: ${problems.length} problem(s) (values not shown):\n  ` + problems.join('\n  '));
  console.error('Fix them, or bypass only if certain: git commit --no-verify');
  process.exit(1);
}
console.log(`security-check: OK (${staged ? 'staged changes' : units.length + ' files'}; denylist entries: ${deny.length}${deny.length ? '' : ' (none: .git/info/secret-denylist absent)'})`);
