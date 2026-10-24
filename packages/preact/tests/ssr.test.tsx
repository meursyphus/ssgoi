// @vitest-environment node
import { expect, it } from "vitest";
import { renderToString } from "preact-render-to-string";
import { Ssgoi, SsgoiRouteBoundary, useSsgoiTransition } from "../src";

function Status() {
  return <output>{useSsgoiTransition().status}</output>;
}

it("renders on a server with no DOM globals", () => {
  expect(typeof document).toBe("undefined");
  expect(
    renderToString(
      <Ssgoi config={{}}>
        <Status />
        <SsgoiRouteBoundary id="/server">
          <h1>Server</h1>
        </SsgoiRouteBoundary>
      </Ssgoi>,
    ),
  ).toContain("<output>idle</output>");
});

it("reports a missing provider clearly", () => {
  expect(() => renderToString(<Status />)).toThrow(
    "useSsgoiTransition must be used within <Ssgoi>",
  );
});
