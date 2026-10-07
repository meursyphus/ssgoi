# Browser regressions

Playwright suites live here. Run them with:

```sh
pnpm --filter @ssgoi/core exec playwright install chromium webkit
pnpm --filter @ssgoi/core test:browser
```

## Detached animation pages (`animation-retention`, #447)

The fixture creates fresh 257-node pages, keeps only `WeakRef`s to departed
nodes, and runs real WAAPI animations and the real SSGOI transition context.
Playwright requests GC four times after each cycle, in separate browser tasks
from creating or reading the weak references. The suite checks natural
completion and mid-flight cancellation/navigation, plus a no-animation control.
It checks a fixed retention bound independent of how many transitions have
run: the context's most recent outgoing page (two for interrupted transitions),
plus one conservative GC survivor. GC is not guaranteed to collect every
unreachable object immediately, including in the no-animation control.
It also weakly tracks native animations and requires
zero detached targets reachable through their effects after settling.

```sh
pnpm --filter @ssgoi/core exec playwright test animation-retention --workers=2
```

Each test attaches JSON measurements at 5/10/15/20 cycles. Interrupted context
cycles navigate twice and assert the second navigation really interrupts an
active transition. The fixture also asserts one attached page and no remaining
WAAPI effects after settling.

For engine-only controls, open `/tests/animation-retention.html?mode=raw` or
`?mode=raw-cleared` / `?mode=raw-released` (append `&interrupted` for cancellation) and drive
`window.animationRetention.cycle()` / `.measure()` using Playwright's
`page.evaluate()` and `page.requestGC()`. Those modes differ only in removing
the finish handler and, for `raw-released`, clearing the canceled animation's
effect. They do not use SSGOI to animate the departing page.

Reproduction on macOS 26.5.1, Playwright 1.58.2, WebKit 26.0 (build 2248), and
Chromium 145.0.7632.6 confirmed linear retention in npm 7.0.1 and 7.4.0:
after 10/20/30/40 departures WebKit retained 2,570/5,140/7,710/10,280 nodes,
including after 20 additional GC requests. Chromium retained a fixed 257 nodes
(514 with interrupted pairs). The raw WAAPI control reproduced the growth;
clearing its handler reduced retained DOM wrappers to zero, but all 40 native
effects could still return their original detached target subtrees. Clearing
the canceled effect too removes that remaining path. The fix applies this
cleanup to both playback animations and the paused holds used in handoffs.
These measurements
establish the tested WebKit behavior, not a direct physical iOS Safari test or
a claim about every browser version or every native allocation.

## Shared crossfade (`shared-crossfade`)

Hero and zoom crossfade identical opaque images at identical coordinates so
any change in the captured pixel is a compositing regression. The suite seeks
real WAAPI keyframes from start to finish in both directions, across all hero
and zoom types, and checks authored opacity and cleanup in Chromium and WebKit.
It catches the backdrop flash caused by fading both overlapping images with
complementary opacities under normal source-over compositing.

## Zoom chrome crossfade (`zoom-chrome`)

A zoom tile is a whole page raised above the other page, so the list chrome
the card sits under (a bottom bar) and the overlays on the card (a badge) are
covered for the whole run, and the detail's own controls over the player ride
inside the tile: all of them popped when the tile settled. Zoom now finds the
chrome painted over the shared element by hit testing, copies it into a layer
above the tile that rides the background page's transform, and crossfades it;
the controls over the shared image crossfade the other way. The fixture builds
a list with a card under a `z-index` bar (its badge opts out of hit testing
and is trimmed by the card's rounded box) and a detail with a control over the
player, then seeks real WAAPI keyframes in both directions for every zoom
type. It asserts the probe pixels at the start, the landing and after
settling, that each copy's box (and its nested text) matches the real chrome
mid-motion, also on a list scrolled by 500px, that a card showing more of the
image than the player keeps a uniform scale with the preview copy covering the
whole card, that the `fade` variant still fades the page body while the
default leaves it, and that no layer, hit-test marker or inline style remains.
The same pages run through hero (`type: "fade"`): its exit flight layer sits
above the list's chrome too, so the copies must ride above that layer.

For manual testing, run `pnpm --filter @ssgoi/core dev`, open
`/tests/zoom-chrome.html`, and drive `window.zoomChrome` from the console.

## In-place hero (`hero-in-place`)

Hero enter animates the real destination image in its own parent without a
placeholder or any layout change. The suite builds detail pages where the
image is a flex item that owns its crop, fills a positioned clipping frame,
keeps the default replaced-element overflow, fills an unpositioned
`overflow: hidden` cell, or sits last / first under Tailwind v4 / v3
`space-y-*` spacing. It seeks real WAAPI keyframes and asserts every element's
layout box (from `offset*`, so transforms do not count), child count and
attributes stay as authored before, during and after the transition, that every
inline style is restored, and that the source copy sits below the image unless
that position would move a sibling. At the start the real image must show
exactly the source crop. With the copy visible, every point of the
interpolated crop must show the image, including cover content past the image
box and flight outside the clipping cell; the image alone paints past its box
in Chromium (`overflow: visible`) and never outside the crop. Exit, a
mid-flight reverse, and the real transition context (unmount and Activity
pages, interrupted and re-entered on the same image, including the motion
handoff's frozen copy under `space-y-*`) must also settle to the authored DOM
with no frame where a sibling moves.

For manual testing, run `pnpm --filter @ssgoi/core dev` and open
`/tests/hero-in-place.html`, then drive `window.heroInPlace` from the console.

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
