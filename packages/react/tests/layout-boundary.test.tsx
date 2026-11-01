import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import {
  MemoryRouter,
  useLocation,
  useNavigate,
  type NavigateFunction,
} from "react-router";
import { Ssgoi, SsgoiLayoutBoundary, type SsgoiFramework } from "../src";
import { SsgoiRouteBoundary as DeprecatedNextBoundary } from "../src/legacy/nextjs";

const navigation = vi.hoisted(() => ({
  pathname: "/projects" as string | null,
  /** TanStack's rendered leaf match; null means "same as pathname". */
  matchPathname: null as string | null,
  pending: null as Promise<void> | null,
  slot: undefined as string | undefined,
}));
vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useSelectedLayoutSegments: () => ["projects"],
}));

// Next-like: segments come from the owning layout, as in the App Router.
const pathOf = (segments: readonly string[]) =>
  `/${segments.filter((segment) => !segment.startsWith("(")).join("/")}`;
const Slots = createContext<Record<string, string[]>>({ children: [] });
const usePathname = () => {
  if (navigation.pending) throw navigation.pending;
  return navigation.pathname;
};
const useSelectedLayoutSegments = (slot: string) => {
  navigation.slot = slot;
  return useContext(Slots)[slot] ?? null;
};
const next: SsgoiFramework = {
  useRoute: ({ parallelRoutesKey = "children" }) => {
    const pathname = usePathname();
    const selectedSegments = useSelectedLayoutSegments(parallelRoutesKey) ?? [];
    return pathname == null ? null : { pathname, selectedSegments };
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

const config = { transitions: [] };
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
  navigation.pathname = "/projects";
  navigation.matchPathname = null;
  navigation.pending = null;
  navigation.slot = undefined;
});
afterEach(async () => {
  await act(() => root.unmount());
  host.remove();
});
const render = async (framework: SsgoiFramework, node: ReactNode) => {
  await act(() =>
    root.render(
      <Ssgoi config={config} framework={framework}>
        {node}
      </Ssgoi>,
    ),
  );
};
const boundary = () => host.querySelector("[data-ssgoi-transition]")!;
const routeId = () => boundary().getAttribute("data-ssgoi-transition");

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

describe("without a framework", () => {
  const message =
    /^SSGOI: SsgoiLayoutBoundary requires a framework\. Pass it to <Ssgoi framework=\{\{ useRoute \}\}>\.$/;

  it("throws outside <Ssgoi>", () => {
    expect(() => renderToString(<SsgoiLayoutBoundary />)).toThrow(message);
  });

  it("throws under <Ssgoi> without framework", () => {
    expect(() =>
      renderToString(
        <Ssgoi config={config}>
          <SsgoiLayoutBoundary />
        </Ssgoi>,
      ),
    ).toThrow(message);
  });

  it("leaves the deprecated subpath working on its own router imports", () => {
    expect(
      renderToString(
        <Ssgoi config={config}>
          <DeprecatedNextBoundary
            resolve={({ selectedSegments }) => ({
              id: pathOf(selectedSegments),
            })}
          />
        </Ssgoi>,
      ),
    ).toContain('data-ssgoi-transition="/projects"');
  });
});

describe("Next-like framework", () => {
  it("renders the route marker during SSR", () => {
    expect(
      renderToString(
        <Ssgoi config={config} framework={next}>
          <SsgoiLayoutBoundary as="article" id="page" className="page">
            Server content
          </SsgoiLayoutBoundary>
        </Ssgoi>,
      ),
    ).toContain(
      '<article id="page" class="page" data-ssgoi-transition="/projects">Server content</article>',
    );
  });

  it("replaces the real DOM on navigation while preserving the outgoing content", async () => {
    const view = () => (
      <SsgoiLayoutBoundary as="section" title="route">
        <Counter />
      </SsgoiLayoutBoundary>
    );
    await render(next, view());
    const outgoing = boundary();
    await act(() => host.querySelector("button")!.click());
    navigation.pathname = "/projects/42";
    await render(next, view());
    expect(boundary()).not.toBe(outgoing);
    expect(outgoing.textContent).toBe("1");
    expect(boundary().textContent).toBe("0");
    expect(routeId()).toBe("/projects/42");
    expect(boundary().tagName).toBe("SECTION");
    expect(boundary().getAttribute("title")).toBe("route");
  });

  it("keeps a string boundary as the key and the pathname as the id", async () => {
    const view = () => (
      <SsgoiLayoutBoundary boundary="shell">
        <Counter />
      </SsgoiLayoutBoundary>
    );
    await render(next, view());
    const shell = boundary();
    await act(() => host.querySelector("button")!.click());
    navigation.pathname = "/collections";
    await render(next, view());
    expect(boundary()).toBe(shell);
    expect(boundary().textContent).toBe("1");
    expect(routeId()).toBe("/collections");
  });

  it("resolves from the owning layout's selected segments", async () => {
    const resolve = ({ selectedSegments }: { selectedSegments: string[] }) => {
      const id = pathOf(selectedSegments);
      return { id, key: selectedSegments.includes("(tabs)") ? "tabs" : id };
    };
    const view = (segments: string[]) => (
      <Slots.Provider value={{ children: segments }}>
        <SsgoiLayoutBoundary boundary={resolve}>
          <Counter />
        </SsgoiLayoutBoundary>
      </Slots.Provider>
    );
    await render(next, view(["(tabs)", "projects"]));
    const background = boundary();
    expect(navigation.slot).toBe("children");
    // A soft intercept moves the URL but not the children slot.
    navigation.pathname = "/p/42";
    await render(next, view(["(tabs)", "projects"]));
    expect(boundary()).toBe(background);
    expect(routeId()).toBe("/projects");
    await render(next, view(["(detail)", "p", "42"]));
    expect(boundary()).not.toBe(background);
    expect(routeId()).toBe("/p/42");
  });

  it("passes the requested parallel slot and treats a null slot as empty", async () => {
    const resolve = vi.fn(({ pathname }: { pathname: string }) => ({
      id: pathname,
    }));
    await render(
      next,
      <SsgoiLayoutBoundary parallelRoutesKey="modal" boundary={resolve} />,
    );
    expect(navigation.slot).toBe("modal");
    expect(resolve).toHaveBeenLastCalledWith({
      pathname: "/projects",
      selectedSegments: [],
    });
    expect(boundary().hasAttribute("parallelRoutesKey")).toBe(false);
  });

  it("shows the fallback for a nullable pathname without resolving an invented route", async () => {
    navigation.pathname = null;
    await render(
      next,
      <SsgoiLayoutBoundary
        fallback={<p>Loading</p>}
        boundary={() => {
          throw new Error("not ready");
        }}
      />,
    );
    expect(host.textContent).toBe("Loading");
    expect(boundary()).toBeNull();
    navigation.pathname = "/ready";
    await render(
      next,
      <SsgoiLayoutBoundary fallback={<p>Loading</p>}>
        Ready
      </SsgoiLayoutBoundary>,
    );
    expect(routeId()).toBe("/ready");
  });

  it("catches URL suspension outside the hook and mounts the resolved route", async () => {
    let finish!: () => void;
    navigation.pending = new Promise<void>((resolve) => {
      finish = resolve;
    });
    await render(
      next,
      <SsgoiLayoutBoundary fallback={<p>Loading</p>}>
        Ready
      </SsgoiLayoutBoundary>,
    );
    expect(host.textContent).toBe("Loading");
    expect(boundary()).toBeNull();
    await act(async () => {
      navigation.pending = null;
      finish();
    });
    expect(boundary().textContent).toBe("Ready");
  });
});

