# 010 — FileDropzone attached-preview entrance

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: LOW
- **Category**: Preventing a jarring change
- **Estimated scope**: 1 file (`ui/src/styles/ui.css`)
- **Depends on**: 002 (tokens)

## Problem

When a file is attached, `FileDropzone.tsx:190` swaps the empty state for the preview block instantly (`file-preview-thumb` / `file-preview-pdf` / `file-preview-info`). The state change should rise in rather than teleport (AUDIT §8).

Current (verbatim, `ui.css:294-298`):

```css
.dropzone--has-file {
  border-style: solid;
  border-color: var(--border);
  cursor: default;
}
```

## Target

`ui.css` — animate the preview elements when the `--has-file` state is present (they are direct children of `.dropzone`):

```css
.dropzone--has-file > .file-preview-thumb,
.dropzone--has-file > .file-preview-pdf,
.dropzone--has-file > .file-preview-info {
  animation: ui-dropzone-in var(--dur-popover) var(--ease-out);
}
@keyframes ui-dropzone-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .dropzone--has-file > .file-preview-thumb,
  .dropzone--has-file > .file-preview-pdf,
  .dropzone--has-file > .file-preview-info {
    animation: none;
  }
}
```

(Keyframe name `ui-dropzone-in` is unique to avoid clashing with `ui-rise-in` from plan 002.)

## Repo conventions to follow

- Small state swaps use a short ease-out (~180ms). `translateY(-4px)` matches the block settling into place.

## Steps

1. Add the three rules above to `ui.css` near the `.file-preview-*` rules.

## Boundaries

- Do NOT change `FileDropzone.tsx` markup.
- The keyframe must be uniquely named.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (FileDropzone tests green).
- **Feel check**: on `/components` drop or choose an image — the preview row rises in; remove and re-add — it animates again. Toggle `prefers-reduced-motion`: instant swap.
- **Done when**: the attached preview animates in without shifting the layout.
