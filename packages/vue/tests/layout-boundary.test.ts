import { afterEach, beforeEach, expect, it } from "vitest";
import {
  createApp,
  defineComponent,
  h,
  nextTick,
  ref,
  type App,
  type VNode,
} from "vue";
import { createMemoryHistory, createRouter, RouterView } from "vue-router";
import type { SsgoiConfig, SsgoiLayoutScope } from "@ssgoi/core/types";
import Ssgoi from "../src/lib/ssgoi.vue";
import { SsgoiLayoutBoundary } from "../src/lib/layout-boundary";
import type { SsgoiFramework } from "../src/lib/types";
import { SsgoiRouteBoundary } from "../src/lib/legacy/vue-router";

const config: SsgoiConfig = { transitions: [] };
const path = ref("/a");
const renderedPath = ref<string | undefined>();
const framework: SsgoiFramework = {
  getRoute: () => ({ pathname: path.value, renderedPath: renderedPath.value }),
};

let host: HTMLDivElement;
let app: App | undefined;
beforeEach(() => {
  // jsdom implements no scrolling; the scroll policy still runs on arrival.
  Element.prototype.scrollTo ??= () => {};
  window.scrollTo ??= () => {};
  path.value = "/a";
  renderedPath.value = undefined;
  host = document.createElement("div");
  document.body.append(host);
});
afterEach(() => {
  app?.unmount();
  app = undefined;
  host.remove();
});

const boundary = (depth = 0) =>
  host.querySelector<HTMLElement>(`[data-boundary="${depth}"]`)!;

/** Mounts `depths` nested prop-less boundaries under one `<Ssgoi>`. */
function mount(
  layouts?: SsgoiLayoutScope[],
  depths = 1,
  as?: keyof HTMLElementTagNameMap,
) {
  const nest = (depth: number): VNode =>
    h(
      SsgoiLayoutBoundary,
      { "data-boundary": String(depth), ...(as ? { as } : {}) },
      () => (depth + 1 < depths ? nest(depth + 1) : h("p", "page")),
    );
  app = createApp(() =>
    h(Ssgoi, { config: { ...config, layouts }, framework }, () => nest(0)),
  );
  app.mount(host);
}

async function navigate(to: string) {
  path.value = to;
  await nextTick();
}

it("keys every boundary by the route path without config.layouts", async () => {
  mount(undefined, 1, "section");
  const first = boundary();
  expect(first.tagName).toBe("SECTION");
  expect(first.dataset.ssgoiTransition).toBe("/a");

  await navigate("/b");
  expect(boundary().dataset.ssgoiTransition).toBe("/b");
  expect(boundary()).not.toBe(first);
  expect(first.isConnected).toBe(false);
});

it("keeps the DOM within the first matching sibling scope", async () => {
  const tabs = ["/home", "/search"];
  path.value = "/home";
  mount([{ paths: tabs }, { paths: "/**", except: tabs }]);
  const first = boundary();

  await navigate("/search");
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/search");

  await navigate("/post/1");
  expect(boundary()).not.toBe(first);
  const detail = boundary();
  await navigate("/post/2");
  expect(boundary()).toBe(detail);
});

it("reads nested scopes by boundary depth", async () => {
  const tabs = ["/home", "/search"];
  path.value = "/products/a";
  mount(
    [
      { paths: tabs },
      { paths: "/**", except: tabs, layouts: [{ paths: "/products/**" }] },
    ],
    3,
  );
  const [outer, section, page] = [boundary(0), boundary(1), boundary(2)];

  // Inside the nested scope only the page past the declared depth remounts.
  await navigate("/products/b");
  expect(boundary(0)).toBe(outer);
  expect(boundary(1)).toBe(section);
  expect(boundary(2)).not.toBe(page);
  expect(boundary(2).dataset.ssgoiTransition).toBe("/products/b");

  // Leaving it keeps the outer scope and remounts the section.
  await navigate("/post/1");
  expect(boundary(0)).toBe(outer);
  expect(boundary(1)).not.toBe(section);

  await navigate("/home");
  expect(boundary(0)).not.toBe(outer);
});

it("splits scope instances by captured segments, not by ** tails", async () => {
  path.value = "/projects/1/files";
  mount([{ paths: "/projects/:id/**" }]);
  const first = boundary();

  await navigate("/projects/1/members");
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/projects/1/members");

  await navigate("/projects/2/files");
  expect(boundary()).not.toBe(first);
});

it("prefers the framework's renderedPath over pathname", async () => {
  renderedPath.value = "/feed";
  path.value = "/photo/1";
  mount();
  expect(boundary().dataset.ssgoiTransition).toBe("/feed");
});

it("throws when <Ssgoi> has no framework", () => {
  const errors: unknown[] = [];
  app = createApp(() =>
    h(Ssgoi, { config }, () => h(SsgoiLayoutBoundary, null, () => "page")),
  );
  app.config.errorHandler = (error) => {
    errors.push(error);
  };
  app.config.warnHandler = () => {};
  app.mount(host);
  expect(errors).toHaveLength(1);
  expect((errors[0] as Error).message).toMatch(
    /^SSGOI: SsgoiLayoutBoundary requires a framework/,
  );
});

async function mountRouter(props: Record<string, unknown> = {}) {
  const Page = defineComponent({ render: () => h("p", "page") });
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/a", component: Page },
      { path: "/b", component: Page },
    ],
  });
  await router.push("/a");
  app = createApp(() =>
    h(Ssgoi, { config }, () =>
      h(SsgoiRouteBoundary, { "data-boundary": "0", ...props }, () =>
        h(RouterView),
      ),
    ),
  );
  app.use(router);
  app.mount(host);
  await router.isReady();
  await nextTick();
  return router;
}

it("keeps the deprecated vue-router boundary working without a framework", async () => {
  const router = await mountRouter();
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("/a");

  await router.push("/b");
  await nextTick();
  expect(boundary().dataset.ssgoiTransition).toBe("/b");
  expect(boundary()).not.toBe(first);
});

it("keeps the deprecated resolve and routeKey props", async () => {
  const router = await mountRouter({
    resolve: ({ pathname }: { pathname: string }) => ({
      id: `page:${pathname}`,
    }),
    routeKey: "shell",
  });
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("page:/a");

  await router.push("/b");
  await nextTick();
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("page:/b");
});
