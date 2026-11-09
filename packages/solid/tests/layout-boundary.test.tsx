import { afterEach, beforeEach, expect, it } from "vitest";
import { createSignal, type JSX } from "solid-js";
import { render } from "solid-js/web";
import type { SsgoiConfig, SsgoiLayoutScope } from "@ssgoi/core/types";
import { Ssgoi } from "../src/lib/ssgoi";
import { SsgoiLayoutBoundary } from "../src/lib/layout-boundary";

const config: SsgoiConfig = { transitions: [] };
const [path, setPath] = createSignal("/a");
const [renderedPath, setRenderedPath] = createSignal<string>();
const framework = {
  getRoute: () => ({ pathname: path(), renderedPath: renderedPath() }),
};

let host: HTMLDivElement;
let dispose: (() => void) | undefined;
beforeEach(() => {
  // jsdom implements no scrolling; the scroll policy still runs on arrival.
  Element.prototype.scrollTo ??= () => {};
  window.scrollTo ??= () => {};
  setPath("/a");
  setRenderedPath(undefined);
  host = document.createElement("div");
  document.body.append(host);
});
afterEach(() => {
  dispose?.();
  dispose = undefined;
  host.remove();
});

const boundary = (depth = 0) =>
  host.querySelector<HTMLElement>(`[data-boundary="${depth}"]`)!;

/** Mounts `depths` nested prop-less boundaries under one `<Ssgoi>`. */
function mount(
  layouts?: SsgoiLayoutScope[],
  depths = 1,
  as?: keyof JSX.IntrinsicElements,
) {
  const nest = (depth: number): JSX.Element => (
    <SsgoiLayoutBoundary data-boundary={String(depth)} as={as}>
      {depth + 1 < depths ? nest(depth + 1) : <p>page</p>}
    </SsgoiLayoutBoundary>
  );
  dispose = render(
    () => (
      <Ssgoi config={{ ...config, layouts }} framework={framework}>
        {nest(0)}
      </Ssgoi>
    ),
    host,
  );
}

it("keys every boundary by the route path without config.layouts", () => {
  mount(undefined, 1, "section");
  const first = boundary();
  expect(first.tagName).toBe("SECTION");
  expect(first.dataset.ssgoiTransition).toBe("/a");

  setPath("/b");
  expect(boundary().dataset.ssgoiTransition).toBe("/b");
  expect(boundary()).not.toBe(first);
  expect(first.isConnected).toBe(false);
});

it("keeps the DOM within the first matching sibling scope", () => {
  const tabs = ["/home", "/search"];
  setPath("/home");
  mount([{ paths: tabs }, { paths: "/**", except: tabs }]);
  const first = boundary();

  setPath("/search");
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/search");

  setPath("/post/1");
  expect(boundary()).not.toBe(first);
  const detail = boundary();
  setPath("/post/2");
  expect(boundary()).toBe(detail);
});

it("reads nested scopes by boundary depth", () => {
  const tabs = ["/home", "/search"];
  setPath("/products/a");
  mount(
    [
      { paths: tabs },
      { paths: "/**", except: tabs, layouts: [{ paths: "/products/**" }] },
    ],
    3,
  );
  const [outer, section, page] = [boundary(0), boundary(1), boundary(2)];

  // Inside the nested scope only the page past the declared depth remounts.
  setPath("/products/b");
  expect(boundary(0)).toBe(outer);
  expect(boundary(1)).toBe(section);
  expect(boundary(2)).not.toBe(page);
  expect(boundary(2).dataset.ssgoiTransition).toBe("/products/b");

  // Leaving it keeps the outer scope and remounts the section.
  setPath("/post/1");
  expect(boundary(0)).toBe(outer);
  expect(boundary(1)).not.toBe(section);

  setPath("/home");
  expect(boundary(0)).not.toBe(outer);
});

it("splits scope instances by captured segments, not by ** tails", () => {
  setPath("/projects/1/files");
  mount([{ paths: "/projects/:id/**" }]);
  const first = boundary();

  setPath("/projects/1/members");
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/projects/1/members");

  setPath("/projects/2/files");
  expect(boundary()).not.toBe(first);
});

it("prefers the framework's renderedPath over pathname", () => {
  setRenderedPath("/feed");
  setPath("/photo/1");
  mount();
  expect(boundary().dataset.ssgoiTransition).toBe("/feed");
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
