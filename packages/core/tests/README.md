# Browser regressions

Two Playwright suites live here. Both run with:

```sh
pnpm --filter @ssgoi/core exec playwright install chromium webkit
pnpm --filter @ssgoi/core test:browser
```

## Interrupted entry (`interrupt-reentry`)

A page that is still entering when the user navigates away must keep moving
from where it is. The fixture drives the real transition context through
unmount and Activity-hidden pages, interrupts an `A → B` entry 120 ms in with
`B → A`, and samples the leaving page's box after every paint. The step across
the handoff has to stay within the steps on either side of it, for every
page-level preset, with and without a saved scroll on `A`.

For manual testing, run `pnpm --filter @ssgoi/core dev` and open
`/tests/interrupt-reentry.html` (add `?hidden` for Activity pages). Pick a
preset, press **B**, then **A** before it settles.

## Scroll lock (`scroll-lock`)

The suite tests native wheel and keyboard scrolling in Chromium and WebKit,
covering document/custom containers, unmounted/Activity-hidden pages, scroll
restoration, rapid navigation, and teardown. The opt-out control reproduces the
original blank tail and subsequent scroll clamp. Tests also assert that the
scroller/root/body styles stay unchanged and exercise a native touch sequence
through Chromium's mobile emulation. This does not replace testing momentum on a
physical iOS device. Native scrollbar dragging/clicking and programmatic scrolling
are intentionally outside the input lock's scope.

For manual testing, run `pnpm --filter @ssgoi/core dev` and open
`/tests/scroll-lock.html`. Add `?custom`, `?hidden`, or `?unlocked` (combinable)
for the corresponding scenario. The fixture starts 600px down the long page and
pauses the next transition so there is time to try scrolling. Use **Finish
transition** to check that scrolling resumes and **Disconnect** to test cleanup.
