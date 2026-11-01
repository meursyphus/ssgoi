import { afterEach, beforeEach, expect, it } from "vitest";
import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import { MemoryRouter, Route, createMemoryHistory } from "@solidjs/router";
import type { SsgoiConfig } from "@ssgoi/core/types";
import { Ssgoi } from "../src/lib/ssgoi";
import {
  SsgoiLayoutBoundary,
  type SsgoiLayoutBoundaryProps,
} from "../src/lib/layout-boundary";
import {
  SsgoiRouteBoundary,
  type SsgoiRouteBoundaryProps,
} from "../src/lib/legacy/solid-router";

const config: SsgoiConfig = { transitions: [] };
const [path, setPath] = createSignal("/a");
// `project` is an extra route field that must reach `resolve` untouched.
const framework = {
  getRoute: () => ({
    pathname: path(),
    project: path().match(/^\/projects\/([^/]+)/)?.[1],
  }),
};

let host: HTMLDivElement;
let dispose: (() => void) | undefined;
beforeEach(() => {
  // jsdom implements no scrolling; the scroll policy still runs on arrival.
  Element.prototype.scrollTo ??= () => {};
  window.scrollTo ??= () => {};
  setPath("/a");
  host = document.createElement("div");
  document.body.append(host);
});
afterEach(() => {
  dispose?.();
  dispose = undefined;
  host.remove();
});

const boundary = () => host.querySelector<HTMLElement>("[data-boundary]")!;

function mount(props: SsgoiLayoutBoundaryProps) {
  dispose = render(
    () => (
      <Ssgoi config={config} framework={framework}>
        <SsgoiLayoutBoundary data-boundary="" {...props}>
          <p>page</p>
        </SsgoiLayoutBoundary>
      </Ssgoi>
    ),
    host,
  );
}

it("re-keys the boundary when the framework pathname changes", () => {
  mount({ as: "section" });
  const first = boundary();
  expect(first.tagName).toBe("SECTION");
  expect(first.dataset.ssgoiTransition).toBe("/a");

  setPath("/b");
  expect(boundary().dataset.ssgoiTransition).toBe("/b");
  expect(boundary()).not.toBe(first);
  expect(first.isConnected).toBe(false);
});

it("treats a string boundary as a fixed key while the id follows the path", () => {
  mount({ boundary: "shell" });
  const first = boundary();

  setPath("/b");
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/b");
});

it("uses an object boundary's id, keyed by that id by default", () => {
  mount({ boundary: { id: "/feed" } });
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("/feed");

  setPath("/b");
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/feed");
});

it("passes the framework route, extra fields included, to a boundary function", () => {
  setPath("/projects/1/files");
  mount({
    boundary: (route) => ({
      id: route.pathname,
      key: typeof route.project === "string" ? route.project : route.pathname,
    }),
  });
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("/projects/1/files");

  setPath("/projects/1/settings");
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/projects/1/settings");

  setPath("/projects/2/files");
  expect(boundary()).not.toBe(first);
});

it("treats a string returned by a boundary function as the key", () => {
  setPath("/projects/1/files");
  mount({ boundary: () => "workspace" });
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("/projects/1/files");

  setPath("/settings");
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/settings");
});

it("throws when <Ssgoi> has no framework", () => {
  expect(() =>
    render(
      () => (
        <Ssgoi config={config}>
          <SsgoiLayoutBoundary>page</SsgoiLayoutBoundary>
        </Ssgoi>
      ),
      host,
    ),
  ).toThrow(/^SSGOI: SsgoiLayoutBoundary requires a framework/);
});

function mountRouter(props: SsgoiRouteBoundaryProps = {}) {
  const history = createMemoryHistory();
  history.set({ value: "/a" });
  const Layout = (layout: { children?: JSX.Element }) => (
    <Ssgoi config={config}>
      <SsgoiRouteBoundary data-boundary="" {...props}>
        {layout.children}
      </SsgoiRouteBoundary>
    </Ssgoi>
  );
  dispose = render(
    () => (
      <MemoryRouter history={history} root={Layout}>
        <Route path="/a" component={() => <p>a</p>} />
        <Route path="/b" component={() => <p>b</p>} />
      </MemoryRouter>
    ),
    host,
  );
  return history;
}

it("keeps the deprecated solid-router boundary working without a framework", async () => {
  const history = mountRouter();
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("/a");

  history.set({ value: "/b" });
  await Promise.resolve();
  expect(boundary().dataset.ssgoiTransition).toBe("/b");
  expect(boundary()).not.toBe(first);
});

it("keeps the deprecated resolve and routeKey props", async () => {
  const history = mountRouter({
    resolve: ({ pathname }) => ({ id: `page:${pathname}` }),
    routeKey: "shell",
  });
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("page:/a");
  expect(first.hasAttribute("routeKey")).toBe(false);

  history.set({ value: "/b" });
  await Promise.resolve();
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("page:/b");
});
