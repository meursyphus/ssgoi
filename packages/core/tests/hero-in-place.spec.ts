import { expect, test, type Page } from "@playwright/test";

type Box = { left: number; top: number; width: number; height: number };

async function pixels(
  page: Page,
  points: readonly (readonly [number, number])[],
): Promise<number[][]> {
  const png = await page.screenshot({
    clip: { x: 0, y: 0, width: 360, height: 560 },
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
      const scale = image.width / 360;
      return points.map(([x, y]) => [
        ...ctx
          .getImageData(Math.round(x * scale), Math.round(y * scale), 1, 1)
          .data.slice(0, 3),
      ]);
    },
    { base64: png.toString("base64"), points },
  );
}

const near = (actual: number[], expected: number[], tolerance = 24) =>
  actual.every((value, i) => Math.abs(value - expected[i]!) <= tolerance);
const white = [255, 255, 255];
const blue = [0x28, 0x78, 0xc8];
const red = [0xe0, 0x40, 0x2a];

const expectBox = (actual: Box, expected: Box, digits = 0) => {
  for (const key of ["left", "top", "width", "height"] as const)
    expect(actual[key], key).toBeCloseTo(expected[key], digits);
};

type Layout = NonNullable<
  NonNullable<Parameters<typeof window.heroInPlace.setup>[0]>["layout"]
>;

const enterCases: [Layout, "static" | "fade"][] = [
  ["flow", "static"],
  ["flow", "fade"],
  ["gallery", "static"],
  ["gallery", "fade"],
  ["plain", "static"],
  ["cell", "static"],
  ["spaceLast", "static"],
  ["spaceFirst", "static"],
];

for (const [layout, type] of enterCases) {
  test(`${layout} ${type} enter animates the real image without moving any box`, async ({
    page,
  }) => {
    await page.goto("/tests/hero-in-place.html");
    const before = await page.evaluate(
      (options) => window.heroInPlace.setup(options),
      { layout, type },
    );
    const authored = await page.evaluate(() => window.heroInPlace.computed());
    await page.evaluate(() => window.heroInPlace.start());
    // The copy paints below the real image unless that would move it: in
    // Tailwind v3 spacing a preceding sibling gives the image a top margin.
    expect(await page.evaluate(() => window.heroInPlace.copyBelow())).toBe(
      layout !== "spaceFirst",
    );
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const during = await page.evaluate(
        (progress) => window.heroInPlace.seek(progress),
        progress,
      );
      // Same boxes and the same element tree: nothing stands in for the
      // image and no sibling moves, only paint styles change.
      expect(during.layout, `progress ${progress}`).toEqual(before.layout);
      expect(during.children).toEqual(before.children);
      expect(during.attributes).toEqual(before.attributes);
    }
    await page.evaluate(() => window.heroInPlace.seek(0));
    // At the start the real image shows exactly the source crop.
    const source = await page.evaluate(() => window.heroInPlace.source());
    const { window: start } = await page.evaluate(() =>
      window.heroInPlace.visible(),
    );
    expectBox(start, source);

    const after = await page.evaluate(() => window.heroInPlace.finish());
    expect(after).toEqual(before);
    expect(await page.evaluate(() => window.heroInPlace.transients())).toBe(0);
    expect(await page.evaluate(() => window.heroInPlace.computed())).toEqual(
      authored,
    );
  });
}

for (const layout of ["flow", "gallery"] as const) {
  test(`${layout} exit leaves both pages' layout and styles as authored`, async ({
    page,
  }) => {
    await page.goto("/tests/hero-in-place.html");
    const before = await page.evaluate(
      (options) => window.heroInPlace.setup(options),
      { layout, direction: "backward" as const, type: "fade" as const },
    );
    await page.evaluate(() => window.heroInPlace.start());
    for (const progress of [0, 0.5, 1]) {
      const during = await page.evaluate(
        (progress) => window.heroInPlace.seek(progress),
        progress,
      );
      expect(during.layout).toEqual(before.layout);
      expect(during.children).toEqual(before.children);
      expect(during.attributes).toEqual(before.attributes);
    }
    expect(await page.evaluate(() => window.heroInPlace.finish())).toEqual(
      before,
    );
    expect(await page.evaluate(() => window.heroInPlace.transients())).toBe(0);
  });

  test(`${layout} reversing mid-flight restores every inline style`, async ({
    page,
  }) => {
    await page.goto("/tests/hero-in-place.html");
    const before = await page.evaluate(
      (options) => window.heroInPlace.setup(options),
      { layout, type: "fade" as const },
    );
    await page.evaluate(() => window.heroInPlace.start());
    await page.evaluate(() => window.heroInPlace.seek(0.5));
    await page.evaluate(() => window.heroInPlace.reverse());
    const during = await page.evaluate(() => window.heroInPlace.seek(0.5));
    expect(during.layout).toEqual(before.layout);
    const after = await page.evaluate(() => window.heroInPlace.finish());
    expect(after.layout).toEqual(before.layout);
    expect(after.children).toEqual(before.children);
    expect(after.attributes).toEqual(before.attributes);
    // The reverse run swapped which page is stacked on top; everything else
    // is back to its authored inline style.
    const withoutPages = (styles: Record<string, string | null>) =>
      Object.fromEntries(
        Object.entries(styles).filter(([key]) => key.includes(">")),
      );
    expect(withoutPages(after.styles)).toEqual(withoutPages(before.styles));
    expect(await page.evaluate(() => window.heroInPlace.transients())).toBe(0);
  });
}

