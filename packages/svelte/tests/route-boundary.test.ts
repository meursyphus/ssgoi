import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { flushSync, mount, unmount, type Component } from "svelte";
import BoundaryFixture from "./BoundaryFixture.svelte";
import LayoutBoundaryFixture from "./LayoutBoundaryFixture.svelte";
import MissingFrameworkFixture from "./MissingFrameworkFixture.svelte";
import { page, content, startNavigation } from "./navigation";
import type { SsgoiConfig } from "../src/lib";

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
const inner = () => host.querySelector("article[data-ssgoi-transition]");
const idOf = (element: Element | null) =>
  element?.getAttribute("data-ssgoi-transition");

function render<Props extends object>(
  Fixture: Component<Props>,
  props = {} as Props,
) {
  app = mount(Fixture as Component<object>, { target: host, props });
  flushSync();
}

it("SsgoiLayoutBoundary throws without a framework on <Ssgoi>", () => {
  expect(() => render(MissingFrameworkFixture)).toThrow(
    /^SSGOI: SsgoiLayoutBoundary requires a framework/,
  );
});

describe.each([
  { name: "SsgoiRouteBoundary (sveltekit)", Fixture: BoundaryFixture },
  { name: "SsgoiLayoutBoundary (no layouts)", Fixture: LayoutBoundaryFixture },
])("$name", ({ Fixture }) => {
  it("detaches the outgoing content before Kit updates its live snippet", () => {
    render(Fixture as Component<object>);
    const outgoing = boundary()!;
    expect(outgoing.tagName).toBe("SECTION");
    expect(outgoing.getAttribute("aria-label")).toBe("Page");
    const finish = startNavigation("/projects/42/docs");
    expect(boundary()).toBeNull();
    flushSync(() => content.set("Documents"));
    expect(outgoing.textContent?.trim()).toBe("Overview");
    finish();
    expect(boundary()).not.toBe(outgoing);
    expect(idOf(boundary())).toBe("/projects/42/docs");
    expect(boundary()!.textContent?.trim()).toBe("Documents");
  });

  it("ignores search-only navigation", () => {
    render(Fixture as Component<object>);
    const element = boundary();
    startNavigation("/projects/42?q=two")();
    flushSync();
    expect(boundary()).toBe(element);
  });

  it("does not remount after an owning layout was destroyed during navigation", async () => {
    render(Fixture as Component<object>);
    const finish = startNavigation("/other");
    await unmount(app!);
    app = undefined;
    finish();
    flushSync();
    expect(host.children).toHaveLength(0);
  });
});

describe("SsgoiRouteBoundary (sveltekit) resolve and routeKey", () => {
  it("keeps a shell's DOM and edits while updating its outgoing route id", () => {
    render(BoundaryFixture, {
      resolve: ({ pathname }) => ({
        id: pathname,
        key: pathname.match(/^\/projects\/[^/]+/)?.[0],
      }),
    });
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
    expect(idOf(boundary())).toBe("/projects/42/docs");
    const finishOther = startNavigation("/projects/43");
    expect(boundary()).toBeNull();
    finishOther();
    expect(boundary()).not.toBe(shell);
  });

  it("can opt into search changes through the URL resolver", () => {
    render(BoundaryFixture, {
      resolve: ({ url }) => ({ id: url.pathname + url.search }),
    });
    const element = boundary();
    startNavigation("/projects/42?q=two")();
    expect(boundary()).not.toBe(element);
    expect(idOf(boundary())).toBe("/projects/42?q=two");
  });

  it("accepts zero as a stable route key", () => {
    render(BoundaryFixture, { routeKey: 0 });
    const element = boundary();
    startNavigation("/other")();
    flushSync();
    expect(boundary()).toBe(element);
    expect(idOf(boundary())).toBe("/other");
  });
});

describe("SsgoiLayoutBoundary with config.layouts", () => {
  const TOP_LEVEL = ["/feed", "/explore"];
  const layouts: SsgoiConfig["layouts"] = [
    { paths: TOP_LEVEL },
    {
      paths: "/**",
      except: TOP_LEVEL,
      layouts: [{ paths: "/projects/:id/**" }],
    },
  ];

  it("keeps a sibling scope mounted and remounts when the scope changes", () => {
    page.set({ url: new URL("https://example.test/feed") });
    render(LayoutBoundaryFixture, { layouts });
    const shell = boundary();
    const input = host.querySelector("input")!;
    input.value = "Unsaved";
    startNavigation("/explore")();
    flushSync();
    expect(boundary()).toBe(shell);
    expect(input.value).toBe("Unsaved");
    expect(idOf(boundary())).toBe("/explore");
    const finish = startNavigation("/projects/42");
    expect(boundary()).toBeNull();
    finish();
    expect(boundary()).not.toBe(shell);
    expect(idOf(boundary())).toBe("/projects/42");
  });

  it("keys nested boundaries by depth and captured segments", () => {
    render(LayoutBoundaryFixture, { layouts, nested: true });
    const outer = boundary();
    const article = inner();
    const input = host.querySelector("input")!;
    input.value = "Unsaved";

    // Same `/projects/:id/**` instance: a ** tail is not part of the key.
    startNavigation("/projects/42/docs")();
    flushSync();
    expect(boundary()).toBe(outer);
    expect(inner()).toBe(article);
    expect(input.value).toBe("Unsaved");
    expect(idOf(inner())).toBe("/projects/42/docs");

    // Another capture: the depth-1 instance changes, depth 0 stays.
    const finish = startNavigation("/projects/43");
    expect(boundary()).toBe(outer);
    expect(inner()).toBeNull();
    finish();
    expect(boundary()).toBe(outer);
    expect(inner()).not.toBe(article);
    expect(idOf(boundary())).toBe("/projects/43");
    expect(idOf(inner())).toBe("/projects/43");
  });

  it("keys a boundary deeper than the chain by its pathname", () => {
    page.set({ url: new URL("https://example.test/feed") });
    render(LayoutBoundaryFixture, { layouts, nested: true });
    const outer = boundary();
    const article = inner();
    startNavigation("/explore")();
    flushSync();
    expect(boundary()).toBe(outer);
    expect(inner()).not.toBe(article);
    expect(idOf(inner())).toBe("/explore");
  });

  it("detaches the whole scope when leaving it, nested boundaries included", () => {
    render(LayoutBoundaryFixture, { layouts, nested: true });
    const outer = boundary();
    const finish = startNavigation("/feed");
    expect(boundary()).toBeNull();
    finish();
    expect(boundary()).not.toBe(outer);
    expect(idOf(boundary())).toBe("/feed");
    expect(idOf(inner())).toBe("/feed");
  });
});
