import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { SsgoiRouteBoundary } from "../../src/routers/remix";

const location = vi.hoisted(() => ({
  pathname: "/posts",
  search: "",
  hash: "",
  key: "one",
  state: null,
}));
vi.mock("@remix-run/react", () => ({ useLocation: () => location }));
let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement("div");
  root = createRoot(host);
  location.pathname = "/posts";
});
afterEach(async () => {
  await act(() => root.unmount());
});

it("uses Remix location and preserves the outgoing root while replacing the page", async () => {
  const render = () =>
    act(() =>
      root.render(
        <SsgoiRouteBoundary as="article">
          {location.pathname}
        </SsgoiRouteBoundary>,
      ),
    );
  await render();
  const outgoing = host.firstElementChild!;
  location.pathname = "/posts/42";
  await render();
  expect(host.firstElementChild).not.toBe(outgoing);
  expect(outgoing.textContent).toBe("/posts");
  expect(host.firstElementChild!.getAttribute("data-ssgoi-transition")).toBe(
    "/posts/42",
  );
});

it("lets a resolver preserve a shell independently of its pathname", async () => {
  const render = () =>
    act(() =>
      root.render(
        <SsgoiRouteBoundary
          resolve={({ pathname }) => ({ id: pathname, key: "shell" })}
        >
          Shell
        </SsgoiRouteBoundary>,
      ),
    );
  await render();
  const shell = host.firstElementChild;
  location.pathname = "/posts/42";
  await render();
  expect(host.firstElementChild).toBe(shell);
  expect(shell!.getAttribute("data-ssgoi-transition")).toBe("/posts/42");
});