const runtimeCases: [Layout, boolean][] = [
  ["flow", false],
  ["flow", true],
  ["gallery", false],
  ["gallery", true],
  // A handoff may crossfade a frozen copy of the image next to it.
  ["spaceLast", true],
  ["spaceFirst", true],
];

for (const [layout, hidden] of runtimeCases) {
  test(`${layout} runtime ${hidden ? "Activity" : "unmount"} interrupt and re-entry settle to the authored DOM`, async ({
    page,
  }) => {
    await page.goto("/tests/hero-in-place.html");
    const result = await page.evaluate(
      (options) => window.heroInPlace.runtime(options),
      { layout, hidden },
    );
    expect(result.settled).toBe(true);
    expect(result.unmatched).toEqual([]);
    expect(result.samples).toBeGreaterThan(10);
    expect(result.shift, JSON.stringify(result)).toBe(0);
    expect(result.transients).toBe(0);
    expect(result.animations).toBe(0);
    for (const pageResult of result.pages)
      expect(pageResult, JSON.stringify(pageResult)).toEqual({
        styles: true,
        children: true,
        attributes: true,
      });
    expect(result.image).toEqual(
      expect.objectContaining({
        transform: "none",
        opacity: "1",
        willChange: "auto",
      }),
    );
  });
}

const mix = (color: number[], alpha: number) =>
  color.map((value, i) => value * alpha + white[i]! * (1 - alpha));

test("the real image paints its cover crop past its box only where the engine allows", async ({
  page,
  browserName,
}) => {
  await page.goto("/tests/hero-in-place.html");
  await page.evaluate((options) => window.heroInPlace.setup(options), {
    layout: "flow" as const,
  });
  await page.evaluate(() => window.heroInPlace.start());
  for (const progress of [0.5, 0.75]) {
    await page.evaluate(
      (progress) => window.heroInPlace.seek(progress),
      progress,
    );
    await page.evaluate(() => window.heroInPlace.hideCopies());
    const { window: crop, box } = await page.evaluate(() =>
      window.heroInPlace.visible(),
    );
    // The real image fades in over its copy; alone it shows at that opacity.
    const { opacity } = await page.evaluate(() =>
      window.heroInPlace.computed(),
    );
    const shown = mix(blue, Number(opacity));
    // The source's square crop is taller than the 4:1 image box.
    expect(crop.top).toBeLessThan(box.top - 4);
    expect(crop.top + crop.height).toBeGreaterThan(box.top + box.height + 4);
    const x = crop.left + crop.width / 2;
    const [center, beyondBox, aboveCrop, belowCrop] = await pixels(page, [
      [x, crop.top + crop.height / 2],
      [x, (crop.top + box.top) / 2],
      [x, crop.top - 3],
      [x, crop.top + crop.height + 3],
    ]);
    expect(near(center!, shown), `center ${center}`).toBe(true);
    // Nothing outside the interpolated crop paints (no red/green bands).
    expect(near(aboveCrop!, white), `above ${aboveCrop}`).toBe(true);
    expect(near(belowCrop!, white), `below ${belowCrop}`).toBe(true);
    expect(near(aboveCrop!, red)).toBe(false);
    // Chromium honors `overflow: visible` on replaced elements; WebKit may
    // still clip at the image box, where the copy covers the crop instead.
    const painted = near(beyondBox!, shown);
    if (browserName === "chromium")
      expect(painted, `beyond box ${beyondBox}`).toBe(true);
    else
      expect(
        painted || near(beyondBox!, white),
        `beyond box ${beyondBox}`,
      ).toBe(true);
  }
});

// The copy sits below the real image and stays opaque, so the whole crop is
// covered even where the image cannot paint: past its own box (default
// replaced-element overflow, or WebKit) or outside an unpositioned clipping
// cell. Fading bands there would expose the white page behind the flight.
for (const layout of ["flow", "plain", "cell", "spaceLast"] as const) {
  test(`${layout} crossfade covers the whole interpolated crop`, async ({
    page,
  }) => {
    await page.goto("/tests/hero-in-place.html");
    await page.evaluate((options) => window.heroInPlace.setup(options), {
      layout,
    });
    await page.evaluate(() => window.heroInPlace.start());
    for (const progress of [0.1, 0.25, 0.5, 0.75]) {
      await page.evaluate(
        (progress) => window.heroInPlace.seek(progress),
        progress,
      );
      const { window: crop } = await page.evaluate(() =>
        window.heroInPlace.visible(),
      );
      const x = crop.left + crop.width / 2;
      const y = crop.top + crop.height / 2;
      const inset = 5;
      const points = [
        [x, y],
        [x, crop.top + inset],
        [x, crop.top + crop.height - inset],
        [crop.left + inset, y],
        [crop.left + crop.width - inset, y],
      ] as const;
      const colors = await pixels(page, points);
      colors.forEach((color, i) =>
        expect(
          near(color, blue),
          `progress ${progress} point ${points[i]} = ${color}`,
        ).toBe(true),
      );
    }
  });
}
