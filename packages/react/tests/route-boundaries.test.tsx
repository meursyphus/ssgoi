import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { MemoryRouter, useNavigate, type NavigateFunction } from "react-router";
import {
  SsgoiRouteBoundary as NextBoundary,
  selectedSegmentsToPath,
} from "../src/lib/nextjs";
import { SsgoiRouteBoundary as ReactRouterBoundary } from "../src/lib/react-router";
import { SsgoiRouteBoundary as TanstackBoundary } from "../src/lib/tanstack-router";

const navigation = vi.hoisted(() => ({
  pathname: "/projects" as string | null,
  segments: ["(tabs)", "projects"],
  pending: null as Promise<void> | null,
  slot: "",
}));
vi.mock("next/navigation", () => ({
  usePathname: () => {
    if (navigation.pending) throw navigation.pending;
    return navigation.pathname;
  },
  useSelectedLayoutSegments: (slot: string) => {
    navigation.slot = slot;
    return navigation.segments;
  },
}));
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
  navigation.segments = ["(tabs)", "projects"];
  navigation.pending = null;
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

it("renders the route marker during SSR", () => {
  expect(
    renderToString(
      <NextBoundary as="article" id="page" className="page">
        Server content
      </NextBoundary>,
    ),
  ).toContain(
    '<article id="page" class="page" data-ssgoi-transition="/projects">Server content</article>',
  );
});

describe.each([NextBoundary, TanstackBoundary])(
  "pathname boundaries",
  (Boundary) => {
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
  },
);

it("keeps a background slot on soft interception and replaces it on direct entry", async () => {
  const resolve = ({ selectedSegments }: { selectedSegments: string[] }) => {
    const id = selectedSegmentsToPath(selectedSegments);
    return { id, key: selectedSegments.includes("(tabs)") ? "tabs" : id };
  };
  await render(
    <NextBoundary resolve={resolve}>
      <Counter />
    </NextBoundary>,
  );
  const background = boundary();
  navigation.pathname = "/p/42";
  await render(
    <NextBoundary resolve={resolve}>
      <Counter />
    </NextBoundary>,
  );
  expect(boundary()).toBe(background);
  expect(boundary().getAttribute("data-ssgoi-transition")).toBe("/projects");
  navigation.segments = ["(detail)", "p", "42"];
  await render(
    <NextBoundary resolve={resolve}>
      <Counter />
    </NextBoundary>,
  );
  expect(boundary()).not.toBe(background);
  expect(boundary().getAttribute("data-ssgoi-transition")).toBe("/p/42");
});

it("passes the requested parallel slot to Next.js", async () => {
  await render(<NextBoundary parallelRoutesKey="modal" />);
  expect(navigation.slot).toBe("modal");
  expect(boundary().hasAttribute("parallelRoutesKey")).toBe(false);
});

it("shows the fallback for a nullable pathname without resolving an invented route", async () => {
  navigation.pathname = null;
  await render(
    <NextBoundary
      fallback={<p>Loading</p>}
      resolve={() => {
        throw new Error("not ready");
      }}
    />,
  );
  expect(host.textContent).toBe("Loading");
  expect(boundary()).toBeNull();
  navigation.pathname = "/ready";
  await render(<NextBoundary fallback={<p>Loading</p>}>Ready</NextBoundary>);
  expect(boundary().getAttribute("data-ssgoi-transition")).toBe("/ready");
});

it("catches URL suspension outside the hook and mounts the resolved route", async () => {
  let finish!: () => void;
  navigation.pending = new Promise<void>((resolve) => {
    finish = resolve;
  });
  await render(<NextBoundary fallback={<p>Loading</p>}>Ready</NextBoundary>);
  expect(host.textContent).toBe("Loading");
  expect(boundary()).toBeNull();
  await act(async () => {
    navigation.pending = null;
    finish();
  });
  expect(boundary().textContent).toBe("Ready");
});

it("preserves nested project shells while replacing only their content", async () => {
  const resolve = ({ pathname }: { pathname: string }) => ({
    id: pathname,
    key: pathname.match(/^\/projects\/[^/]+/)?.[0] ?? pathname,
  });
  const view = () => (
    <NextBoundary resolve={resolve}>
      <header>Project</header>
      <NextBoundary>
        <Counter />
      </NextBoundary>
    </NextBoundary>
  );
  navigation.pathname = "/projects/42";
  await render(view());
  const shell = boundary();
  const header = host.querySelector("header");
  const content = shell.querySelector("[data-ssgoi-transition]");
  navigation.pathname = "/projects/42/docs";
  await render(view());
  expect(boundary()).toBe(shell);
  expect(host.querySelector("header")).toBe(header);
  expect(shell.querySelector("[data-ssgoi-transition]")).not.toBe(content);
  navigation.pathname = "/projects/43";
  await render(view());
  expect(boundary()).not.toBe(shell);
});

it.each([
  [[], "/", "/"],
  [["(tabs)", "projects"], "/", "/projects"],
  [["(.)blog", "one/two"], "/", "/blog/one/two"],
  [["(..)(..)photo", "42"], "/", "/photo/42"],
  [["(...)photo", "42"], "/", "/photo/42"],
  [["docs"], "/projects/42", "/projects/42/docs"],
  [[], "/projects/42/", "/projects/42"],
] as const)(
  "resolves selected segments %j under %s",
  (segments, base, expected) => {
    expect(selectedSegmentsToPath(segments, base)).toBe(expected);
  },
);

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
