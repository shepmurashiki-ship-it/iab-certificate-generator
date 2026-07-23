# iAB Certificate Generator

Certificate generation, register and reprint system for the **Insurance Academy of Botswana**.
Authorised iAB staff import learner results (Excel/CSV), validate eligibility, issue premium
A4 Certificates of Proficiency as PDFs, maintain the certificate register, and reprint or
issue corrected versions — with a full audit trail and QR verification.

## Files to upload to GitHub

Upload the ENTIRE contents of this folder to the root of your repository:

- `index.html` — the application (PRODUCTION entry file; GitHub Pages opens this)
- `verify.html` — public certificate-verification page (QR target)
- `index-demo.html` — LOCAL DEMO ONLY, DO NOT DEPLOY to a public site
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
2. SQL editor → run `database/schema.sql`, then `database/policies.sql`, then `database/seed.sql`.
   (`functions.sql` repeats the functions already created by schema.sql.)
3. Storage → create a **private** bucket named `certificates`.
4. Authentication → add staff users, then insert a `staff_profiles` row per user
   (role: Administrator / Certificate Issuer / Viewer — see seed.sql comments).
5. Open the deployed app → an Administrator signs in → Settings → Database connection →
   enter the **Supabase project URL** and the **publishable (anon public) key** → Save.

**Never enter a secret key, service-role key or database password into the browser
application or commit one to GitHub.** The publishable key is safe only because every
table has Row Level Security and certificate numbers are issued by the
`reserve_certificate_reference()` security-definer function.

Until Supabase is configured, `index.html` shows:
“Production database and authentication have not yet been configured.”
It never falls back to demo credentials. `index-demo.html` (local evaluation only)
uses a browser-local registry with fictional data.

## Verification page

Certificate QR codes point to the URL in **Settings → Verification URL (QR)**.
After deployment, set it once to your live page, e.g.
`https://<user>.github.io/iab-certificate-generator/verify.html`.
The page exposes only: reference, learner name, course, intake, issue date, status.

## Privacy

Learner and certificate information must NOT be committed to GitHub — the repository
contains application code only. See PRIVACY.md.
