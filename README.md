# iAB Certificate Generator

Certificate generation, register and reprint system for the **Insurance Academy of Botswana**.
Authorised iAB staff import learner results (Excel/CSV), validate eligibility, issue premium
A4 Certificates of Proficiency as PDFs, maintain the certificate register, and reprint or
issue corrected versions — with a full audit trail and QR verification.

## Files to upload to GitHub

Upload the ENTIRE contents of this folder to the root of your repository:

- `index.html` — the application (PRODUCTION entry file; GitHub Pages opens this)
- `config.js` — the production Supabase Project URL + **publishable** key (public by design)
- `reset-password.html` — page that password-recovery emails link to
- `verify.html` — public certificate-verification page (QR target)
- `support.js`, `src/`, `_ds/`, `assets/` — runtime, engine, brand styles, logo/signature artwork
- `database/` — Supabase SQL (schema, policies, functions, seed) — contains no secrets
- `.nojekyll` — required so GitHub Pages serves folders starting with `_` (do not delete)
- `README.md`, `PRIVACY.md`

## GitHub Pages settings

Repository → Settings → Pages:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/(root)`

The app works from a project subdirectory (e.g. `https://<user>.github.io/iab-certificate-generator/`)
— all paths are relative.

## Supabase setup (required before production use)

1. Create a project at supabase.com.
2. SQL editor → run `database/schema.sql`, then `database/policies.sql`, then `database/seed.sql`,
   then every `database/migrations/NNN_*.sql` in order (idempotent; each has a `.rollback.sql`).
   Migration 001 removes all table privileges from `anon`, makes reference allocation staff-only and
   replaces `verify_certificate` with the token-aware public endpoint.
3. Storage → create a **private** bucket named `certificates`.
4. Authentication → add staff users, then insert a `staff_profiles` row per user
   (role: Administrator / Certificate Issuer / Viewer — see seed.sql comments).
5. Put the **Project URL** and the **publishable key** (`sb_publishable_…`) in `config.js`.
   This is the only place the connection is set; browsers cannot override it. If the values are
   missing or invalid (e.g. a secret or legacy JWT key), sign-in, recovery and verification fail closed.
6. Authentication → URL Configuration: Site URL = the deployed app URL; add
   `<app URL>/reset-password.html` to Redirect URLs (needed for "Forgot password?").

**Never enter a secret key, service-role key or database password into the browser
application or commit one to GitHub.** The publishable key is safe only because every
table has Row Level Security and certificate numbers are issued by the
`reserve_certificate_reference()` security-definer function.

If `config.js` is invalid, the sign-in page says the production connection is not configured
correctly and refuses sign-in. There is no setup screen, demo or local login: staff sign-in is Supabase Auth only. Never commit passwords;
run `git config core.hooksPath .githooks` once per clone to enable the secret check.

## Verification page

Each issued certificate is written to the central `certificates` table with a random 128-bit
`verification_token`. Its QR code opens `verify.html?ref=<reference>&t=<token>`
(default base: `https://shepmurashiki-ship-it.github.io/iab-certificate-generator/verify.html`).

Anonymous visitors can only call `verify_certificate(reference, token)`; they have no table access.
- QR scan (reference + matching token): status, learner name, course, award date, issue date.
- Reference typed in without the token (or a certificate issued before tokens existed): the same,
  but the learner's **initials only**, so sequential references cannot be used to harvest names.
- Unknown, malformed, wildcard or wrong-token input, and draft/failed certificates: "not found".
Identity numbers, marks, payment status, contact details and internal ids are never returned.

## Tests

    npm i --no-save playwright-core            # once
    node tests/security-check.mjs              # secrets / config / demo-auth guard (also the pre-commit hook)
    node tests/auth-path.test.mjs              # sign-in, recovery, issue, verification (stubbed Supabase)
    node tests/certificate-render.test.mjs     # PDF + preview, QR decode, no regulator logos
    sh tests/db-migration.test.sh              # schema + migrations + RLS on a throwaway local PostgreSQL
    node tests/live-rls.test.mjs               # LIVE read-only negative checks with the public key

## Privacy

Learner and certificate information must NOT be committed to GitHub — the repository
contains application code only. See PRIVACY.md.
