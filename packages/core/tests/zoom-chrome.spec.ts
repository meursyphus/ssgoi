import { expect, test, type Page } from "@playwright/test";

const BLUE = [40, 120, 200];
const RED = [216, 30, 30];
const GREEN = [30, 158, 60];
const YELLOW = [240, 196, 25];
const DETAIL = [238, 238, 238];
const LIST = [255, 255, 255];

async function pixel(page: Page, x: number, y: number): Promise<number[]> {
  const png = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);
    return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
  }, png.toString("base64"));
}

function near(actual: number[], expected: number[], tolerance = 3) {
  for (let i = 0; i < 3; i++) {
    expect(
      Math.abs(actual[i]! - expected[i]!),
      `RGB ${actual} vs ${expected}`,
    ).toBeLessThanOrEqual(tolerance);
  }
}

function between(actual: number[], a: number[], b: number[]) {
  for (let i = 0; i < 3; i++) {
    const low = Math.min(a[i]!, b[i]!) - 3;
    const high = Math.max(a[i]!, b[i]!) + 3;
    expect(actual[i], `RGB ${actual} outside ${a}..${b}`).toBeGreaterThan(low);
    expect(actual[i], `RGB ${actual} outside ${a}..${b}`).toBeLessThan(high);
  }
}

/** The stand-in must sit exactly on the chrome it covers, mid-motion too. */
async function expectMirrored(page: Page, selector: string) {
  const [clone, real] = await page.evaluate(
    (selector) => [
      window.zoomChrome.box(`[data-ssgoi-zoom-chrome] ${selector}`),
      window.zoomChrome.box(`.list ${selector}`),
    ],
    selector,
  );
  for (const key of ["left", "top", "width", "height"] as const)
    expect(
      Math.abs(clone![key] - real![key]),
      `${selector} ${key}`,
    ).toBeLessThan(0.5);
}

// Probe points, all in scene coordinates (the scene is at the page origin).
// The card lands at 100,220 200x120; the bar covers y >= 320 (z-index 10);
// the badge sits at the card's top-right; the detail control at 170,90 60x60
// lands at the card centre once the tile has shrunk.
const OVER_BAR = { x: 150, y: 330 };
const OVER_BADGE = { x: 276, y: 234 };
// Inside the badge's box but outside the card's 12px rounded corner.
const CARD_CORNER = { x: 298, y: 222 };
const CARD_CENTRE = { x: 200, y: 280 };
const CONTROL = { x: 200, y: 120 };

