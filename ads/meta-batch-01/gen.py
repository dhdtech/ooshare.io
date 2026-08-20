#!/usr/bin/env python3
"""OOShare Meta ad batch — text+logo overlay generator.

Renders, for each of the 10 creatives in the brief:
  *_overlay.png   transparent PNG: scrim + headline + subline + CTA pill + shield watermark
  *_textonly.png  transparent PNG: same, no scrim (for visuals that already have contrast)
  *_preview.jpg   overlay composited on a neutral placeholder backdrop, to judge legibility

Text area is auto-fitted to stay <= TEXT_AREA_MAX of the canvas (Meta 20% rule).
"""
import json, math, pathlib, random
from PIL import Image, ImageDraw, ImageFilter
from playwright.sync_api import sync_playwright

OUT = pathlib.Path("/tmp/ads/out"); OUT.mkdir(parents=True, exist_ok=True)
WORK = pathlib.Path("/tmp/ads/work"); WORK.mkdir(parents=True, exist_ok=True)
FONTS = pathlib.Path("/tmp/f/node_modules/@fontsource/inter/files")
INDIGO = "#6366F1"
TEXT_AREA_MAX = 0.18          # headroom under Meta's 20%
SHIELD = ('<svg viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="2" '
          'stroke-linecap="round" stroke-linejoin="round">'
          '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1'
          'c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>')

C = [
 dict(n=1,  slug="one-view-then-gone",        size=(1080,1920), theme="dark",  align="center",
      hl="One view.<br><span class='acc'>Then it's gone.</span>", sub="The private link that deletes itself.",
      cta="Try it free", bg=("#0d1220","#2a3550","#5b4a6e"), style="surreal 3D render, dusk city"),
 dict(n=2,  slug="stays-forever-until-now",   size=(1080,1080), theme="dark",  align="left",
      hl="What you send<br>stays forever.<br><span class='acc'>Until now.</span>",
      sub="Your password, card, photo — deleted the moment it's read.",
      cta="Make it disappear", bg=("#0b1018","#1d2734","#39485a"), style="cinematic moody photoreal"),
 dict(n=3,  slug="that-sinking-feeling",      size=(1080,1350), theme="dark",  align="left",
      hl="That sinking feeling.<br><span class='acc'>Gone.</span>", sub="Send it with a link that can't stay. Ever.",
      cta="Send safely", bg=("#181410","#3a2f26","#6b5647"), style="candid UGC, shot on iPhone"),
 dict(n=4,  slug="not-in-email",              size=(1080,1350), theme="light", align="left",
      hl="Your password<br>doesn't belong<br>in email.", sub="One link. One read. Then nothing to find.",
      cta="Share securely", bg=("#eef1ff","#e2e8ff","#dfe6fb"), style="flat vector illustration"),
 dict(n=5,  slug="help-family",               size=(1080,1920), theme="dark",  align="left",
      hl="Help family<br>without leaving<br>your card<br>in their chat.",
      sub="It deletes itself after one read.",
      cta="Try it free", bg=("#1a1207","#4a3418","#8a6534"), style="warm documentary"),
 dict(n=6,  slug="just-for-two",              size=(1080,1350), theme="dark",  align="left",
      hl="Some photos<br>are just for two.", sub="A private link that vanishes after one view.",
      cta="Share privately", bg=("#150f14","#3a2630","#66444f"), style="soft editorial photography"),
 dict(n=7,  slug="contracts-ids-tax-forms",   size=(1080,1080), theme="light", align="left",
      hl="Contracts, IDs,<br>tax forms.", sub="Read once, then gone.",
      cta="Send securely", bg=("#f4f6fb","#e8ecf6","#dee5f2"), style="isometric 3D illustration"),
 dict(n=8,  slug="already-deleted-itself",    size=(1080,1080), theme="light", align="left",
      hl="Just sent it.<br>It already<br>deleted itself.", sub="Free one-time secret links for real life.",
      cta="Try it free", bg=("#fbf9f5","#f0eee8","#e3e2dc"), style="bright lifestyle photoreal"),
 dict(n=9,  slug="free-no-account",           size=(1080,1350), theme="light", align="center",
      hl="Free. No account.<br>Nothing to install.", sub="Type it. Get a link. Done.",
      cta="Get your link", bg=("#ffffff","#f2f4ff","#e6eaff"), style="minimalist premium product shot"),
 dict(n=10, slug="couples-families-teams",    size=(1080,1920), theme="dark",  align="left",
      hl="The link couples,<br>families, and<br>teams use.",
      sub="What you share disappears after one read.",
      cta="Try it free", bg=("#141009","#40331f","#7d6844"), style="warm lifestyle photography"),
]


