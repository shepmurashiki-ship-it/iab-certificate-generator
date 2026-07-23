# iAB — Insurance Academy of Botswana · Design System

> **Study. Learn. Earn.** The single source of truth for how iAB looks, sounds and behaves across every medium — from a graduation certificate to a national billboard, an email signature to the Moodle student portal.

This project is a compiled design system: token CSS, brand assets, reusable React components, and full-screen UI kits. Consumers link the single root `styles.css`.

---

## 1 · Company context

The **Insurance Academy of Botswana (iAB)** is Botswana's leading specialist provider of insurance and financial-services training, established **2015**, headquartered in Gaborone. It delivers accredited, industry-focused education — classroom, online, distance and corporate — that turns study into competence and competence into careers.

- **Positioning:** Botswana's premier insurance & financial-services academy; the standard the sector measures itself against. Aiming to be the leading academy of its kind in Africa.
- **Accreditation:** BQA **ETP0198** · TVET **000700** · **HRDC** Accredited · Company Reg. **BW0000132853**.
- **Proof points:** 10+ years · 10,000+ professionals trained · 20+ corporate clients · nationwide delivery · NBFIRA-aligned.
- **HQ:** Unit 1, Plot 102, Light Industrial, Commerce Park, Gaborone · **+267 311 7200** · info@iab.co.bw · www.iab.co.bw
- **Personality:** Professional & authoritative; knowledgeable but approachable; premium but accessible; confident without arrogance. **Not** a university, a generic MOOC platform, a coaching business, a recruitment agency, a fintech or a broker.

### Source materials provided
- `uploads/iAB_Brand_Identity_Guidelines.md` — the full 41-page brand book (Edition 01, July 2026). Primary source of truth.
- Metallic & flat logo renders (PNG) — copied into `assets/logos/`.
- Logo-reveal motion package (MP4 / WebM / posters) — key frames copied into `assets/media/`.
- `iAB_SVG_Logo_Assets.zip` was referenced but **did not arrive in the filesystem** — see Caveats.

---

## 2 · Content fundamentals — how iAB writes

**Voice:** Clear · Confident · Credible · Considered. It sounds the way the design looks — an expert who respects the reader's time.

- **Person & tone.** Warm but authoritative. Speaks to each audience directly ("Build a career…", "For employers"). Uses "we" for the institution. Never hype, never exclamation marks, never ALL-CAPS shouting.
- **Casing.** Sentence case for headings and body. Overlines and small labels are UPPERCASE with generous tracking. The brand name is always **iAB** — lowercase i, capital A, capital B. Never "IAB", "iab" or "I.A.B."
- **Spelling.** **British English** — programme, colour, organisation, specialise.
- **Evidence over adjectives.** Accreditations and numbers carry the argument: "Accredited by BQA & HRDC", "10,000+ trained". Lead with outcomes.
- **The tagline.** *Study. Learn. Earn.* — always sentence-cased, with full stops, in order, never translated. "Learn" may be emphasised in gold.
- **No emoji. No slang. No jargon without reason.** Let white space work — never crowd copy.
- **Audience messages:** Students → "A recognised qualification and a real career." Employers → "Levy-claimable training that builds industry-ready teams." Professionals → "Sharpen expertise with accredited, current programmes." Partners/Govt → "A trusted, accredited partner strengthening Botswana's sector."

**Example headline + subhead:**
> **Build a career in insurance & financial services.**
> Practical, accredited learning that builds careers — grounded in Botswana's legislation and market.

---

## 3 · Visual foundations

The system is **minimal, elegant, structured and timeless** — every touchpoint should resemble a premium annual report.

- **Colour.** Deep **Navy `#0A1628`** is primary (≈55% of any layout). **White / warm ivory** dominates to maximise readability (≈30%). **Champagne Gold** is reserved for emphasis — rules, icons, key highlights, metallic hero moments (≈10%). Functional colours (success/warning/error/info) ≈5%. Gold is a **metallic foil at large sizes only**; for flat/digital use **Print Gold `#C89B2D`**, and **never set small gold text on white** (fails contrast).
- **Balance in practice:** navy fields and white pages carry the work; gold is a single accent, never a wash. Never gold-on-gold.
- **Typography.** Editorial pairing: **Newsreader** (contemporary high-contrast serif) for display, headings, numerals and pull quotes; **Archivo** (clean neutral grotesque) for body, UI, labels, tables. Both open-licensed (SIL OFL). Measure 60–75 chars; leading 1.5–1.7× body, 1.0–1.15× display; tight tracking on display, +0.2em on uppercase overlines.
- **Grid & spacing.** 12-column grid (→6 tablet, →4 mobile), generous outer margins, **8px baseline rhythm**. Spacing scale: 8 · 16 · 24 · 32 · 48 · 64 · 96.
- **Motifs (drawn from the mark):**
  - **The gold rule** — a fine gold line (≤2px at doc scale) that separates and dignifies.
  - **The dot** — the i's dot recurs as bullets, step markers, accents.
  - **Corner keylines** — fine gold L-brackets frame covers, certificates and hero panels.
  - **Navy panels** — deep-navy fields, optionally lit by a faint gold glow, anchor the premium tone.
