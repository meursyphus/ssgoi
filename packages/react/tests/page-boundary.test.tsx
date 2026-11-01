import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as React from "react";
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import {
  Ssgoi,
  SsgoiPageBoundary,
  type SsgoiConfig,
  type SsgoiFramework,
} from "../src";

const navigation = {
  pathname: "/" as string | null,
  renderedPath: null as string | null,
  pending: null as Promise<void> | null,
};

const next: SsgoiFramework = {
  useRoute: () => {
    if (navigation.pending) throw navigation.pending;
    const { pathname, renderedPath } = navigation;
    if (pathname == null) return null;
    return renderedPath ? { pathname, renderedPath } : { pathname };
  },
};

const config: SsgoiConfig = { transitions: [] };

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  Element.prototype.scrollTo ??= () => {};
  window.scrollTo ??= () => {};
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  navigation.pathname = "/";
  navigation.renderedPath = null;
  navigation.pending = null;
});
afterEach(async () => {
  await act(() => root.unmount());
  host.remove();
});

const render = async (node: ReactNode) => {
  await act(() =>
    root.render(
      <Ssgoi config={config} framework={next}>
        {node}
      </Ssgoi>,
    ),
  );
};
const by = (name: string) =>
  host.querySelector<HTMLElement>(`[data-name="${name}"]`);
const id = (name: string) => by(name)?.getAttribute("data-ssgoi-transition");

/** A route-group layout boundary with a page boundary and chrome inside it. */
const group = (extra?: Record<string, string>) => (
  <SsgoiPageBoundary data-name="layout" {...extra}>
    <SsgoiPageBoundary as="section" data-name="page">
      Page
    </SsgoiPageBoundary>
    <nav>Nav</nav>
  </SsgoiPageBoundary>
);

describe("route id", () => {
  it("renders the initial route id and DOM attributes during SSR", () => {
    navigation.pathname = "/search";
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(
        renderToString(
          <Ssgoi config={config} framework={next}>
            <SsgoiPageBoundary as="article" id="page" className="page">
              Server content
            </SsgoiPageBoundary>
          </Ssgoi>,
        ),
      ).toContain(
        '<article id="page" class="page" data-ssgoi-transition="/search">Server content</article>',
      );
    } finally {
      error.mockRestore();
    }
  });

  it("ignores a misleading renderedPath and uses pathname", async () => {
    // Next's caller-relative renderedPath is "/" inside every page.
    navigation.pathname = "/posts/1";
    navigation.renderedPath = "/";
    await render(group());
    expect(id("layout")).toBe("/posts/1");
    expect(id("page")).toBe("/posts/1");
    navigation.pathname = "/posts/2";
    navigation.renderedPath = "/elsewhere";
    await render(group());
    expect(id("layout")).toBe("/posts/2");
    expect(id("page")).toBe("/posts/2");
  });

  it("follows the route while visible without remounting (group layout)", async () => {
    await render(group());
    const layout = by("layout");
    const page = by("page");
    expect(id("layout")).toBe("/");
    navigation.pathname = "/search";
    await render(group());
    expect(by("layout")).toBe(layout);
    expect(by("page")).toBe(page);
    expect(id("layout")).toBe("/search");
    expect(id("page")).toBe("/search");
  });

  it("never overwrites the imperative id from render", async () => {
    await render(group());
    by("layout")!.setAttribute("data-ssgoi-transition", "/elsewhere");
    // Same route, other props: React re-renders but the attribute prop is constant.
    await render(group({ "data-extra": "1" }));
    expect(by("layout")!.dataset.extra).toBe("1");
    expect(id("layout")).toBe("/elsewhere");
  });
});

