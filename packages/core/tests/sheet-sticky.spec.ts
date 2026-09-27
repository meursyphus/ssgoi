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
