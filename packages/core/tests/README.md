# Browser regressions

Playwright suites live here. Run them with:

```sh
pnpm --filter @ssgoi/core exec playwright install chromium webkit
pnpm --filter @ssgoi/core test:browser
```

## Shared crossfade (`shared-crossfade`)

Hero and zoom crossfade identical opaque images at identical coordinates so
any change in the captured pixel is a compositing regression. The suite seeks
real WAAPI keyframes from start to finish in both directions, across all hero
and zoom types, and checks authored opacity and cleanup in Chromium and WebKit.
It catches the backdrop flash caused by fading both overlapping images with
complementary opacities under normal source-over compositing.

## Rounded-full radius (`rounded-full`)

Tailwind v4's `rounded-full` is `border-radius: calc(infinity * 1px)`, which
browsers serialize as huge pixel lengths (`3.35544e+07px` in Chromium, a
39-digit integer in WebKit). The suite reads those real computed values, checks
that media geometry resolves them (and a legacy `9999px` pill) to the circle or
pill they paint, and seeks hero and zoom between a circular avatar and a square
photo: the avatar end must not paint its bbox corners and the photo end must.

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

## Nested boundary with a shared id (`nested-boundary`)

An outer layout boundary `/a` wraps a nested tab boundary whose default tab is
also `/a` (a profile grid). The fixture commits routes like React, lets the
real observer register every boundary, and records each transition that runs.
After the nested `/a → /a/x` tab switch, leaving the layout for `/b` reports
`/a` again; the suite asserts it runs `layout → b` instead of being absorbed
as a late duplicate of the tab switch, and that the nested `/a` arriving with
(or after, `?streamed`) the layout's IN never runs or shifts later pairs. It
covers unmount and Activity (`?hidden`) routes in Chromium and WebKit.

For manual testing, run `pnpm --filter @ssgoi/core dev`, open
`/tests/nested-boundary.html`, and press **Next step** four times.

## Sheet over a sticky bar (`sheet-sticky`)

A `sheet` rises over, then leaves over, a scrolled list page whose sticky
bottom bar lives inside the page. The `blur` and `scale` tones clip and scale
that page against its saved scroll, so the container must already be at the
incoming page's scroll when the first frame is built — otherwise the bar jumps
out of view until the sheet covers it. The fixture drives the real transition
context with unmount-mode pages and samples the bar's on-screen box every
frame. On enter, the suite asserts the container is at the sheet's scroll and
the bar tracks the (scaled) viewport edge on every frame; on exit, that the
scroll is at its saved value and the bar never paints below the viewport edge.
Both directions run in Chromium and WebKit for every sheet type.

For manual testing, run `pnpm --filter @ssgoi/core dev` and open
`/tests/sheet-sticky.html` (`?type=blur|scale|static`, `?scroll=500`,
`?slow=20` to slow the exit, `?auto=1` to open and close without tapping).

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