describe("route readiness", () => {
  it("renders nested layout and page boundaries", async () => {
    await render(group());
    expect(by("layout")!.tagName).toBe("DIV");
    expect(by("page")!.tagName).toBe("SECTION");
    expect(by("layout")!.contains(by("page"))).toBe(true);
    expect(by("layout")!.textContent).toBe("PageNav");
  });

  it("renders nothing until the router is ready", async () => {
    navigation.pathname = null;
    await render(
      <>
        {group()}
        <aside>Outside</aside>
      </>,
    );
    expect(host.querySelector("[data-ssgoi-transition]")).toBeNull();
    expect(host.textContent).toBe("Outside");
    navigation.pathname = "/";
    await render(group());
    expect(id("layout")).toBe("/");
  });

  it("catches URL suspension and mounts the resolved route", async () => {
    let finish!: () => void;
    navigation.pending = new Promise<void>((resolve) => {
      finish = resolve;
    });
    await render(group());
    expect(host.textContent).toBe("");
    await act(async () => {
      navigation.pending = null;
      finish();
    });
    expect(id("layout")).toBe("/");
  });
});

describe("without a framework", () => {
  const message =
    /^SSGOI: SsgoiPageBoundary requires a framework\. Pass it to <Ssgoi framework=\{\{ useRoute \}\}>\.$/;

  it("throws outside <Ssgoi>", () => {
    expect(() => renderToString(<SsgoiPageBoundary />)).toThrow(message);
  });

  it("throws under <Ssgoi> without framework", () => {
    expect(() =>
      renderToString(
        <Ssgoi config={config}>
          <SsgoiPageBoundary />
        </Ssgoi>,
      ),
    ).toThrow(message);
  });
});

// `<Activity>` ships in React 19.2; the package's dev React is 18.3.1, where
// this block is skipped.
const Activity = (React as { Activity?: typeof React.Activity }).Activity;

describe.skipIf(!Activity)("inside React <Activity>", () => {
  const ActivityRoute = Activity!;
  const show = (mode: "visible" | "hidden") =>
    render(<ActivityRoute mode={mode}>{group()}</ActivityRoute>);

  /**
   * Every `display:none !important` write, with the id at that moment: React's
   * hide first, then core's own re-hide once the OUT has played.
   */
  let hides: { name: string | undefined; id: string | null }[];
  beforeEach(() => {
    hides = [];
    const setProperty = CSSStyleDeclaration.prototype.setProperty;
    vi.spyOn(CSSStyleDeclaration.prototype, "setProperty").mockImplementation(
      function (this: CSSStyleDeclaration, name, value, priority) {
        if (
          name === "display" &&
          value === "none" &&
          priority === "important"
        ) {
          const el = [
            ...host.querySelectorAll<HTMLElement>("[data-name]"),
          ].find((node) => node.style === this);
          hides.push({
            name: el?.dataset.name,
            id: el?.getAttribute("data-ssgoi-transition") ?? null,
          });
        }
        return setProperty.call(this, name, value, priority);
      },
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hides only the top-most boundary, with the signature core observes", async () => {
    await show("visible");
    await show("hidden");
    expect(hides.length).toBeGreaterThan(0);
    expect(new Set(hides.map((hide) => hide.name))).toEqual(
      new Set(["layout"]),
    );
    expect(by("page")!.style.getPropertyValue("display")).toBe("");
  });

  it("keeps the last visible route as the id while hidden, then catches up on reveal", async () => {
    navigation.pathname = "/search";
    await show("visible");
    const layout = by("layout");
    // Navigation hides the group in the same commit the route changes.
    navigation.pathname = "/posts/1";
    await show("hidden");
    expect(hides[0]).toEqual({ name: "layout", id: "/search" });
    expect(hides.every((hide) => hide.id === "/search")).toBe(true);
    expect(id("layout")).toBe("/search");
    expect(id("page")).toBe("/search");
    navigation.pathname = "/posts/2";
    await show("hidden");
    expect(id("layout")).toBe("/search");
    expect(id("page")).toBe("/search");
    // Back: the same DOM node is revealed and its id follows the route again.
    navigation.pathname = "/profile";
    await show("visible");
    expect(by("layout")).toBe(layout);
    expect(id("layout")).toBe("/profile");
    expect(id("page")).toBe("/profile");
  });

  it("keeps the initial id for a route first rendered hidden", async () => {
    navigation.pathname = "/prefetched";
    await show("hidden");
    navigation.pathname = "/other";
    await show("hidden");
    expect(id("layout")).toBe("/prefetched");
    await show("visible");
    expect(id("layout")).toBe("/other");
  });
});
