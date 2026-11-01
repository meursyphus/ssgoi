import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import BoundaryFixture from "./BoundaryFixture.svelte";
import LayoutBoundaryFixture from "./LayoutBoundaryFixture.svelte";
import MissingFrameworkFixture from "./MissingFrameworkFixture.svelte";
import { page, content, startNavigation } from "./navigation";
import type { Component } from "svelte";

// jsdom lacks element scrolling, which <Ssgoi> applies after a transition.
Element.prototype.scrollTo ??= () => {};

let host: HTMLDivElement;
let app: ReturnType<typeof mount> | undefined;
beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  page.set({ url: new URL("https://example.test/projects/42") });
  content.set("Overview");
});
afterEach(async () => {
  if (app) await unmount(app);
  host.remove();
});
const boundary = () => host.querySelector("[data-ssgoi-transition]");

it("SsgoiLayoutBoundary throws without a framework on <Ssgoi>", () => {
  expect(() => {
    app = mount(MissingFrameworkFixture, { target: host });
    flushSync();
  }).toThrow(/^SSGOI: SsgoiLayoutBoundary requires a framework/);
});

type Route = { pathname: string; url: URL };
type Computed = (route: Route) => { id: string; key?: string | number };

function render(Fixture: Component<never>, props: object = {}) {
  app = mount(Fixture as Component<object>, { target: host, props });
  flushSync();
}

// Each boundary expresses the same option through its own props.
describe.each([
  {
    name: "SsgoiRouteBoundary (sveltekit)",
    Fixture: BoundaryFixture,
    computed: (resolve: Computed) => ({ resolve }),
    fixedKey: (routeKey: string | number) => ({ routeKey }),
  },
  {
    name: "SsgoiLayoutBoundary (framework)",
    Fixture: LayoutBoundaryFixture,
    computed: (boundary: Computed) => ({ boundary }),
    fixedKey: (key: string | number) => ({ boundary: { key } }),
  },
])("$name", ({ Fixture: component, computed, fixedKey }) => {
  const Fixture = component as Component<never>;

  it("detaches the outgoing content before Kit updates its live snippet", () => {
    render(Fixture);
    const outgoing = boundary()!;
    expect(outgoing.tagName).toBe("SECTION");
    expect(outgoing.getAttribute("aria-label")).toBe("Page");
    const finish = startNavigation("/projects/42/docs");
    expect(boundary()).toBeNull();
    flushSync(() => content.set("Documents"));
    expect(outgoing.textContent?.trim()).toBe("Overview");
    finish();
    expect(boundary()).not.toBe(outgoing);
    expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe(
      "/projects/42/docs",
    );
    expect(boundary()!.textContent?.trim()).toBe("Documents");
  });

  it("keeps a shell's DOM and edits while updating its outgoing route id", () => {
    render(
      Fixture,
      computed(({ pathname }) => ({
        id: pathname,
        key: pathname.match(/^\/projects\/[^/]+/)?.[0],
      })),
    );
    const shell = boundary();
    const input = host.querySelector("input")!;
    input.value = "Unsaved";
    const finish = startNavigation("/projects/42/docs");
    expect(boundary()).toBe(shell);
    finish();
    flushSync();
    expect(boundary()).toBe(shell);
    expect(host.querySelector("input")).toBe(input);
    expect(input.value).toBe("Unsaved");
    expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe(
      "/projects/42/docs",
    );
    const finishOther = startNavigation("/projects/43");
    expect(boundary()).toBeNull();
    finishOther();
    expect(boundary()).not.toBe(shell);
  });

  it("ignores search-only navigation by default", () => {
    render(Fixture);
    const element = boundary();
    startNavigation("/projects/42?q=two")();
    flushSync();
    expect(boundary()).toBe(element);
  });

  it("can opt into search changes through the URL resolver", () => {
    render(
      Fixture,
      computed(({ url }) => ({ id: url.pathname + url.search })),
    );
    const element = boundary();
    startNavigation("/projects/42?q=two")();
    expect(boundary()).not.toBe(element);
    expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe(
      "/projects/42?q=two",
    );
  });

  it("accepts zero as a stable route key", () => {
    render(Fixture, fixedKey(0));
    const element = boundary();
    startNavigation("/other")();
    flushSync();
    expect(boundary()).toBe(element);
    expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe("/other");
  });

  it("does not remount after an owning layout was destroyed during navigation", async () => {
    render(Fixture);
    const finish = startNavigation("/other");
    await unmount(app!);
    app = undefined;
    finish();
    flushSync();
    expect(host.children).toHaveLength(0);
  });
});

describe("SsgoiLayoutBoundary boundary prop", () => {
  it("treats a string as a fixed key and keeps the pathname as id", () => {
    render(LayoutBoundaryFixture, { boundary: "projects-layout" });
    const element = boundary();
    startNavigation("/other")();
    flushSync();
    expect(boundary()).toBe(element);
    expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe("/other");
  });

  it("treats a returned string as the key", () => {
    render(LayoutBoundaryFixture, {
      boundary: ({ pathname }: Route) => pathname.split("/")[1],
    });
    const element = boundary();
    startNavigation("/projects/43")();
    flushSync();
    expect(boundary()).toBe(element);
    expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe(
      "/projects/43",
    );
    startNavigation("/other")();
    expect(boundary()).not.toBe(element);
  });

  it("fixes the id from an object", () => {
    render(LayoutBoundaryFixture, { boundary: { id: "/feed" } });
    const element = boundary();
    expect(element!.getAttribute("data-ssgoi-transition")).toBe("/feed");
    startNavigation("/other")();
    flushSync();
    expect(boundary()).toBe(element);
    expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe("/feed");
  });

  it("passes extra fields from getRoute to the boundary function", () => {
    render(LayoutBoundaryFixture, {
      getRoute: () => ({
        pathname: "/projects/42",
        url: new URL("https://example.test/projects/42"),
        section: "overview",
      }),
      boundary: (route: Route & { section?: string }) => ({
        id: `${route.pathname}#${route.section ?? "none"}`,
      }),
    });
    expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe(
      "/projects/42#overview",
    );
  });
});
