import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, createContext, useContext, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  SsgoiRouteBoundary,
  selectedSegmentsToPath,
  type NextjsRouteLocation,
} from "../src/index";

// Model the hooks at each owning layout, rather than giving nested boundaries
// the root's segments. This is the persistent-shell/parallel-slot shape used by
// Comwit; application policy is expressed only through the public adapter API.
const Slots = createContext<Record<string, string[]>>({ children: [] });
let pathname = "/projects";
vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useSelectedLayoutSegments: (slot: string) => useContext(Slots)[slot] ?? [],
}));

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(() => root.unmount());
  host.remove();
});

function Draft({ name }: { name: string }) {
  const [value, setValue] = useState("");
  return (
    <button data-draft={name} onClick={() => setValue("Unsaved")}>
      {value}
    </button>
  );
}

function resolveShell({ selectedSegments }: NextjsRouteLocation) {
  const id = selectedSegmentsToPath(selectedSegments);
  return {
    id,
    key: selectedSegments.includes("(top-level)")
      ? "main-shell"
      : (id.match(/^\/projects\/[^/]+/)?.[0] ?? id),
  };
}

const marker = (name: string) =>
  host.querySelector(`[data-boundary="${name}"]`)!;
const routeId = (node: Element) => node.getAttribute("data-ssgoi-transition");
async function edit(name: string) {
  await act(() =>
    host.querySelector<HTMLButtonElement>(`[data-draft="${name}"]`)!.click(),
  );
}

async function renderTabs(url: string, tab: string, modal?: string) {
  pathname = url;
  await act(() =>
    root.render(
      <Slots.Provider value={{ children: ["(top-level)", tab] }}>
        <SsgoiRouteBoundary data-boundary="app" resolve={resolveShell}>
          <Slots.Provider
            value={{ children: [tab], modal: modal ? ["(.)p", modal] : [] }}
          >
            <SsgoiRouteBoundary
              data-boundary="content"
              resolve={({ selectedSegments }) => ({
                id: selectedSegmentsToPath(selectedSegments),
              })}
            >
              <Draft name="tab" />
            </SsgoiRouteBoundary>
            <nav>
              <Draft name="nav" />
            </nav>
            {modal && (
              <SsgoiRouteBoundary
                data-boundary="modal"
                parallelRoutesKey="modal"
                resolve={({ selectedSegments }) => ({
                  id: selectedSegmentsToPath(selectedSegments),
                })}
              >
                Post {modal}
              </SsgoiRouteBoundary>
            )}
          </Slots.Provider>
        </SsgoiRouteBoundary>
      </Slots.Provider>,
    ),
  );
}

it("keeps top-level navigation state while replacing only the active tab", async () => {
  await renderTabs("/projects", "projects");
  const shell = marker("app");
  const content = marker("content");
  const nav = host.querySelector("nav");
  await edit("nav");
  await edit("tab");
  await renderTabs("/lounge", "lounge");
  expect(marker("app")).toBe(shell);
  expect(routeId(shell)).toBe("/lounge");
  expect(host.querySelector("nav")).toBe(nav);
  expect(nav!.textContent).toBe("Unsaved");
  expect(marker("content")).not.toBe(content);
  expect(marker("content").textContent).toBe("");
  expect(content.textContent).toBe("Unsaved");
});

it("keeps the tab's DOM and draft through modal open, back, and forward", async () => {
  await renderTabs("/projects", "projects");
  const shell = marker("app");
  const background = marker("content");
  await edit("tab");
  for (const modal of ["42", undefined, "42"]) {
    await renderTabs(modal ? "/p/42" : "/projects", "projects", modal);
    expect(marker("app")).toBe(shell);
    expect(marker("content")).toBe(background);
    expect(routeId(shell)).toBe("/projects");
    expect(routeId(background)).toBe("/projects");
    expect(background.textContent).toBe("Unsaved");
    if (modal) expect(routeId(marker("modal"))).toBe("/p/42");
    else expect(marker("modal")).toBeNull();
  }
});

