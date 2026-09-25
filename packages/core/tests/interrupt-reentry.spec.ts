import { expect, test } from "@playwright/test";

// A page that is still entering when the user navigates away must keep moving
// from where it is. The fixture drives the real transition context, so the
// outgoing page goes through unmount (or an Activity hide) and reinsertion
// exactly as a framework adapter would drive it, and every sample is read
// after paint. `packages/core/tests/interrupt-reentry.html` documents the
// harness.
type Step = { x: number; y: number; w: number; h: number; opacity: number };
type Summary = {
  handoff: Step | null;
  stepBefore: number | null;
  stepAfter: number | null;
  maxStep: number;
};
type Result = {
  effect: string;
  mode: string;
  outgoing: Summary;
  reentering?: Summary;
  invalid: boolean;
  settled: boolean;
};

const magnitude = (step: Step) => Math.max(step.x, step.y, step.w, step.h);

function expectContinuous(effect: string, summary: Summary) {
  const handoff = summary.handoff!;
  expect(handoff, effect).not.toBeNull();
  // Continuity: the step across the handoff is bounded by the motion on
  // either side of it. An empty or shifted frame shows up as hundreds of px.
  const neighbours = Math.max(summary.stepBefore ?? 0, summary.stepAfter ?? 0);
  expect(magnitude(handoff), `${effect} handoff step`).toBeLessThanOrEqual(
    neighbours + 12,
  );
  expect(handoff.opacity, `${effect} opacity`).toBeLessThan(0.15);
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
