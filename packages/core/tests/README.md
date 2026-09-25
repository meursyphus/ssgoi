# Scroll lock browser regression

From the repository root:

```sh
pnpm --filter @ssgoi/core exec playwright install chromium webkit
pnpm --filter @ssgoi/core test:browser
```

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

# Nested boundary placement

`nested-boundary.spec.ts` covers a nested boundary under a persistent app bar
(meursyphus/ssgoi#421). While a paused transition holds, the outgoing page must
stay where the user saw it (scrolled and at the top) and the incoming page must
sit below the bar, for unmounted and Activity-hidden pages, with and without a
positioned wrapper, and with `jaemin` (whose `prepare` pins the incoming page
`position: fixed`). Open `/tests/nested-boundary.html` with `?hidden`,
`?wrapped` or `?jaemin` to inspect a case by hand.
