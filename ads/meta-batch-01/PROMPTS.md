# OOShare — Meta batch 01: image-generation prompt pack

Ten visuals to generate **without any text or logo**. The headline, subline, CTA pill
and shield watermark ship as separate transparent PNG overlays in this folder —
composite the overlay on top of the generated visual in Figma / Canva / Meta's ad builder.

## How to use

1. Generate the visual at the stated aspect ratio, at least 1080px on the short edge.
2. Keep the stated area (top ~40% for feed sizes, top ~45% for Stories) visually calm —
   the overlay's headline lands there. Every prompt below already asks for it.
3. Drop `NN_slug_WxH_overlay.png` on top at 100% scale, no resizing, no repositioning.
   Use `_textonly.png` instead when the visual is already low-contrast enough in the
   headline zone that you don't want the baked-in scrim.
4. Export JPG q85–92 or PNG. Do not add any other logo, URL or badge.

## Global rules to append to every prompt

```
no text, no words, no letters, no logos, no watermarks, no captions, no UI text,
no readable screen content, no readable passwords or card numbers, PG, fully clothed,
photographic realism where specified, no extra limbs, no distorted hands
```

Midjourney: add `--ar 9:16` / `--ar 1:1` / `--ar 4:5`, plus `--style raw` on the
photoreal ones (#2, #3, #5, #6, #8, #10). Firefly / Meta AI: pick the matching aspect
ratio in the UI and paste the prompt body as-is.

---

## 1 — "One view. Then it's gone." · 9:16 (1080×1920) · surreal 3D render

**Lever:** curiosity gap + peak-end. Overlay text is centred; keep the centre-top calm.

```
Surreal 3D render, a single modern smartphone floating upright at the centre of the frame,
its screen showing a simple abstract link glyph dissolving into a cloud of drifting
particles that scatter upward and fade to nothing. Behind it, a heavily blurred dusk city
street with bokeh streetlights in deep indigo and violet. Dramatic rim light on the phone
edges, high contrast, clean matte surfaces, cinematic depth of field. Composition: phone
occupies the lower-middle third, the upper 45% of the frame is empty dark sky and bokeh
with nothing to read. Colour palette indigo #6366F1, deep navy, warm street amber accents.
Vertical 9:16.
```

## 2 — "What you send stays forever. Until now." · 1:1 (1080×1080) · cinematic moody photoreal

**Lever:** loss aversion. Overlay text is left-aligned; keep the top-left quiet.

```
Cinematic photoreal interior, a dim home office at night lit only by the cool glow of a
laptop screen. An open email compose window is visible but completely illegible and out of
focus. A person's hand rests hesitantly on the mouse, their face turned away from camera,
out of frame from the nose up. Desaturated blue-grey grade, soft film grain, shallow depth
of field, 35mm look, natural window darkness behind. Composition: the laptop and hand sit
in the lower-right two thirds; the upper 40% is dark empty wall with nothing to read.
Square 1:1.
```

## 3 — "That sinking feeling. Gone." · 4:5 (1080×1350) · candid UGC, shot on iPhone

**Lever:** regret aversion. Left-aligned overlay; keep the top quiet.

```
Candid smartphone snapshot, unposed and slightly imperfect, shot on iPhone at a busy cafe.
Close-up over-the-shoulder view of two hands holding a phone; the screen shows a generic
messaging thread with a message just sent to a large group, all text illegible and blurred.
At the left edge of frame, the person's face is partly visible, eyes wide, caught
mid-realisation. Warm tungsten cafe light, mild motion blur, visible sensor grain, no
professional lighting, authentic amateur feel. Composition: hands and phone in the lower
two thirds; the top 40% is a softly blurred cafe interior with nothing to read.
Vertical 4:5.
```

## 4 — "Your password doesn't belong in email." · 4:5 (1080×1350) · flat vector illustration

**Lever:** loss aversion, plain-spoken. Dark overlay text on a bright illustration.

```
Flat vector illustration, friendly modern tech style, thick rounded shapes, no gradients
beyond subtle flat shading. On the left, a large envelope with a key sticking out of it,
struck through with a bold diagonal cross. On the right, a clean simple chain-link icon
inside a soft rounded square, glowing gently as the approved alternative. Bright airy
background in pale indigo, palette indigo #6366F1, white, soft lilac, one warm coral
accent. Generous flat empty background across the top 40% of the frame. Centred lower
composition, crisp edges, no outlines on the background. Vertical 4:5.
```

## 5 — "Help family without leaving your card in their chat." · 9:16 (1080×1920) · warm documentary

**Lever:** reciprocity + safety. Long left-aligned headline — keep the top 45% very calm.

```
Warm documentary photojournalism, an older woman's hands holding a smartphone at a lived-in
kitchen counter, golden hour light raking in from a window on the right. Her brow is
furrowed in concentration, face visible only from the cheekbones down, mid-message. At the
lower edge of frame a bank card lies face down and heavily blurred, no readable detail. Warm
amber and honey tones, organic film grain, natural imperfect surfaces, mugs and a fruit bowl
softly out of focus. Composition: hands and counter fill the bottom half; the upper 45% is
softly lit empty wall and window glare with nothing to read. Vertical 9:16.
```

## 6 — "Some photos are just for two." · 4:5 (1080×1350) · soft editorial photography

**Lever:** intimacy, strictly PG.

```
Soft editorial photograph, a couple sitting close together on a couch in warm lamp light,
seen from the shoulders down and from behind at a three-quarter angle, fully clothed in
cosy knitwear, entirely PG. One of them holds a phone whose screen shows only a simple
abstract padlock glyph on a plain background — no photo, no text visible. Warm amber
practical lighting, soft falloff into shadow, gentle film grain, muted rose and plum
shadows. Composition: subjects in the lower two thirds; the upper 40% is dark quiet wall
with nothing to read. Vertical 4:5.
```

## 7 — "Contracts, IDs, tax forms." · 1:1 (1080×1080) · isometric 3D illustration

**Lever:** professional loss aversion. Dark overlay text on a light scene.

```
Isometric 3D illustration, clean and professional, a tidy desk viewed from a 45-degree
isometric angle. On the desk a tablet displays a document whose body text is rendered as
abstract blurred grey bars — completely unreadable — with a small red CONFIDENTIAL stamp
across it. Beside it a coffee cup, a neat stack of folders and a pen. Soft natural daylight,
long soft shadows, matte pastel materials, palette off-white, pale grey-blue, indigo
#6366F1 accents. Bright empty background across the top 40% of the frame. Square 1:1.
```

## 8 — "Just sent it. It already deleted itself." · 1:1 (1080×1080) · bright lifestyle photoreal

**Lever:** normalcy + social proof. Dark overlay text on a bright photo.

```
Bright everyday lifestyle photograph, natural daylight, a person's hand holding a phone at
chest height outdoors on a sunny street. The screen shows a plain messaging thread with a
single generic web link bubble and a small checkmark beside it; all other text is
illegible. The sender is relaxed, visible only as a shoulder and forearm in a plain
t-shirt. Airy high-key exposure, soft natural shadows, candid unposed framing, mild grain,
no studio lighting. Composition: hand and phone in the lower two thirds; the top 40% is
bright softly blurred sky and pale building wall with nothing to read. Square 1:1.
```

## 9 — "Free. No account. Nothing to install." · 4:5 (1080×1350) · minimalist premium product shot

**Lever:** zero-price + low activation energy. Centred overlay text.

```
Minimalist premium product shot, a single modern smartphone centred and floating upright on
a soft pale gradient background. On screen: one large empty rounded input box and one solid
indigo pill button below it, no readable labels, no other UI. A fingertip approaches the
button mid-tap, sharply lit. Studio softbox lighting, subtle contact shadow, immaculate
clean surfaces, palette white, pale grey-lilac, indigo #6366F1. Composition: phone centred
in the lower two thirds; the top 40% is clean empty gradient with nothing to read.
Vertical 4:5.
```

## 10 — "The link couples, families, and teams use." · 9:16 (1080×1920) · warm lifestyle photography

**Lever:** social proof, mimetic desire. Left-aligned overlay; keep the top 45% calm.

```
Warm lifestyle photograph, two people at a wooden table in soft morning light, one passing
a phone across to the other with a reassuring genuine smile. Both seen from the shoulders
down and in three-quarter profile, faces partly cropped by the frame edge. The phone screen
shows a plain messaging thread with one generic link bubble and a small checkmark,
everything else illegible. Honey-toned daylight from a window behind them, gentle lens
flare, natural grain, relaxed unposed body language, coffee cups on the table. Composition:
subjects and table fill the bottom half; the upper 45% is bright hazy window light and
empty wall with nothing to read. Vertical 9:16.
```

---

## Claims discipline

Do not add any volume or user-count proof to these visuals or to the ad copy — the real
figure is roughly 180 users/month, and inflated proof ("millions of secrets deleted")
falls under Meta's misrepresentation policy. #8 and #10 carry social proof by *depicting
ordinary use*, not by asserting numbers.
