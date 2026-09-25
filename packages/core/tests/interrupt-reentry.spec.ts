import { expect, test } from "@playwright/test";

// A page that is still entering when the user navigates away must keep moving
// from where it is. The fixture drives the real transition context, so the
// outgoing page goes through unmount (or an Activity hide) and reinsertion
// exactly as a framework adapter would drive it, and every sample is read
// after paint. `packages/core/tests/interrupt-reentry.html` documents the
// harness.
type Speed = { box: number; opacity: number };
type Summary = {
  handoff: { x: number; y: number; w: number; h: number } | null;
  handoffSpeed: (Speed & { dt: number }) | null;
  neighbourSpeed: Speed;
};
type Result = {
  effect: string;
  mode: string;
  outgoing: Summary;
  reentering?: Summary;
  invalid: boolean;
};

function expectContinuous(effect: string, summary: Summary) {
  expect(summary.handoff, effect).not.toBeNull();
  const speed = summary.handoffSpeed!;
  expect(speed, `${effect} handoff frame`).not.toBeNull();
  // Continuity: the page may not move faster across the handoff than it does
  // in the frames around it. An empty or shifted frame decodes into hundreds
  // of px inside one frame (tens of px/ms) where neighbours move a few px/ms.
  // Speeds, not steps, because a browser can hold the first paint after a
  // navigation for tens of ms and then repeat a frame while catching up.
  // A stalled first paint (headless WebKit takes 60-100 ms to rebuild film's
  // scene) averages the fastest part of the bridge into one frame, so a long
  // frame may run up to twice as fast as its neighbours; a wrong frame still
  // decodes far beyond that.
  const headroom = speed.dt > 40 ? summary.neighbourSpeed.box : 0;
  expect(
    speed.box,
    `${effect} box speed px/ms over ${speed.dt.toFixed(0)} ms`,
  ).toBeLessThanOrEqual(summary.neighbourSpeed.box + headroom + 0.6);
  expect(speed.opacity, `${effect} opacity speed /ms`).toBeLessThanOrEqual(
    summary.neighbourSpeed.opacity + 0.005,
  );
}

for (const hidden of [false, true]) {
  for (const scroll of [0, 300]) {
    test(`keeps an interrupted entry in place (${hidden ? "Activity" : "unmount"}, scroll ${scroll})`, async ({
      page,
    }) => {
      test.setTimeout(240_000);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(
        `/tests/interrupt-reentry.html${hidden ? "?hidden" : ""}`,
      );
      await page.waitForFunction(() => document.title.includes("ready"));
      const results = (await page.evaluate(
        ({ scroll }) =>
          window.reentry.runAll({ interruptAfter: 120, second: "a", scroll }),
        { scroll },
      )) as Result[];
      expect(results.length).toBeGreaterThan(10);
      for (const result of results) {
        expect(result.invalid, `${result.effect} wrote NaN`).toBe(false);
        // jaemin keeps both pages out of flow while its incoming page is
        // scaled down, so a document scroll restore has nothing to scroll;
        // that is a scroll-extent limitation, not a handoff.
        if (hidden && scroll && result.effect === "jaemin") continue;
        expectContinuous(result.effect, result.outgoing);
        if (result.reentering)
          expectContinuous(result.effect, result.reentering);
      }
      expect(errors).toEqual([]);
    });
  }
}