describe("boundary input", () => {
  const navigate = async (node: () => ReactNode, to: string) => {
    await render(next, node());
    const before = boundary();
    navigation.pathname = to;
    await render(next, node());
    return before;
  };

  it.each([
    ["an object id", { id: "/feed" }, "/feed", true],
    ["an object key", { key: "shell" }, "/projects/42", true],
    ["a function's string", () => "shell", "/projects/42", true],
    ["a function's id", () => ({ id: "/feed" }), "/feed", true],
    [
      "a function of the route",
      ({ pathname }: { pathname: string }) => ({ id: pathname }),
      "/projects/42",
      false,
    ],
    ["no input", undefined, "/projects/42", false],
  ] as const)(
    "resolves %s into the id and a key defaulting to it",
    async (_, input, id, kept) => {
      const before = await navigate(
        () => <SsgoiLayoutBoundary boundary={input}>Page</SsgoiLayoutBoundary>,
        "/projects/42",
      );
      expect(routeId()).toBe(id);
      expect(boundary() === before).toBe(kept);
    },
  );
});

describe("React Router-like framework", () => {
  const reactRouter: SsgoiFramework = { useRoute: () => useLocation() };

  it("passes the location to a boundary function and ignores query-only changes by default", async () => {
    let navigate!: NavigateFunction;
    const resolve = vi.fn(({ pathname }: { pathname: string }) => ({
      id: pathname,
    }));
    function Page() {
      navigate = useNavigate();
      return (
        <SsgoiLayoutBoundary boundary={resolve}>
          <Counter />
        </SsgoiLayoutBoundary>
      );
    }
    await act(() =>
      root.render(
        <MemoryRouter initialEntries={["/posts"]}>
          <Ssgoi config={config} framework={reactRouter}>
            <Page />
          </Ssgoi>
        </MemoryRouter>,
      ),
    );
    const outgoing = boundary();
    await act(async () => {
      await navigate("/posts?q=one");
    });
    expect(boundary()).toBe(outgoing);
    const location = resolve.mock.lastCall![0];
    expect(location).toMatchObject({ pathname: "/posts", search: "?q=one" });
    await act(async () => {
      await navigate("/posts/42");
    });
    expect(boundary()).not.toBe(outgoing);
    expect(routeId()).toBe("/posts/42");
  });
});

describe("TanStack-like framework", () => {
  it("keeps the rendered route while the next matches are pending", async () => {
    navigation.pathname = "/pinterest";
    await render(tanstack, <SsgoiLayoutBoundary>list</SsgoiLayoutBoundary>);
    const outgoing = boundary();
    expect(routeId()).toBe("/pinterest");

    // location moves first; the outlet still renders the list
    navigation.pathname = "/pinterest/pin-1";
    navigation.matchPathname = "/pinterest";
    await render(tanstack, <SsgoiLayoutBoundary>list</SsgoiLayoutBoundary>);
    expect(boundary()).toBe(outgoing);

    navigation.matchPathname = null;
    await render(tanstack, <SsgoiLayoutBoundary>detail</SsgoiLayoutBoundary>);
    expect(boundary()).not.toBe(outgoing);
    expect(routeId()).toBe("/pinterest/pin-1");
  });

  it("drops the index match's trailing slash unless the URL has one", async () => {
    navigation.pathname = "/pinterest";
    navigation.matchPathname = "/pinterest/";
    await render(tanstack, <SsgoiLayoutBoundary>list</SsgoiLayoutBoundary>);
    expect(routeId()).toBe("/pinterest");

    navigation.pathname = "/pinterest/";
    await render(tanstack, <SsgoiLayoutBoundary>list</SsgoiLayoutBoundary>);
    expect(routeId()).toBe("/pinterest/");
  });
});
