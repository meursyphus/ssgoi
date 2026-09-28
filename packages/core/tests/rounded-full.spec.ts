import { expect, test, type Page } from "@playwright/test";

async function sample(
  page: Page,
  points: readonly (readonly [number, number])[],
): Promise<number[][]> {
  const png = await page.screenshot({
    clip: { x: 0, y: 0, width: 400, height: 400 },
  });
  // Decode with the browser to avoid adding a PNG dependency to the suite.
  return page.evaluate(
    async ({ base64, points }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, 0, 0);
      const scale = image.width / 400;
      return points.map(([x, y]) => [
        ...ctx.getImageData(Math.round(x * scale), Math.round(y * scale), 1, 1)
          .data,
      ]);
    },
    { base64: png.toString("base64"), points },
  );
}

function isColor(actual: number[], expected: number[]): boolean {
  return actual.every((value, i) => Math.abs(value - expected[i]!) <= 2);
}

const white = [255, 255, 255, 255];
const blue = [0x28, 0x78, 0xc8, 255];
// The 80px avatar sits at (40, 40). Its bbox corners are outside the circle.
const avatarCorners = [
  [44, 44],
  [116, 44],
  [116, 116],
  [44, 116],
] as const;
const avatarCenter = [80, 80] as const;
// The 240px photo sits at (120, 120), clear of the avatar. Square corners.
const photoCorners = [
  [124, 124],
  [356, 124],
  [356, 356],
  [124, 356],
] as const;

test("resolves rounded-full to the circle or pill it paints", async ({
  page,
}, testInfo) => {
  await page.goto("/tests/rounded-full.html");
  const cases = await page.evaluate(() => window.roundedFull.geometry());
  testInfo.annotations.push({
    type: "computed calc(infinity * 1px)",
    description: cases[0]!.computed,
  });

  expect(cases[0]!.parsed).toBeGreaterThan(1e6);
  expect(
    cases.map(({ name, radius, radiusSource, contentAware }) => ({
      name,
      radius,
      radiusSource,
      contentAware,
    })),
  ).toEqual([
    {
      name: "rounded-full image 78x78",
      radius: 39,
      radiusSource: "computed",
      contentAware: true,
    },
    {
      name: "rounded-full clipping pill 240x60",
      radius: 30,
      radiusSource: "computed",
      contentAware: true,
    },
    {
      name: "rounded-full avatar clipping a keyed image 58x58",
      radius: 29,
      radiusSource: "computed",
      contentAware: true,
    },
    {
      name: "9999px image 200x40",
      radius: 20,
      radiusSource: "computed",
      contentAware: true,
    },
    {
      name: "12px image 100x100",
      radius: 12,
      radiusSource: "computed",
      contentAware: true,
    },
    {
      name: "50% image 100x100",
      radius: 0,
      radiusSource: "unsupported",
      contentAware: false,
    },
  ]);
});

for (const effect of ["hero", "zoom"] as const) {
  for (const direction of ["forward", "backward"] as const) {
    test(`${effect} ${direction} morphs between a rounded-full avatar and a square photo`, async ({
      page,
    }) => {
      await page.goto("/tests/rounded-full.html");
      await page.evaluate((options) => window.roundedFull.setup(options), {
        effect,
        direction,
      });
      await page.evaluate(() => window.roundedFull.start());

      // One end of the flight sits on the circular avatar, the other on the
      // square photo. Each end must paint its own shape.
      const ends: { progress: number; pixels: number[][] }[] = [];
      for (const progress of [0, 1]) {
        await page.evaluate(
          (progress) => window.roundedFull.seek(progress),
          progress,
        );
        ends.push({
          progress,
          pixels: await sample(page, [
            avatarCenter,
            ...avatarCorners,
            ...photoCorners,
          ]),
        });
      }
      const avatarEnd = ends.find(({ pixels }) => isColor(pixels[0]!, blue));
      const photoEnd = ends.find((end) => end !== avatarEnd);
      expect(avatarEnd, JSON.stringify(ends)).toBeDefined();
      const avatarCornerPixels = avatarEnd!.pixels.slice(1, 5);
      expect(
        avatarCornerPixels.every((pixel) => isColor(pixel, white)),
        `avatar corners at progress ${avatarEnd!.progress}: ${JSON.stringify(avatarCornerPixels)}`,
      ).toBe(true);
      const photoCornerPixels = photoEnd!.pixels.slice(5);
      expect(
        photoCornerPixels.every((pixel) => isColor(pixel, blue)),
        `photo corners at progress ${photoEnd!.progress}: ${JSON.stringify(photoCornerPixels)}`,
      ).toBe(true);

      await page.evaluate(() => window.roundedFull.finish());
    });
  }
}
