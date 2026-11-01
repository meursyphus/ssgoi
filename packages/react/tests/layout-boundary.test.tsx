import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type NavigateFunction,
} from "react-router";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiConfig,
  type SsgoiFramework,
} from "../src";
import { SsgoiRouteBoundary as DeprecatedNextBoundary } from "../src/legacy/nextjs";

const navigation = vi.hoisted(() => ({
  pathname: "/" as string | null,
  /** The path the routed region shows; null means "same as pathname". */
  renderedPath: null as string | null,
  /** TanStack's rendered leaf match; null means "same as pathname". */
  matchPathname: null as string | null,
  pending: null as Promise<void> | null,
}));
vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useSelectedLayoutSegments: () => ["projects"],
}));

const next: SsgoiFramework = {
  useRoute: () => {
    if (navigation.pending) throw navigation.pending;
    const { pathname, renderedPath } = navigation;
    if (pathname == null) return null;
    return renderedPath ? { pathname, renderedPath } : { pathname };
  },
};

// TanStack-like: a selector over router state, like useRouterState.
const useRouterState = <T,>({
  select,
}: {
  select: (state: {
    location: { pathname: string };
    matches: { pathname: string }[];
  }) => T;
}) =>
  select({
    location: { pathname: navigation.pathname! },
    matches: [
      { pathname: "/" },
      { pathname: navigation.matchPathname ?? navigation.pathname! },
    ],
  });
const tanstack: SsgoiFramework = {
  useRoute: () => ({
    pathname: useRouterState({
      select: (state) => {
        const location = state.location.pathname;
        const leaf = state.matches.at(-1)?.pathname;
        if (!leaf) return location;
        return leaf.length > 1 && leaf.endsWith("/") && !location.endsWith("/")
          ? leaf.slice(0, -1)
          : leaf;
      },
    }),
  }),
};

const TOP_LEVEL = ["/", "/search"];
const layouts: SsgoiConfig = {
  transitions: [],
  layouts: [
    { paths: TOP_LEVEL },
    {
      paths: "/**",
      except: TOP_LEVEL,
      layouts: [{ paths: "/products/**" }, { paths: "/projects/:id/**" }],
    },
  ],
};
const noLayouts: SsgoiConfig = { transitions: [] };

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  // jsdom implements no scrolling; the scroll policy still runs on arrival.
  Element.prototype.scrollTo ??= () => {};
  window.scrollTo ??= () => {};
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  navigation.pathname = "/";
  navigation.renderedPath = null;
  navigation.matchPathname = null;
  navigation.pending = null;
});
afterEach(async () => {
  await act(() => root.unmount());
  host.remove();
});

