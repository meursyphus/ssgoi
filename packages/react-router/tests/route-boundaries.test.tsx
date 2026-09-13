import { afterEach, beforeEach, expect, it } from "vitest";
import { act, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, useNavigate, type NavigateFunction } from "react-router";
import { SsgoiRouteBoundary as ReactRouterBoundary } from "../src/index";

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(() => root.unmount());
  host.remove();
});
const render = async (node: ReactNode) => {
  await act(() => root.render(node));
};
const boundary = () => host.querySelector("[data-ssgoi-transition]")!;

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

it("uses a real React Router context and ignores query-only changes by default", async () => {
  let navigate!: NavigateFunction;
  function Page() {
    navigate = useNavigate();
    return (
      <ReactRouterBoundary>
        <Counter />
      </ReactRouterBoundary>
    );
  }
  await render(
    <MemoryRouter initialEntries={["/posts"]}>
      <Page />
    </MemoryRouter>,
  );
  const outgoing = boundary();
  await act(async () => {
    await navigate("/posts?q=one");
  });
  expect(boundary()).toBe(outgoing);
  await act(async () => {
    await navigate("/posts/42");
  });
  expect(boundary()).not.toBe(outgoing);
  expect(boundary().getAttribute("data-ssgoi-transition")).toBe("/posts/42");
});