it("replaces the whole tab shell on direct detail entry at the same modal URL", async () => {
  await renderTabs("/p/42", "projects", "42");
  const shell = marker("app");
  await act(() =>
    root.render(
      <Slots.Provider value={{ children: ["(detail)", "p", "42"] }}>
        <SsgoiRouteBoundary data-boundary="app" resolve={resolveShell}>
          Full-page post
        </SsgoiRouteBoundary>
      </Slots.Provider>,
    ),
  );
  expect(marker("app")).not.toBe(shell);
  expect(routeId(marker("app"))).toBe("/p/42");
  expect(host.querySelector("nav")).toBeNull();
  expect(marker("app").textContent).toBe("Full-page post");
});

async function renderProject(projectId: string, child: string, url?: string) {
  pathname = url ?? `/projects/${projectId}${child ? `/${child}` : ""}`;
  await act(() =>
    root.render(
      <Slots.Provider
        value={{
          children: [
            "(detail)",
            "projects",
            projectId,
            ...(child ? [child] : []),
          ],
        }}
      >
        <SsgoiRouteBoundary data-boundary="app" resolve={resolveShell}>
          <header>
            <Draft name="project" />
          </header>
          <Slots.Provider value={{ children: child ? [child] : [] }}>
            <SsgoiRouteBoundary
              data-boundary="content"
              resolve={({ selectedSegments }) => ({
                id: selectedSegmentsToPath(
                  selectedSegments,
                  `/projects/${projectId}`,
                ),
              })}
            >
              <Draft name="content" />
            </SsgoiRouteBoundary>
          </Slots.Provider>
        </SsgoiRouteBoundary>
      </Slots.Provider>,
    ),
  );
}

it("preserves one project's shell across tabs and a sidebar, then replaces it for another project", async () => {
  await renderProject("one", "");
  const shell = marker("app");
  const overview = marker("content");
  await edit("project");
  await renderProject("one", "docs");
  const docs = marker("content");
  expect(marker("app")).toBe(shell);
  expect(routeId(shell)).toBe("/projects/one/docs");
  expect(docs).not.toBe(overview);
  expect(routeId(docs)).toBe("/projects/one/docs");
  await edit("content");
  await renderProject("one", "docs", "/projects/one/docs/doc-42");
  expect(marker("app")).toBe(shell);
  expect(marker("content")).toBe(docs);
  expect(routeId(docs)).toBe("/projects/one/docs");
  expect(docs.textContent).toBe("Unsaved");
  expect(host.querySelector("header")!.textContent).toBe("Unsaved");
  await renderProject("two", "docs");
  expect(marker("app")).not.toBe(shell);
  expect(routeId(marker("content"))).toBe("/projects/two/docs");
  expect(host.querySelector("header")!.textContent).toBe("");
});

it("uses an empty index slot instead of the intercepted browser pathname", async () => {
  pathname = "/p/42";
  await act(() =>
    root.render(
      <Slots.Provider value={{ children: [] }}>
        <SsgoiRouteBoundary data-boundary="landing" resolve={resolveShell}>
          Home
        </SsgoiRouteBoundary>
      </Slots.Provider>,
    ),
  );
  const home = marker("landing");
  expect(routeId(home)).toBe("/");
  pathname = "/about";
  await act(() =>
    root.render(
      <Slots.Provider value={{ children: ["about"] }}>
        <SsgoiRouteBoundary data-boundary="landing" resolve={resolveShell}>
          About
        </SsgoiRouteBoundary>
      </Slots.Provider>,
    ),
  );
  expect(marker("landing")).not.toBe(home);
  expect(home.textContent).toBe("Home");
  expect(routeId(marker("landing"))).toBe("/about");
});

it.each(["(.)blog", "(..)blog", "(...)blog", "(..)(..)blog"])(
  "uses canonical ids for full-page interception %s",
  async (segment) => {
    pathname = "/blog/post-1";
    await act(() =>
      root.render(
        <Slots.Provider value={{ children: [segment, "post-1"] }}>
          <SsgoiRouteBoundary data-boundary="app" resolve={resolveShell}>
            Post
          </SsgoiRouteBoundary>
        </Slots.Provider>,
      ),
    );
    expect(routeId(marker("app"))).toBe("/blog/post-1");
  },
);