function Counter({ name }: { name: string }) {
  const [count, setCount] = useState(0);
  return (
    <button data-counter={name} onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

/** Region root > (layout) > nested section, plus chrome outside the inner boundary. */
const app = () => (
  <SsgoiLayoutBoundary data-depth="0">
    <SsgoiLayoutBoundary data-depth="1">
      <SsgoiLayoutBoundary data-depth="2">
        <Counter name="page" />
      </SsgoiLayoutBoundary>
      <Counter name="section" />
    </SsgoiLayoutBoundary>
    <nav>
      <Counter name="nav" />
    </nav>
  </SsgoiLayoutBoundary>
);

const render = async (
  node: ReactNode,
  framework: SsgoiFramework = next,
  config: SsgoiConfig = layouts,
) => {
  await act(() =>
    root.render(
      <Ssgoi config={config} framework={framework}>
        {node}
      </Ssgoi>,
    ),
  );
};
const go = async (pathname: string, renderedPath: string | null = null) => {
  navigation.pathname = pathname;
  navigation.renderedPath = renderedPath;
  await render(app());
};
const at = (depth: number) =>
  host.querySelector(`[data-depth="${depth}"]`) as HTMLElement;
const snapshot = () => [0, 1, 2].map(at);
const ids = () => snapshot().map((node) => node.dataset.ssgoiTransition);
const click = (name: string) =>
  act(() =>
    host.querySelector<HTMLButtonElement>(`[data-counter="${name}"]`)!.click(),
  );

describe("depth keys from config.layouts", () => {
  it("moves only the content between top-level tabs and keeps the nav", async () => {
    await go("/");
    const [shell, section, page] = snapshot();
    await click("nav");
    await go("/search");
    expect(at(0)).toBe(shell);
    expect(at(1)).not.toBe(section);
    expect(at(2)).not.toBe(page);
    expect(host.querySelector("nav")!.textContent).toBe("1");
    expect(ids()).toEqual(["/search", "/search", "/search"]);
  });

  it("moves the whole top level, nav included, into a detail page", async () => {
    await go("/search");
    const shell = at(0);
    const nav = host.querySelector("nav");
    await go("/posts/1");
    expect(at(0)).not.toBe(shell);
    expect(host.querySelector("nav")).not.toBe(nav);
    expect(ids()).toEqual(["/posts/1", "/posts/1", "/posts/1"]);
  });

  it("keeps the detail layout between detail pages", async () => {
    await go("/posts/1");
    const [shell, section] = snapshot();
    await go("/posts/2");
    expect(at(0)).toBe(shell);
    expect(at(1)).not.toBe(section);
  });

  it("keeps a nested section while its sub-pages change", async () => {
    await go("/products/all");
    const [shell, section, page] = snapshot();
    await click("section");
    await go("/products/fashion");
    expect(at(0)).toBe(shell);
    expect(at(1)).toBe(section);
    expect(at(1).querySelector('[data-counter="section"]')!.textContent).toBe(
      "1",
    );
    expect(at(2)).not.toBe(page);
    expect(ids()).toEqual([
      "/products/fashion",
      "/products/fashion",
      "/products/fashion",
    ]);
  });

  it("shares a scope instance per captured segment", async () => {
    await go("/projects/1/files");
    const [shell, project] = snapshot();
    await go("/projects/1/members");
    expect(at(1)).toBe(project);
    await go("/projects/2/members");
    expect(at(0)).toBe(shell);
    expect(at(1)).not.toBe(project);
  });

  it("keeps the background while a soft intercept leaves renderedPath alone", async () => {
    await go("/search");
    const before = snapshot();
    await go("/p/42", "/search");
    expect(snapshot()).toEqual(before);
    expect(ids()).toEqual(["/search", "/search", "/search"]);
    // Direct entry renders the detail page itself.
    await go("/p/42");
    expect(at(0)).not.toBe(before[0]);
    expect(ids()).toEqual(["/p/42", "/p/42", "/p/42"]);
  });

  it("reads the route only in the depth-0 boundary", async () => {
    const useRoute = vi.fn(next.useRoute);
    await render(app(), { useRoute });
    expect(useRoute).toHaveBeenCalledTimes(1);
  });

  it("keys every boundary by the route without config.layouts", async () => {
    await render(app(), next, noLayouts);
    const before = snapshot();
    navigation.pathname = "/search";
    await render(app(), next, noLayouts);
    snapshot().forEach((node, depth) => expect(node).not.toBe(before[depth]));
    expect(ids()).toEqual(["/search", "/search", "/search"]);
  });
});

describe("route readiness", () => {
  it("renders the route marker and DOM attributes during SSR", () => {
    expect(
      renderToString(
        <Ssgoi config={layouts} framework={next}>
          <SsgoiLayoutBoundary as="article" id="page" className="page">
            Server content
          </SsgoiLayoutBoundary>
        </Ssgoi>,
      ),
    ).toContain(
      '<article id="page" class="page" data-ssgoi-transition="/">Server content</article>',
    );
  });

  const region = () => (
    <>
      <SsgoiLayoutBoundary>Ready</SsgoiLayoutBoundary>
      <aside>Outside</aside>
    </>
  );

  it("renders no depth-0 boundary until the router is ready", async () => {
    navigation.pathname = null;
    await render(region());
    expect(host.textContent).toBe("Outside");
    navigation.pathname = "/search";
    await render(region());
    expect(host.querySelector("[data-ssgoi-transition]")!.textContent).toBe(
      "Ready",
    );
  });

  it("keeps content outside the boundary rendered while the route suspends", async () => {
    let finish!: () => void;
    navigation.pending = new Promise<void>((resolve) => {
      finish = resolve;
    });
    await render(region());
    expect(host.textContent).toBe("Outside");
    expect(host.querySelector("aside")!.textContent).toBe("Outside");
    await act(async () => {
      navigation.pending = null;
      finish();
    });
    expect(host.textContent).toBe("ReadyOutside");
  });

  it("catches URL suspension at the depth-0 boundary and mounts the resolved route", async () => {
    let finish!: () => void;
    navigation.pending = new Promise<void>((resolve) => {
      finish = resolve;
    });
    await render(<SsgoiLayoutBoundary>Ready</SsgoiLayoutBoundary>);
    expect(host.textContent).toBe("");
    await act(async () => {
      navigation.pending = null;
      finish();
    });
    expect(host.querySelector("[data-ssgoi-transition]")!.textContent).toBe(
      "Ready",
    );
  });
});

describe("without a framework", () => {
  const message =
    /^SSGOI: SsgoiLayoutBoundary requires a framework\. Pass it to <Ssgoi framework=\{\{ useRoute \}\}>\.$/;

  it("throws outside <Ssgoi>", () => {
    expect(() => renderToString(<SsgoiLayoutBoundary />)).toThrow(message);
  });

  it("throws under <Ssgoi> without framework", () => {
    expect(() =>
      renderToString(
        <Ssgoi config={layouts}>
          <SsgoiLayoutBoundary />
        </Ssgoi>,
      ),
    ).toThrow(message);
  });

  it("leaves the deprecated subpath working on its own router imports", () => {
    expect(
      renderToString(
        <Ssgoi config={layouts}>
          <DeprecatedNextBoundary
            resolve={({ selectedSegments }) => ({
              id: `/${selectedSegments.join("/")}`,
            })}
          />
        </Ssgoi>,
      ),
    ).toContain('data-ssgoi-transition="/projects"');
  });
});

describe("React Router-like framework", () => {
  const reactRouter: SsgoiFramework = { useRoute: () => useLocation() };

  it("ignores query-only changes and replaces the page on a new path", async () => {
    let navigate!: NavigateFunction;
    function Page() {
      navigate = useNavigate();
      return (
        <SsgoiLayoutBoundary>
          <Counter name="page" />
        </SsgoiLayoutBoundary>
      );
    }
    await act(() =>
      root.render(
        <MemoryRouter initialEntries={["/posts"]}>
          <Ssgoi config={noLayouts} framework={reactRouter}>
            <Page />
          </Ssgoi>
        </MemoryRouter>,
      ),
    );
    const boundary = () => host.querySelector("[data-ssgoi-transition]")!;
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
});

describe("TanStack-like framework", () => {
  const boundary = () => host.querySelector("[data-ssgoi-transition]")!;
  const view = (text: string) => (
    <SsgoiLayoutBoundary>{text}</SsgoiLayoutBoundary>
  );

  it("keeps the rendered route while the next matches are pending", async () => {
    navigation.pathname = "/pinterest";
    await render(view("list"), tanstack, noLayouts);
    const outgoing = boundary();

    // location moves first; the outlet still renders the list
    navigation.pathname = "/pinterest/pin-1";
    navigation.matchPathname = "/pinterest";
    await render(view("list"), tanstack, noLayouts);
    expect(boundary()).toBe(outgoing);

    navigation.matchPathname = null;
    await render(view("detail"), tanstack, noLayouts);
    expect(boundary()).not.toBe(outgoing);
    expect(boundary().getAttribute("data-ssgoi-transition")).toBe(
      "/pinterest/pin-1",
    );
  });

  it("drops the index match's trailing slash unless the URL has one", async () => {
    navigation.pathname = "/pinterest";
    navigation.matchPathname = "/pinterest/";
    await render(view("list"), tanstack, noLayouts);
    expect(boundary().getAttribute("data-ssgoi-transition")).toBe("/pinterest");

    navigation.pathname = "/pinterest/";
    await render(view("list"), tanstack, noLayouts);
    expect(boundary().getAttribute("data-ssgoi-transition")).toBe(
      "/pinterest/",
    );
  });
});
