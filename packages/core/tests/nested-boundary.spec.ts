import { expect, test } from "@playwright/test";

for (const hidden of [false, true]) {
  for (const streamed of [false, true]) {
    const mode = [
      hidden ? "Activity" : "unmount",
      streamed ? "streamed tab" : "tab mounted with layout",
    ].join(", ");

    test(`an outer layout leaves after its same-id nested tab (${mode})`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const query = new URLSearchParams();
      if (hidden) query.set("hidden", "");
      if (streamed) query.set("streamed", "");
      await page.goto(`/tests/nested-boundary.html?${query}`);
      await page.waitForFunction(() => document.title.includes("ready"));

      const step = (name: Parameters<Window["nestedBoundary"]["step"]>[0]) =>
        page.evaluate((name) => window.nestedBoundary.step(name), name);

      // The nested "/a" tab arrives inside the layout's own IN. It must not
      // run or linger as the first side of the next navigation.
      expect(await step("enter")).toEqual(["home → layout"]);
      expect(await step("tab")).toEqual(["home → layout", "grid → reels"]);
      // The layout's OUT repeats the path the grid just left with. It still
      // holds the reels page, so it is the start of this navigation.
      expect(await step("leave")).toEqual([
        "home → layout",
        "grid → reels",
        "layout → b",
      ]);
      expect(await step("back")).toEqual([
        "home → layout",
        "grid → reels",
        "layout → b",
        "b → layout",
      ]);
      expect(errors).toEqual([]);
    });
  }
}
