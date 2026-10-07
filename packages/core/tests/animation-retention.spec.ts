import { expect, test } from "@playwright/test";

for (const mode of ["none", "driver", "context"] as const) {
  for (const interrupted of mode === "none" ? [false] : [false, true]) {
    test(`${mode}: detached pages are collected (${interrupted ? "interrupted" : "finished"})`, async ({
      page,
    }, testInfo) => {
      test.setTimeout(90_000);
      await page.goto(
        `/tests/animation-retention.html?mode=${mode}${interrupted ? "&interrupted" : ""}`,
      );
      await expect(page).toHaveTitle("Animation retention — ready");
      const samples = [];
      for (let cycle = 1; cycle <= 20; cycle++) {
        await page.evaluate(() => window.animationRetention.cycle());
        for (let gc = 0; gc < 4; gc++) await page.requestGC();
        if (cycle % 5 === 0) {
          samples.push({
            cycle,
            ...(await page.evaluate(() => window.animationRetention.measure())),
          });
        }
      }
      await testInfo.attach("retained-nodes", {
        body: JSON.stringify(samples, null, 2),
        contentType: "application/json",
      });
      console.log(
        JSON.stringify({
          browser: testInfo.project.name,
          mode,
          interrupted,
          samples,
        }),
      );
      for (const sample of samples) {
        expect(sample.attachedPages).toBe(1);
        expect(sample.activeAnimations).toBe(0);
        expect(sample.detachedEffectTargets).toBe(0);
        expect(sample.interruptions).toBe(
          mode === "context" && interrupted ? sample.cycle : 0,
        );
      }
      // Intermediate GC requests can leave conservative survivors even in
      // the no-animation control. Allow GC to catch up before asserting the
      // final, fixed bound; effect targets above must be zero at every sample.
      const allowance = 1 + (mode === "context" ? (interrupted ? 2 : 1) : 0);
      await expect
        .poll(
          async () => {
            for (let gc = 0; gc < 4; gc++) await page.requestGC();
            return page.evaluate(
              () => window.animationRetention.measure().detached,
            );
          },
          { timeout: 5_000 },
        )
        .toBeLessThanOrEqual(257 * allowance);
    });
  }
}
