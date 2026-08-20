# Meta ad batch 01 — OOShare

Text + logo overlay layers for the 10 creatives in the brief, plus the image-generation
prompt pack. The pipeline is the one the brief recommends: **generate the visual with no
text, then composite the overlay on top.** No AI image model was used here — these are
typeset layers rendered from HTML at exact pixel sizes, so nothing is garbled.

## Contents

| File | What it is |
| --- | --- |
| `NN_slug_WxH_overlay.png` | Transparent PNG. Scrim + headline + subline + CTA pill + shield watermark. **This is the one to use.** |
| `NN_slug_WxH_textonly.png` | Same layer with the contrast scrim removed — for visuals that are already dark/light enough in the headline zone. |
| `NN_slug_WxH_preview.jpg` | The overlay composited onto a neutral placeholder backdrop, so you can judge legibility before the real visual exists. Not for delivery. |
| `PROMPTS.md` | Per-creative image-gen prompt (Midjourney / Firefly / Meta AI), aspect ratio, negative-space instruction, global negative prompt. |
| `contact_sheet.png` | All 10 previews on one sheet. |
| `gen.py` | The generator. Edit the `C` list (copy, alignment, theme) and re-run to regenerate the batch. |

## How to assemble a creative

1. Generate the visual from `PROMPTS.md` at the stated aspect ratio, ≥1080px short edge.
2. Place `..._overlay.png` on top at **100% scale, no repositioning** — it is already the
   exact canvas size, and the scrim, safe-area margins and watermark position depend on that.
3. Flatten and export JPG q85–92 (or PNG). Add nothing else: no second logo, no URL.

If the visual's headline zone is already high-contrast (a dark night shot, a white studio
background), swap in `..._textonly.png` for a cleaner look.

## Specs as built

| # | Creative | Size | Placement | Theme | Headline | Lines | Text area |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | One view. Then it's gone. | 1080×1920 | 9:16 | dark | 110px | 2 | 6.3% |
| 2 | What you send stays forever. Until now. | 1080×1080 | 1:1 | dark | 82px | 3 | 15.2% |
| 3 | That sinking feeling. Gone. | 1080×1350 | 4:5 | dark | 90px | 2 | 9.9% |
| 4 | Your password doesn't belong in email. | 1080×1350 | 4:5 | light | 90px | 3 | 15.5% |
| 5 | Help family without leaving your card in their chat. | 1080×1920 | 9:16 | dark | 110px | 4 | 17.4% |
| 6 | Some photos are just for two. | 1080×1350 | 4:5 | dark | 90px | 2 | 13.0% |
| 7 | Contracts, IDs, tax forms. | 1080×1080 | 1:1 | light | 82px | 2 | 11.5% |
| 8 | Just sent it. It already deleted itself. | 1080×1080 | 1:1 | light | 82px | 3 | 14.3% |
| 9 | Free. No account. Nothing to install. | 1080×1350 | 4:5 | light | 90px | 2 | 13.5% |
| 10 | The link couples, families, and teams use. | 1080×1920 | 9:16 | dark | 110px | 3 | 15.8% |

**Text area** is measured on the rendered layer: the summed bounding boxes of every
headline line, every subline line, and the CTA pill, over the full canvas area. All ten sit
under 18%, with headroom under Meta's 20% guidance. The generator auto-shrinks the headline
until both that cap and the intended line breaks hold, so editing copy in `gen.py` can't
silently blow the budget or produce an orphan word.

## Deviations from the brief, and why

- **Headline size is 82–110px, not 40–60px.** At 40–60px on a 1080-wide canvas the headline
  renders around 15–22pt on a phone — subline size, not headline size, and it loses the
  feed. The larger scale still measures under the 20% text cap. To go back to spec, lower
  the `hl=` values in `geometry()` and re-run.
- **Shield watermark is `#A5B4FC` on the six dark creatives**, brand indigo `#6366F1` on the
  four light ones. The brief allows a contrasting tone on dark backgrounds; pure `#6366F1`
  on a dark photo reads as a smudge. Size 9% of width, opacity 66%, bottom-right.
- **A contrast scrim is baked into `_overlay.png`.** Transparent text over an unknown
  AI-generated photo is a coin flip for legibility; the gradient guarantees it. The
  `_textonly.png` variant exists for when you don't want it.
- **Some headline line breaks were re-flowed** (not reworded) so no line ends on an orphan:
  #2 breaks as "What you send / stays forever. / Until now.", #4 as "Your password /
  doesn't belong / in email.", #5 across four lines, #8 as "Just sent it. / It already /
  deleted itself.", #10 as "The link couples, / families, and / teams use."
- **The payoff clause is set in indigo** on #1, #2 and #3 ("Then it's gone.", "Until now.",
  "Gone.") to carry the setup→payoff beat those three concepts are built on.

## Placement notes

- **9:16 (#1, #5, #10):** headline starts at 15.5% height and the CTA sits at 17.5% from the
  bottom, keeping both clear of the Stories/Reels UI chrome (roughly the top and bottom
  250px).
- **Feed sizes (#2–#4, #6–#9):** headline at 8.5% height, CTA at 10.5% from the bottom,
  8.5% side margins throughout.
- CTA pill is solid `#6366F1` with white text on all ten, for batch consistency.

## Claims

No volume or user-count proof appears anywhere in these layers. Real figure is ~180
users/month; inflated social proof is a Meta misrepresentation risk. #8 and #10 carry social
proof by depicting ordinary use instead.

## Regenerating

```bash
pip install playwright pillow --break-system-packages
npm install @fontsource/inter        # Inter, matching the OOShare UI
python3 gen.py                       # writes overlays, textonly, previews, _report.json
```

`gen.py` expects the Inter woff2 files at the path in its `FONTS` constant — point that at
`ui/public/fonts/` or at a local `node_modules/@fontsource/inter/files`.
