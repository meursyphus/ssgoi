import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { SsgoiRouteBoundary as TanstackBoundary } from "../src/index";
const navigation = vi.hoisted(() => ({ pathname: "/projects" }));
vi.mock("@tanstack/react-router", () => ({
  useRouterState: ({
    select,
  }: {
    select: (state: { location: { pathname: string } }) => string;
  }) => select({ location: { pathname: navigation.pathname! } }),
}));
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  navigation.pathname = "/projects";
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

describe.each([TanstackBoundary])("pathname boundaries", (Boundary) => {
  it("replaces the real DOM on navigation while preserving the outgoing content", async () => {
    await render(
      <Boundary as="section" title="route" style={{ minHeight: 10 }}>
        <Counter />
      </Boundary>,
    );
    const outgoing = boundary();
    await act(() => host.querySelector("button")!.click());
    expect(outgoing.textContent).toBe("1");
    navigation.pathname = "/projects/42";
    await render(
      <Boundary as="section" title="route" style={{ minHeight: 10 }}>
        <Counter />
      </Boundary>,
    );
    expect(boundary()).not.toBe(outgoing);
    expect(outgoing.textContent).toBe("1");
    expect(boundary().textContent).toBe("0");
    expect(boundary().getAttribute("data-ssgoi-transition")).toBe(
      "/projects/42",
    );
    expect(boundary().tagName).toBe("SECTION");
    expect(boundary().getAttribute("title")).toBe("route");
  });

  it("preserves a shell with routeKey and updates its logical route id", async () => {
    await render(
      <Boundary routeKey="shell">
        <Counter />
      </Boundary>,
    );
    const shell = boundary();
    await act(() => host.querySelector("button")!.click());
    navigation.pathname = "/collections";
    await render(
      <Boundary routeKey="shell">
        <Counter />
      </Boundary>,
    );
    expect(boundary()).toBe(shell);
    expect(boundary().textContent).toBe("1");
    expect(boundary().getAttribute("data-ssgoi-transition")).toBe(
      "/collections",
    );
  });
});
