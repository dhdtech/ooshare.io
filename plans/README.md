# Animation plans — ooshare UI (shared design system + `/components` showcase)

Motion work for the shared component library (`ui/src/components/ui/`) and the `/components` living style guide. Produced by `/improve-animations` on commit `9bae186`. Scope: **all tiers, all-in** (user request).

## Recommended execution order

1. **002** motion tokens + shared keyframes — foundation; every other plan consumes `--ease-*`, `--dur-*`, `ui-rise-in`, `ui-pop`
2. **001** add `motion` dependency — prerequisite for 004, 005, 007
3. **003** button & icon-button press feedback (independent)
4. **004** modal exit (needs 001, 002)
5. **005** toast enter/exit (needs 001, 002)
6. **006** accordion expand/collapse (needs 002)
7. **007** segmented-control sliding thumb (needs 001, 002)
8. **008** `/components` entrance + section stagger (needs 002)
9. **009** copy-button copied-state pop (needs 002)
10. **010** file-dropzone preview entrance (needs 002)
11. **011** nav-link active indicator (needs 002)

## Dependency graph

- 004, 005, 007 ← 001 (`motion` dependency)
- 003–011 ← 002 (motion tokens / keyframes)

## Status

| # | Title | Severity | Depends on | Status |
| --- | --- | --- | --- | --- |
| 001 | Add `motion` dependency | HIGH | — | DONE |
| 002 | Motion tokens + shared keyframes | HIGH | — | DONE |
| 003 | Button & IconButton press feedback | HIGH | 002 | DONE |
| 004 | Modal exit animation | MEDIUM | 001, 002 | DONE |
| 005 | Toast enter/exit | MEDIUM | 001, 002 | DONE |
| 006 | Accordion expand/collapse | MEDIUM | 002 | DONE |
| 007 | SegmentedControl sliding thumb | MEDIUM | 001, 002 | DONE |
| 008 | `/components` entrance + stagger | MEDIUM | 002 | DONE |
| 009 | CopyButton copied-state pop | LOW | 002 | DONE |
| 010 | FileDropzone preview entrance | LOW | 002 | DONE |
| 011 | NavLink active indicator | LOW | 002 | DONE |

## Global acceptance gates (all plans)

- `cd ui && npx tsc -b` passes
- `cd ui && npx vitest run --coverage --coverage.thresholds.lines=99` passes (line gate)
- `prefers-reduced-motion` respected everywhere (movement dropped, opacity/state kept)
- No new dependency beyond `motion` (plan 001); no `transition: all`