def font_face(weight):
    return (f"@font-face{{font-family:Inter;font-style:normal;font-weight:{weight};"
            f"src:url('file://{FONTS}/inter-latin-{weight}-normal.woff2') format('woff2');}}")


def geometry(w, h, ratio):
    """Padding, headline top, CTA bottom offset, base sizes — tuned per placement."""
    pad = round(w * 0.085)
    if ratio == "9:16":                       # keep clear of Stories UI (top/bottom ~250px)
        return dict(pad=pad, top=round(h*0.155), cta_bottom=round(h*0.175),
                    wm_bottom=round(h*0.075), hl=110, sub=46, ctaf=44)
    if ratio == "4:5":
        return dict(pad=pad, top=round(h*0.085), cta_bottom=round(h*0.105),
                    wm_bottom=round(h*0.045), hl=90, sub=40, ctaf=40)
    return dict(pad=pad, top=round(h*0.085), cta_bottom=round(h*0.105),
                wm_bottom=round(h*0.055), hl=82, sub=38, ctaf=38)


def html(c, scrim=True):
    w, h = c["size"]
    ratio = {(1080,1920):"9:16", (1080,1350):"4:5", (1080,1080):"1:1"}[(w,h)]
    g = geometry(w, h, ratio)
    dark = c["theme"] == "dark"
    ink        = "#FFFFFF" if dark else "#0B1020"
    sub_ink    = "rgba(255,255,255,.88)" if dark else "rgba(11,16,32,.72)"
    shield_col = "#A5B4FC" if dark else INDIGO
    accent     = "#C7D2FE" if dark else INDIGO
    shadow     = ("0 2px 28px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.45)" if dark
                  else "0 2px 22px rgba(255,255,255,.75)")
    if scrim:
        top_scrim = ("linear-gradient(180deg, rgba(6,8,20,.80) 0%, rgba(6,8,20,.62) 38%, rgba(6,8,20,0) 100%)"
                     if dark else
                     "linear-gradient(180deg, rgba(255,255,255,.90) 0%, rgba(255,255,255,.74) 38%, rgba(255,255,255,0) 100%)")
        bot_scrim = ("linear-gradient(0deg, rgba(6,8,20,.66) 0%, rgba(6,8,20,0) 100%)" if dark else
                     "linear-gradient(0deg, rgba(255,255,255,.78) 0%, rgba(255,255,255,0) 100%)")
    else:
        top_scrim = bot_scrim = "none"
    just = "center" if c["align"] == "center" else "flex-start"
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
{font_face(400)}{font_face(500)}{font_face(600)}{font_face(800)}
*{{box-sizing:border-box;margin:0}}
html,body{{width:{w}px;height:{h}px;background:transparent;overflow:hidden}}
body{{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}}
.frame{{position:relative;width:{w}px;height:{h}px}}
.s-top{{position:absolute;inset:0 0 auto 0;height:{round(h*0.54)}px;background:{top_scrim}}}
.s-bot{{position:absolute;inset:auto 0 0 0;height:{round(h*0.32)}px;background:{bot_scrim}}}
.top{{position:absolute;left:{g['pad']}px;right:{g['pad']}px;top:{g['top']}px;
  text-align:{c['align']};color:{ink};text-shadow:{shadow}}}
h1{{font-weight:800;font-size:var(--hl);line-height:1.02;letter-spacing:-.028em}}
.acc{{color:{accent}}}
.sub{{margin-top:{round(g['sub']*0.72)}px;font-weight:500;font-size:var(--sub);
  line-height:1.28;color:{sub_ink};letter-spacing:-.008em;max-width:{round(w*0.80)}px;
  {'margin-left:auto;margin-right:auto;' if c['align']=='center' else ''}}}
.cta{{position:absolute;left:{g['pad']}px;right:{g['pad']}px;bottom:{g['cta_bottom']}px;
  display:flex;justify-content:{just}}}
.pill{{background:{INDIGO};color:#fff;font-weight:700;font-size:{g['ctaf']}px;letter-spacing:-.005em;
  padding:{round(g['ctaf']*0.68)}px {round(g['ctaf']*1.5)}px;border-radius:999px;
  box-shadow:0 10px 30px rgba(99,102,241,.38)}}
.wm{{position:absolute;right:{g['pad']}px;bottom:{g['wm_bottom']}px;width:{round(w*0.09)}px;
  opacity:.66;filter:drop-shadow(0 2px 10px rgba(0,0,0,.35))}}
