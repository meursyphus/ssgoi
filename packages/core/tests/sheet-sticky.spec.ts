import { expect, test } from "@playwright/test";

// A sheet leaves over a scrolled page that carries a sticky bottom bar. The
// background is clipped and scaled against that page's SAVED scroll, so the
// container must already be there when the first frame is built. If the
// restore only landed on a later frame, the first frame would scale the bar
// around a centre `scroll.y` below the viewport — the bar paints past the
// bottom edge and then jumps once the scroll arrives.
for (const type of ["blur", "scale"] as const) {
  test(`sheet ${type} exit restores the page scroll before its first frame`, async ({
    page,
  }) => {
    await page.goto(`/tests/sheet-sticky.html?type=${type}&scroll=500`);
    await expect(page).toHaveTitle(/ready/);

    await page.evaluate(() => window.sheetHarness.openSheet());
    expect(await page.evaluate(() => window.sheetHarness.scene.scrollTop)).toBe(
      0,
    );

    const samples = await page.evaluate(() => window.sheetHarness.closeSheet());
    const viewport = await page.evaluate(
      () => window.sheetHarness.scene.clientHeight,
    );
    const during = samples.filter(
      (sample) => sample.navBottom !== null && sample.listTransform !== "none",
    );
    expect(during.length).toBeGreaterThan(3);

    // Every animated frame is measured at the saved scroll …
    for (const sample of during) expect(sample.scrollTop).toBe(500);
    // … so the scaled bar never paints below the viewport edge, and it comes
    // to rest exactly on it.
    for (const sample of during) {
      expect(sample.navBottom!).toBeLessThanOrEqual(viewport);
    }
    const settled = samples.at(-1)!;
    expect(settled.scrollTop).toBe(500);
    expect(settled.navBottom).toBe(viewport);
  });
}

// The sheet rises over the scrolled list, which becomes the outgoing
// background: absolute, offset by its saved scroll, and for blur/scale pinned
// to its content height, clipped to that viewport slice and scaled about its
// centre. Its sticky bar must track the viewport edge from the first frame —
// never parked at the end of the content or cut off by the clip while the
// rising sheet has not yet covered that edge.
for (const type of ["static", "scale", "blur"] as const) {
  test(`sheet ${type} enter keeps the background's sticky bar on the viewport edge`, async ({
    page,
  }) => {
    await page.goto(`/tests/sheet-sticky.html?type=${type}&scroll=500`);
    await expect(page).toHaveTitle(/ready/);

    const samples = await page.evaluate(() => window.sheetHarness.openSheet());
    const viewport = await page.evaluate(
      () => window.sheetHarness.scene.clientHeight,
    );
    const during = samples.filter(
      (sample) =>
        sample.navBottom !== null && sample.listPosition === "absolute",
    );
    expect(during.length).toBeGreaterThan(3);

    for (const sample of during) {
      // The container is at the sheet's scroll from the first frame …
      expect(sample.scrollTop).toBe(0);
      // … so the bar sits on the viewport edge as scaled about the viewport
      // centre (the edge itself when the background does not scale).
      const edge = viewport / 2 + (viewport / 2) * sample.listScale;
      expect(Math.abs(sample.navBottom! - edge)).toBeLessThanOrEqual(1);
    }
  });
}

test("sheet static exit leaves the sticky bar at rest", async ({ page }) => {
  await page.goto("/tests/sheet-sticky.html?type=static&scroll=500");
  await expect(page).toHaveTitle(/ready/);
  await page.evaluate(() => window.sheetHarness.openSheet());
  const samples = await page.evaluate(() => window.sheetHarness.closeSheet());
  const viewport = await page.evaluate(
    () => window.sheetHarness.scene.clientHeight,
  );
  for (const sample of samples.filter((s) => s.navBottom !== null)) {
    expect(sample.navBottom).toBe(viewport);
    expect(sample.scrollTop).toBe(500);
  }
});
