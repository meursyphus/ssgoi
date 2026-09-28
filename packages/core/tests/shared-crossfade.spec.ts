import { expect, test, type Page } from "@playwright/test";

async function pixel(page: Page): Promise<number[]> {
  const png = await page.screenshot({
    clip: { x: 100, y: 100, width: 1, height: 1 },
  });
  // Decode with the browser to avoid adding a PNG dependency to the suite.
  return page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);
    return [...ctx.getImageData(0, 0, 1, 1).data];
  }, png.toString("base64"));
}

for (const effect of ["hero", "zoom"] as const) {
  const types =
    effect === "hero"
      ? (["static", "fade"] as const)
      : (["static", "expand", "blur"] as const);
  for (const type of types) {
    for (const direction of ["forward", "backward"] as const) {
      test(`${effect} ${type} ${direction} keeps shared pixels opaque`, async ({
        page,
      }) => {
        await page.goto("/tests/shared-crossfade.html");
        await page.evaluate(
          (options) => window.sharedCrossfade.setup(options),
          { effect, type, direction },
        );
        const before = await pixel(page);
        await page.evaluate(() => window.sharedCrossfade.start());
        for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
          await page.evaluate(
            (progress) => window.sharedCrossfade.seek(progress),
            progress,
          );
          const during = await pixel(page);
          for (let i = 0; i < 4; i++) {
            expect(
              Math.abs(during[i]! - before[i]!),
              `progress ${progress}, RGBA ${during} vs ${before}`,
            ).toBeLessThanOrEqual(2);
          }
        }
        await page.evaluate(() => window.sharedCrossfade.finish());
        expect(await pixel(page)).toEqual(before);
        await expect(
          page.locator("[data-ssgoi-crossfade], [data-hero-layer]"),
        ).toHaveCount(0);
      });
    }
  }

  for (const direction of ["forward", "backward"] as const) {
    test(`${effect} ${direction} preserves authored opacity`, async ({
      page,
    }) => {
      await page.goto("/tests/shared-crossfade.html");
      await page.evaluate((options) => window.sharedCrossfade.setup(options), {
        effect,
        direction,
        opacity: 0.6,
      });
      const before = await pixel(page);
      await page.evaluate(() => window.sharedCrossfade.start());
      for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
        await page.evaluate(
          (progress) => window.sharedCrossfade.seek(progress),
          progress,
        );
        const during = await pixel(page);
        for (let i = 0; i < 4; i++)
          expect(
            Math.abs(during[i]! - before[i]!),
            `progress ${progress}, RGBA ${during} vs ${before}`,
          ).toBeLessThanOrEqual(2);
      }
      await page.evaluate(() => window.sharedCrossfade.finish());
      expect(await pixel(page)).toEqual(before);
      await expect(page.locator("img")).toHaveCSS("opacity", "0.6");
    });
  }
}