for (const type of ["static", "expand", "blur"] as const) {
  test(`${type} exit crossfades the bar, the badge and the player control`, async ({
    page,
  }) => {
    await page.goto("/tests/zoom-chrome.html");
    await page.evaluate((type) => window.zoomChrome.setup({ type }), type);
    await page.evaluate(() => window.zoomChrome.start());

    // The detail page starts on top of everything, control visible.
    await page.evaluate(() => window.zoomChrome.seek(0));
    near(await pixel(page, OVER_BAR.x, OVER_BAR.y), DETAIL);
    near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), BLUE);
    near(await pixel(page, CONTROL.x, CONTROL.y), YELLOW);

    // Halfway the copies ride the background page's own motion exactly but
    // are still invisible: chrome shows only in its page's last stretch.
    await page.evaluate(() => window.zoomChrome.seek(0.5));
    await expectMirrored(page, ".bar");
    await expectMirrored(page, ".badge");
    if (type === "static") {
      near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), BLUE);
      await page.evaluate(() => window.zoomChrome.seek(0.8));
      between(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), RED, BLUE);
    }

    // Landed: the chrome is opaque over the tile, the control has faded out
    // and the card shows the shared image where the control would pop.
    await page.evaluate(() => window.zoomChrome.seek(1));
    near(await pixel(page, OVER_BAR.x, OVER_BAR.y), GREEN);
    near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), RED);
    near(await pixel(page, CARD_CENTRE.x, CARD_CENTRE.y), BLUE);
    // The badge copy is trimmed to the card's rounded box like the badge.
    near(await pixel(page, CARD_CORNER.x, CARD_CORNER.y), LIST);

    // Settled: identical pixels, nothing left behind, inline styles restored.
    await page.evaluate(() => window.zoomChrome.complete());
    expect(
      await page.evaluate(() => window.zoomChrome.inlineOpacity(".control")),
    ).toBe("");
    await page.evaluate(() => window.zoomChrome.finish());
    near(await pixel(page, OVER_BAR.x, OVER_BAR.y), GREEN);
    near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), RED);
    near(await pixel(page, CARD_CENTRE.x, CARD_CENTRE.y), BLUE);
    await expect(page.locator("[data-ssgoi-zoom-chrome]")).toHaveCount(0);
    await expect(page.locator("[data-ssgoi-hit-test]")).toHaveCount(0);
  });

  test(`${type} enter starts as the untouched list and dissolves its chrome`, async ({
    page,
  }) => {
    await page.goto("/tests/zoom-chrome.html");
    await page.evaluate(
      (type) => window.zoomChrome.setup({ type, direction: "forward" }),
      type,
    );
    near(await pixel(page, OVER_BAR.x, OVER_BAR.y), GREEN);
    near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), RED);
    await page.evaluate(() => window.zoomChrome.start());

    // First frame: the card is still under the bar, the badge still on it,
    // and the control has not appeared over the shared image yet.
    await page.evaluate(() => window.zoomChrome.seek(0));
    near(await pixel(page, OVER_BAR.x, OVER_BAR.y), GREEN);
    near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), RED);
    near(await pixel(page, CARD_CORNER.x, CARD_CORNER.y), LIST);
    near(await pixel(page, CARD_CENTRE.x, CARD_CENTRE.y), BLUE);
    near(await pixel(page, CONTROL.x, CONTROL.y), LIST);

    await page.evaluate(() => window.zoomChrome.seek(0.5));
    await expectMirrored(page, ".bar");
    await expectMirrored(page, ".badge");
    // The list's chrome is gone before halfway; it fades during the first
    // stretch while the copies are still card sized.
    if (type === "static") {
      near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), BLUE);
      await page.evaluate(() => window.zoomChrome.seek(0.2));
      between(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), RED, BLUE);
    }

    // Open: the detail page owns the frame and its control is in place.
    await page.evaluate(() => window.zoomChrome.seek(1));
    near(await pixel(page, OVER_BAR.x, OVER_BAR.y), DETAIL);
    near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), BLUE);
    near(await pixel(page, CONTROL.x, CONTROL.y), YELLOW);

    await page.evaluate(() => window.zoomChrome.finish());
    near(await pixel(page, OVER_BAR.x, OVER_BAR.y), DETAIL);
    near(await pixel(page, CONTROL.x, CONTROL.y), YELLOW);
    await expect(page.locator("[data-ssgoi-zoom-chrome]")).toHaveCount(0);
    expect(
      await page.evaluate(() => window.zoomChrome.inlineOpacity(".control")),
    ).toBe("");
  });
}

test("a card that shows more than the player keeps the scale uniform and lands inside it", async ({
  page,
}) => {
  await page.goto("/tests/zoom-chrome.html");
  await page.evaluate(() =>
    window.zoomChrome.setup({ type: "expand", mismatch: true }),
  );
  await page.evaluate(() => window.zoomChrome.start());
  const cardImageOpacity = () =>
    page.evaluate(() => window.zoomChrome.computedOpacity(".card img"));

  // The tile scales by one factor on both axes instead of stretching the
  // page to the card's box, and the card stays visible beneath it so its
  // extra sides can show.
  await page.evaluate(() => window.zoomChrome.seek(0.5));
  const matrix = await page.evaluate(() => window.zoomChrome.outgoingMatrix());
  expect(matrix).not.toBeNull();
  expect(Math.abs(matrix![0]! - matrix![3]!)).toBeLessThan(0.001);
  expect(matrix![0]).toBeLessThan(1);
  expect(await cardImageOpacity()).toBe("1");
  // The tile still rounds toward the card's 12px corners while it is the
  // visible shape; landing inside the card must not flatten them.
  const clip = await page.evaluate(() => window.zoomChrome.outgoingClipPath());
  expect(clip).toMatch(/round (?!0% \/ 0%)(?!0% 0% 0% 0% \/)/);

  // The copy of the card image rides above the tile and covers the whole
  // card, sides included, so the tile's narrower strip never shows an edge.
  const copy = await page.evaluate(() =>
    window.zoomChrome.box("[data-ssgoi-crossfade]"),
  );
  const tile = await page.evaluate(() => window.zoomChrome.box(".detail img"));
  expect(copy.left).toBeLessThan(tile.left);
  expect(copy.left + copy.width).toBeGreaterThan(tile.left + tile.width);
  expect(Math.abs(copy.top - tile.top)).toBeLessThan(0.5);
  expect(Math.abs(copy.height - tile.height)).toBeLessThan(0.5);

  // Landed: the copy sits exactly on the card, the card's left edge (which
  // the player never rendered) and its centre both show the picture, and
  // nothing pops when the tile goes away.
  await page.evaluate(() => window.zoomChrome.seek(1));
  const landed = await page.evaluate(() =>
    window.zoomChrome.box("[data-ssgoi-crossfade]"),
  );
  const card = await page.evaluate(() => window.zoomChrome.box(".card img"));
  for (const key of ["left", "top", "width", "height"] as const)
    expect(Math.abs(landed[key] - card[key]), key).toBeLessThan(0.5);
  near(await pixel(page, 108, 280), BLUE);
  near(await pixel(page, CARD_CENTRE.x, CARD_CENTRE.y), BLUE);
  near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), RED);
  await page.evaluate(() => window.zoomChrome.finish());
  near(await pixel(page, 108, 280), BLUE);
  near(await pixel(page, CARD_CENTRE.x, CARD_CENTRE.y), BLUE);
  await expect(page.locator("[data-ssgoi-crossfade]")).toHaveCount(0);
});

