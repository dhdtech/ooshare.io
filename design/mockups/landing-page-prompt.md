# Prompt — ooshare landing page (dark + light), security-first, mobile-first

Paste the block below into your mockup generator. It is self-contained.

---

You are a senior product designer with deep expertise in building **trust** into security software. You are designing the landing page for **ooshare** (ooshare.io) — a zero-knowledge, one-time secret sharing tool. Your job is to make a visitor, in the first few seconds, feel this is a **safe, professional place to put a secret** — calm, precise, credible, never gimmicky or threatening.

## The product (state only these facts — do not invent claims)
- A visitor types a **password, API key, private message, image, PDF, or archive** (ZIP/RAR/7Z), up to 50,000 characters of text or a 10 MB file.
- The secret is **encrypted in the visitor's browser** with **AES-256-GCM** before anything leaves their device.
- The server **never sees the plaintext and never sees the key**. The decryption key travels only in the URL fragment (`#...`), which browsers never send to servers. This is the product's core promise: **"Your data never reaches our servers."**
- The link **opens exactly once, then self-destructs** (atomic delete on first view). Secrets can also auto-expire in 1–72 hours.
- **Free, no account, open source (MIT).** Every line is publicly auditable and self-hostable.

## The psychology brief — WHY the design must feel secure
Apply these trust mechanics deliberately. The feeling of safety is engineered, not decorative:
1. **Evidence over claims.** Skeptical visitors disbelieve superlatives ("military-grade!", "unbreakable!"). Trust comes from *verifiable specifics*: "AES-256-GCM," "encrypted in your browser," "open source, auditable," "the key never leaves the URL fragment." Use specific, plain-language proof points.
2. **Plain language reassurance.** The visitor does not understand cryptography. Every security claim must be understandable in one breath: *"Your secret is encrypted in your browser. Even we can't read it."* No jargon walls.
3. **Authority badges, used sparingly.** Small, quiet badges — `AES-256-GCM` · `Zero-knowledge` · `One-time self-destruct` · `Open source` — act as credibility anchors. Keep them subtle, not shouty.
4. **One job, one action.** Reduce decision load (Hick's Law): exactly ONE primary call-to-action ("Create a secret link"). Minimal navigation. Generous whitespace. A cluttered page reads as untrustworthy; a calm, precise one reads as safe.
5. **The right kind of calm.** Professional, fintech-grade calm (think Stripe or 1Password's composure): refined neutrals, restrained palette, hairline rules, consistent spacing, no loud gradients, no "hacker neon," no red alerts, no threat imagery. A **shield** should be the visual anchor — protection, not alarm.
6. **Loss-aversion context (one line, not a lecture).** Briefly remind the visitor of the problem they're avoiding — *"Passwords sent by email or SMS are stored forever. Send them once instead."* — then immediately show the safe answer.
7. **Specificity = credibility.** Concrete numbers feel real: "50,000 characters · 10 MB files · expires in 1–72h · 6 languages." Vague superlatives feel fake.

## Non-negotiable constraints
1. **Logo:** use the existing ooshare logo mark — the **shield** icon — exactly as provided below. **Its color `#6366f1` (indigo) MUST NOT change** in either theme. Reuse the exact SVG:
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
   ```
   Place the shield beside the wordmark **"ooshare"**. The shield stays `#6366f1` on both dark and light backgrounds (it is the single fixed brand color; everything else adapts to the theme).
2. **EXTREMELY mobile-first.** Design for a phone first: thumb-reachable primary action, no horizontal scroll at 390px, the hero and CTA visible above the fold. The layout must also adapt cleanly to desktop (a centered column that breathes — do not build a desktop-first layout).
3. **Deliverable — dark + light side by side.** Produce the **landing page twice: dark mode on the left, light mode on the right**, as a side-by-side comparison of the identical page. Both themes must be fully designed (background, surfaces, text tiers, accents — not just an inverted background). If you render phones, show them at mobile width.
4. **Feel: professional, safe, trustworthy.** Calm and precise. If the design would make a nervous first-time user feel unsure where to click or what happens to their data, it is wrong.

## Landing page structure (mobile-first, in order)
1. **Header** — shield + "ooshare" wordmark (left); minimal, quiet: "How it works · Security · FAQ" + a language indicator (right). Slim, hairline divider.
2. **Hero** — the thesis, in the interface's calm voice:
   - Headline (short, confident): *"Send secrets. They're gone after one read."*
   - Subhead (plain-language reassurance, one or two lines): *"Your secret is encrypted in your browser before it ever leaves your device. Our servers never see your data — and the link destroys itself after one view."*
   - One primary CTA: **"Create a secret link"** (the single visual action on the page, in the indigo/theme accent).
   - A quiet line under it: *"Free · No account · Open source"*.
   - Below the CTA, the three quiet authority badges.
3. **"What you can share"** — a compact, icon row: password, API key, private message, image, PDF, archive. One glance, no paragraphs.
4. **How it works** — 3 steps, each with a micro reassurance: **Write** (encrypted in your browser) → **Share** (send the one-time link) → **Gone** (opens once, then destroyed).
5. **Security section** — the trust deep-dive, 4 short cards in plain language:
   - *Encrypted in your browser* — AES-256-GCM before it leaves your device.
   - *The server never sees your data* — only encrypted bytes; even we can't read it.
   - *Opens once, then self-destructs* — one view, then it's permanently gone.
   - *Open source, auditable* — read every line on GitHub; self-host it if you like.
6. **Final reassurance + CTA** — one line (*"Don't send passwords through email or SMS — they're stored forever."*), then the same single CTA, then the badges again.
7. **Footer** — slim: shield + wordmark, the four authority badges, minimal links (Security · FAQ · Blog · About · GitHub).

## Design language
- **Dark theme:** deep, calm slate/ink (near-black with a cool cast — consistent with a `#6366f1` indigo accent). Surfaces, hairline borders, three text tiers.
- **Light theme:** clean off-white/paper, crisp surfaces, same hairline discipline. **Same exact layout and spacing as dark** — the two themes are twin renders.
- **Type:** one confident professional sans for UI + headings, one mono for data/technical labels (AES-256-GCM, the link, counts). No display-serif marketing font; this is a tool, not a poster.
- **Accent:** the indigo `#6366f1` family as the single brand accent (CTAs, key labels, links) in both themes — derive darker/lighter variants for hover/contrast from it, but the logo itself never changes color.
- **Quality bar:** visible focus states, `prefers-reduced-motion` respected, 390px no-overflow, consistent 4/8px spacing rhythm, semantic structure, `aria-label` on icon-only controls.

## Output
Deliver the landing page rendered twice — **dark (left) and light (right), side by side**, mobile-first. Add one short note (3–4 lines) explaining the trust choices you made and why.
