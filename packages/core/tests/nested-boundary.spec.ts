import { expect, test } from "@playwright/test";

// A nested boundary sits below a persistent app bar. While the transition
// holds, the outgoing page must stay exactly where the user saw it, and the
// incoming page must sit below the bar — with or without a positioned wrapper
// around the boundary (meursyphus/ssgoi#421).
for (const hidden of [false, true]) {
  for (const wrapped of [false, true]) {
    for (const effect of ["fade", "jaemin"] as const) {
      const name = [
        hidden ? "Activity" : "unmount",
        wrapped ? "wrapped" : "unwrapped",
        effect,
      ].join(" / ");
      test(`keeps the outgoing page in its slot: ${name}`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const query = new URLSearchParams();
        if (hidden) query.set("hidden", "");
        if (wrapped) query.set("wrapped", "");
        if (effect === "jaemin") query.set("jaemin", "");
        await page.goto(`/tests/nested-boundary.html?${query}`);
        await page.waitForFunction(() => document.title.includes("ready"));

        // Scrolled: the page leaves 300px down and the incoming page resets.
        expect(await page.evaluate(() => window.harness.scrollTo(300))).toBe(
          300,
        );
        const scrolled = await page.evaluate(() => window.harness.navigate());
        expect(scrolled).toMatchObject({
          active: true,
          scrollY: 0,
          outgoing: { position: "absolute", connected: true },
        });
        expect(scrolled.outgoing.before).toBeCloseTo(56 - 300, 0);
        expect(scrolled.outgoing.during).toBeCloseTo(
          scrolled.outgoing.before,
          0,
        );
        if (scrolled.incoming.top !== null)
          expect(scrolled.incoming.top).toBeCloseTo(scrolled.barBottom, 0);
        await page.evaluate(() => window.harness.finish());

        // At the top, and again for the return trip.
        const back = await page.evaluate(() => window.harness.navigate());
        expect(back.outgoing.before).toBeCloseTo(56, 0);
        expect(back.outgoing.during).toBeCloseTo(back.outgoing.before, 0);
        if (back.incoming.top !== null)
          expect(back.incoming.top).toBeCloseTo(back.barBottom, 0);
        await page.evaluate(() => window.harness.finish());

        expect(errors).toEqual([]);
      });
    }
  }
}