for (const direction of ["backward", "forward"] as const) {
  test(`${direction} keeps the copies on the chrome of a scrolled list`, async ({
    page,
  }) => {
    await page.goto("/tests/zoom-chrome.html");
    await page.evaluate(
      (direction) =>
        window.zoomChrome.setup({ type: "expand", scrolled: true, direction }),
      direction,
    );
    await page.evaluate(() => window.zoomChrome.start());
    // The layer lives in the scrolled container's content space; placing it
    // by its scroll offset twice sent every copy 500px down the page.
    for (const progress of [0, 0.5, 1]) {
      await page.evaluate(
        (progress) => window.zoomChrome.seek(progress),
        progress,
      );
      await expectMirrored(page, ".bar");
      await expectMirrored(page, ".badge");
    }
    const landed = direction === "backward";
    near(await pixel(page, OVER_BAR.x, OVER_BAR.y), landed ? GREEN : DETAIL);
    near(await pixel(page, OVER_BADGE.x, OVER_BADGE.y), landed ? RED : BLUE);
    await page.evaluate(() => window.zoomChrome.finish());
    await expect(page.locator("[data-ssgoi-zoom-chrome]")).toHaveCount(0);
  });
}

test("a card the player fully contains hides the card while the tile paints it", async ({
  page,
}) => {
  await page.goto("/tests/zoom-chrome.html");
  await page.evaluate(() => window.zoomChrome.setup({ type: "expand" }));
  await page.evaluate(() => window.zoomChrome.start());
  await page.evaluate(() => window.zoomChrome.seek(0.5));
  expect(
    await page.evaluate(() => window.zoomChrome.computedOpacity(".card img")),
  ).toBe("0");
  await page.evaluate(() => window.zoomChrome.finish());
  expect(
    await page.evaluate(() => window.zoomChrome.computedOpacity(".card img")),
  ).toBe("1");
});

for (const variant of ["default", "fade"] as const) {
  test(`the ${variant} variant ${variant === "fade" ? "fades" : "leaves"} the page body under the player`, async ({
    page,
  }) => {
    await page.goto("/tests/zoom-chrome.html");
    await page.evaluate(
      (variant) => window.zoomChrome.setup({ type: "static", variant }),
      variant,
    );
    await page.evaluate(() => window.zoomChrome.start());
    const opacity = () =>
      page.evaluate(() => window.zoomChrome.computedOpacity(".body"));
    await page.evaluate(() => window.zoomChrome.seek(0));
    expect(await opacity()).toBe("1");
    await page.evaluate(() => window.zoomChrome.seek(1));
    expect(await opacity()).toBe(variant === "fade" ? "0" : "1");
    await page.evaluate(() => window.zoomChrome.complete());
    expect(
      await page.evaluate(() => window.zoomChrome.inlineOpacity(".body")),
    ).toBe("");
  });
}
