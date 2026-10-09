## [1.1.1](https://github.com/bawerbozdag/react-overflow-tabs/compare/v1.1.0...v1.1.1) (2026-10-09)

### Performance Improvements

* ignore irrelevant DOM mutations when syncing tabs
Text-only changes inside a tab no longer trigger a re-query, and the
tab set is kept between syncs instead of being rebuilt. Key changes
on an unchanged tab list are still published.
* skip publishing when no tab visibility changed
Entries that repeat a tab's current state no longer rebuild the key
arrays.

## [1.1.0](https://github.com/bawerbozdag/react-overflow-tabs/compare/v1.0.0...v1.1.0) (2026-09-27)

### Features

* **hook:** track dynamic tabs and report overflow in DOM order
Tabs added, removed or re-keyed after mount are now detected through a
MutationObserver. Previously tabs were collected only once on mount, so
new tabs were never observed and removed tabs stayed in `overflowKeys`.

Fixes:
- `overflowKeys` and `visibleKeys` are always in DOM order; before, the
  order depended on resize history.
- a container ref attached after the first render (e.g. conditional
  rendering) is now resolved.
- visibility is compared against the observer threshold (0.999), so
  sub-pixel rounding no longer marks fully visible tabs as overflowing.
- no crash when IntersectionObserver is unavailable (SSR, jsdom); all
  tabs are reported as visible.
- an invalid `tabSelector` (e.g. ".tab" or '[data-x="1"]') now throws a
  descriptive error instead of a DOMException from querySelectorAll.

Improvements:
- state is held in a single object and only updated when keys change,
  avoiding redundant re-renders.
- README: correct Tailwind example import and `tabSelector` docs.

Note: `overflowKeys` was previously returned in reverse order on the
initial measurement; call `.reverse()` if the old order is needed.

## 1.0.0 (2025-08-25)

### Bug Fixes

* correct export syntax for `useOverflowTabs` in `index.ts`
