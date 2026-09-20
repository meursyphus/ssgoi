import { expect, test } from "@playwright/test";

for (const custom of [false, true]) {
  for (const hidden of [false, true]) {
    test(`locks ${custom ? "custom" : "document"} scrolling with ${hidden ? "Activity" : "unmount"} pages`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const query = new URLSearchParams();
      if (custom) query.set("custom", "");
      if (hidden) query.set("hidden", "");
      await page.goto(`/tests/scroll-lock.html?${query}`);
      await page.waitForFunction(() => document.title.includes("ready"));
      const before = await page.evaluate(() => window.harness.state());
      const during = await page.evaluate(() => window.harness.navigate());
      expect(during).toMatchObject({
        locked: true,
        y: 0,
        active: true,
        width: before.width,
      });

      await page.mouse.move(300, 300);
      await page.mouse.wheel(0, 1800);
      await page.evaluate(async () => {
        await window.harness.frames(20);
        const scroller = window.harness.scroller;
        if (scroller !== document.documentElement) {
          scroller.tabIndex = 0;
          scroller.focus({ preventScroll: true });
        }
      });
      for (const key of ["End", "PageDown", "ArrowDown", "Space"])
        await page.keyboard.press(key);
      const afterInput = await page.evaluate(async () => {
        await window.harness.frames(20);
        return window.harness.state();
      });
      expect(afterInput.y).toBe(0);
      expect(
        await page.evaluate(() => {
          const event = new Event("touchmove", {
            bubbles: true,
            cancelable: true,
          });
          Object.defineProperty(event, "touches", { value: [{}] });
          window.harness.scroller.dispatchEvent(event);
          return event.defaultPrevented;
        }),
      ).toBe(true);

      expect(await page.evaluate(() => window.harness.finish())).toMatchObject({
        locked: false,
        y: 0,
        height: 1000,
      });
      await page.mouse.wheel(0, 1800);
      await expect
        .poll(() => page.evaluate(() => window.harness.state().y))
        .toBeGreaterThan(0);
      // Let wheel scrolling finish before recording the returning navigation.
      await page.evaluate(() => window.harness.frames(20));
      expect(
        await page.evaluate(() => window.harness.navigate()),
      ).toMatchObject({ locked: true, y: 600 });
      expect(await page.evaluate(() => window.harness.finish())).toMatchObject({
        locked: false,
        y: 600,
      });

      await page.evaluate(() => window.harness.host.pause());
      for (let i = 0; i < 3; i++)
        await page.evaluate(() => window.harness.navigate());
      expect(await page.evaluate(() => window.harness.state().locked)).toBe(
        true,
      );
      await page.evaluate(() => window.harness.context.disconnect?.());
      expect(await page.evaluate(() => window.harness.state().locked)).toBe(
        false,
      );
      expect(errors).toEqual([]);
    });
  }
}

test("opt-out reproduces the long OUT scroll extent and end-of-transition jump", async ({
  page,
}) => {
  await page.goto("/tests/scroll-lock.html?unlocked");
  await page.waitForFunction(() => document.title.includes("ready"));
  await page.evaluate(() => window.harness.navigate());
  await page.mouse.move(300, 300);
  await page.mouse.wheel(0, 1800);
  await page.evaluate(() => window.harness.frames(30));
  const before = await page.evaluate(() => window.harness.state());
  expect(before.y).toBeGreaterThan(1000);
  const after = await page.evaluate(() => window.harness.finish());
  expect(after.y).toBeLessThan(before.y);
});