.wm svg{{display:block;width:100%;height:auto}}
</style></head><body><div class="frame">
<div class="s-top"></div><div class="s-bot"></div>
<div class="top" id="top"><h1 id="hl" style="--hl:{g['hl']}px;--sub:{g['sub']}px">{c['hl']}</h1>
<div class="sub" id="sub" style="--sub:{g['sub']}px">{c['sub']}</div></div>
<div class="cta"><div class="pill" id="pill">{c['cta']}</div></div>
<div class="wm">{SHIELD.format(c=shield_col)}</div>
</div></body></html>"""


MEASURE = """() => {
  const rects = [];
  for (const id of ['hl','sub']) {
    const el = document.getElementById(id);
    for (const node of el.childNodes) {
      if (node.nodeType !== 3) continue;
      const r = document.createRange(); r.selectNodeContents(node);
      for (const b of r.getClientRects()) if (b.width > 1 && b.height > 1) rects.push(b);
    }
  }
  rects.push(document.getElementById('pill').getBoundingClientRect());
  const area = rects.reduce((a,b) => a + b.width*b.height, 0);
  const hlEl = document.getElementById('hl');
  const hr = document.createRange(); hr.selectNodeContents(hlEl);
  const tops = new Set();
  for (const b of hr.getClientRects()) if (b.width>1 && b.height>1) tops.add(Math.round(b.top));
  const lines = tops.size;
  const hl = hlEl.getBoundingClientRect();
  const sub = document.getElementById('sub').getBoundingClientRect();
  return {area, lines, coverage: area/(innerWidth*innerHeight), blockBottom: sub.bottom, hlTop: hl.top};
}"""


def render(page, c, scrim, path):
    w, h = c["size"]
    page.set_viewport_size({"width": w, "height": h})
    page.set_content(html(c, scrim), wait_until="load")
    page.wait_for_timeout(120)
    g = geometry(w, h, {(1080,1920):"9:16",(1080,1350):"4:5",(1080,1080):"1:1"}[(w,h)])
    want = c["hl"].count("<br>") + 1
    size, m = g["hl"], page.evaluate(MEASURE)
    while (m["coverage"] > TEXT_AREA_MAX or m["lines"] > want) and size > 46:
        size -= 2
        page.evaluate("s => document.getElementById('hl').style.setProperty('--hl', s+'px')", size)
        m = page.evaluate(MEASURE)
    page.screenshot(path=str(path), omit_background=True)
    return dict(hl_px=size, coverage=round(m["coverage"], 4),
                lines=m["lines"], lines_intended=want)


def backdrop(c):
    """Neutral placeholder backdrop so previews show real-world legibility."""
    w, h = c["size"]
    a, b, d = [tuple(int(x[i:i+2], 16) for i in (1, 3, 5)) for x in c["bg"]]
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        t = y / (h - 1)
        c1, c2, f = (a, b, t / 0.55) if t < 0.55 else (b, d, (t - 0.55) / 0.45)
        row = tuple(round(c1[i] + (c2[i] - c1[i]) * f) for i in range(3))
        for x in range(w):
            px[x, y] = row
    # soft off-centre light blob + grain, to mimic a photographic subject
    blob = Image.new("L", (w, h), 0)
    dr = ImageDraw.Draw(blob)
    cx, cy, r = int(w * 0.62), int(h * 0.62), int(w * 0.42)
    dr.ellipse([cx - r, cy - r, cx + r, cy + r], fill=110)
    blob = blob.filter(ImageFilter.GaussianBlur(w * 0.12))
    img = Image.composite(Image.new("RGB", (w, h), (255, 255, 255)), img, blob.point(lambda v: v // 3))
    rnd = random.Random(c["n"])
    noise = Image.effect_noise((w, h), 14).point(lambda v: 128 + (v - 128) // 3)
    return Image.blend(img, Image.merge("RGB", (noise, noise, noise)), 0.06)


def main():
    report = []
    with sync_playwright() as p:
        br = p.chromium.launch()
        page = br.new_page()
        for c in C:
            w, h = c["size"]
            base = f"{c['n']:02d}_{c['slug']}_{w}x{h}"
            ov = OUT / f"{base}_overlay.png"
            tx = OUT / f"{base}_textonly.png"
            r = render(page, c, True, ov)
            render(page, c, False, tx)
            pv = OUT / f"{base}_preview.jpg"
            bg = backdrop(c).convert("RGBA")
            bg.alpha_composite(Image.open(ov).convert("RGBA"))
            bg.convert("RGB").save(pv, quality=88, optimize=True)
            report.append(dict(n=c["n"], slug=c["slug"], size=f"{w}x{h}",
                               theme=c["theme"], style=c["style"], **r))
            print(f"[{c['n']:02d}] {base}  hl={r['hl_px']}px  text={r['coverage']*100:.1f}%")
        br.close()
    (OUT / "_report.json").write_text(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