- **Backgrounds.** Predominantly clean white / ivory with generous whitespace, or full deep-navy panels. No busy patterns, no bright gradients. A very faint gold radial glow is permitted on navy hero panels only.
- **Corner radii.** Restrained: 2–6px on controls, up to 10px on large cards. Nothing playful or pill-shaped except tags/badges.
- **Cards.** White surface, 1px hairline border (`--iab-mist`), soft low-spread shadow (`--shadow-sm`/`--shadow-md`), 6–10px radius. Refined, never heavy.
- **Shadows.** Soft, cool-navy-tinted, low opacity. Layered (ambient + key). Reserved gold glow only for metallic/hero contexts.
- **Borders.** 1px hairlines in warm neutral; the gold rule for emphasis.
- **Motion.** Smooth, understated, purposeful. Gentle fades, soft parallax, tasteful metallic light sweeps, premium easing (`--ease-entrance`). **No** bounce, no exaggeration, no infinite decorative loops. Respect `prefers-reduced-motion`.
- **Interaction states.** Hover: subtle darken / gold-tint underline / faint lift. Press: slight shrink or deeper tone. Focus: visible 3:1 info-blue ring. All meet WCAG 2.1 AA.
- **Imagery.** Editorial, natural-light photography of real Botswana insurance & financial-services professionals — confident, authentic, aspirational. Optional navy duotone for cohesion. Avoid clichéd handshakes, thumbs-up, heavy filters, isolated white-bg stock. (No commissioned photography was supplied — UI kits use tasteful placeholders; see Caveats.)

---

## 4 · Iconography

- **Style:** a precise **linear** set on a **24px grid**, **1.5px stroke**, **round caps & joins**, **2px corner radius**. **Navy by default; gold reserved for a single point of emphasis.**
- **Implementation:** the guidelines describe the style but ship no icon binaries. This system uses **[Lucide](https://lucide.dev)** (CDN) as the closest match — outline, 24px, ~1.5–2px stroke, rounded — set to `stroke-width: 1.5` and navy. **This is a documented substitution; flag to the brand team and replace with the commissioned iAB icon set when available.**
- **The dot** motif (`.iab-dot`) doubles as a bespoke bullet/step marker — prefer it over generic list bullets.
- **No emoji anywhere** — prohibited by the brand voice. No unicode dingbats as icons.
- **Logo, not icon.** The `iAB` mark is a brand asset, never an icon. Use `assets/logos/` files; never redraw or reconstruct the mark.

---

## 5 · Index / manifest

**Root**
- `styles.css` — entry point (import list only).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`.
- `assets/logos/` — metallic + flat logo lockups (stacked, horizontal, icon, mono, favicon).
- `assets/media/` — logo-reveal posters, loop & sting video.
- `readme.md` (this file) · `SKILL.md`.

**Foundation cards** (`guidelines/`) — Colors, Type, Spacing, Brand groups in the Design System tab.

**Components** (`components/`) — reusable React primitives. Namespace: `window.IABDesignSystem_8045d9`.
- `actions/` — Button, IconButton
- `forms/` — Input, Textarea, Select, Checkbox, Radio, Switch, Field
- `data-display/` — Card, Badge, Tag, StatBlock, Table, Avatar
- `feedback/` — Alert, ProgressBar
- `navigation/` — Tabs, Breadcrumb, Accordion
- `brand/` — Logo, GoldRule

**UI kits** (`ui_kits/`)
- `website/` — iAB marketing site (hero, programmes, employers, apply).
- `portal/` — iAB student learning portal / dashboard (Moodle-style LMS).

**Slides** (`slides/`) — 16:9 presentation templates (title, section divider, content, stat, quote, closing).

### Intentional additions
- **Logo / GoldRule** brand components — thin wrappers so consumers place the real mark and the gold-rule motif without re-implementing them.
- **Lucide icon set** via CDN — substitute for the unshipped iAB icon library (see §4).

---

## 6 · Caveats
- **Icon font not supplied** — Lucide substituted. Replace when the commissioned set ships.
- **No photography supplied** — placeholders used in UI kits/slides. Provide the commissioned Botswana professional library.
- **`iAB_SVG_Logo_Assets.zip` did not reach the filesystem** — only the raster (PNG) renders were available, so logos are used as PNG. Please re-supply the vector SVG/EPS/AI pack for print & scalable use.
- Logo renders are AI-generated brand mockups; treat the vector masters as authoritative once supplied.
