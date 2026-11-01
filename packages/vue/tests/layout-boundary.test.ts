import { afterEach, beforeEach, expect, it } from "vitest";
import { createApp, defineComponent, h, nextTick, ref, type App } from "vue";
import { createMemoryHistory, createRouter, RouterView } from "vue-router";
import type { SsgoiConfig } from "@ssgoi/core/types";
import Ssgoi from "../src/lib/ssgoi.vue";
import {
  SsgoiLayoutBoundary,
  type SsgoiLayoutBoundaryProps,
} from "../src/lib/layout-boundary";
import type { SsgoiFramework } from "../src/lib/types";
import { SsgoiRouteBoundary } from "../src/lib/legacy/vue-router";

const config: SsgoiConfig = { transitions: [] };
const path = ref("/a");
// `project` is an extra route field that must reach `resolve` untouched.
const framework: SsgoiFramework = {
  getRoute: () => ({
    pathname: path.value,
    project: path.value.match(/^\/projects\/([^/]+)/)?.[1],
  }),
};

let host: HTMLDivElement;
let app: App | undefined;
beforeEach(() => {
  // jsdom implements no scrolling; the scroll policy still runs on arrival.
  Element.prototype.scrollTo ??= () => {};
  window.scrollTo ??= () => {};
  path.value = "/a";
  host = document.createElement("div");
  document.body.append(host);
});
afterEach(() => {
  app?.unmount();
  app = undefined;
  host.remove();
});

const boundary = () => host.querySelector<HTMLElement>("[data-boundary]")!;

function mount(props: Record<string, unknown>, withFramework = true) {
  app = createApp(() =>
    h(Ssgoi, { config, framework: withFramework ? framework : undefined }, () =>
      h(SsgoiLayoutBoundary, { "data-boundary": "", ...props }, () =>
        h("p", "page"),
      ),
    ),
  );
  app.mount(host);
}

it("re-keys the boundary when the framework pathname changes", async () => {
  mount({ as: "section" });
  const first = boundary();
  expect(first.tagName).toBe("SECTION");
  expect(first.dataset.ssgoiTransition).toBe("/a");

  path.value = "/b";
  await nextTick();
  expect(boundary().dataset.ssgoiTransition).toBe("/b");
  expect(boundary()).not.toBe(first);
  expect(first.isConnected).toBe(false);
});

it("treats a string boundary as a fixed key while the id follows the path", async () => {
  mount({ boundary: "shell" });
  const first = boundary();

  path.value = "/b";
  await nextTick();
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/b");
});

it("uses an object boundary's id, keyed by that id by default", async () => {
  mount({ boundary: { id: "/feed" } });
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("/feed");

  path.value = "/b";
  await nextTick();
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/feed");
});

it("passes the framework route, extra fields included, to a boundary function", async () => {
  path.value = "/projects/1/files";
  const input: SsgoiLayoutBoundaryProps["boundary"] = (route) => ({
    id: route.pathname,
    key: typeof route.project === "string" ? route.project : route.pathname,
  });
  mount({ boundary: input });
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("/projects/1/files");

  path.value = "/projects/1/settings";
  await nextTick();
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/projects/1/settings");

  path.value = "/projects/2/files";
  await nextTick();
  expect(boundary()).not.toBe(first);
});

it("treats a string returned by a boundary function as the key", async () => {
  path.value = "/projects/1/files";
  mount({ boundary: () => "workspace" });
  const first = boundary();
  expect(first.dataset.ssgoiTransition).toBe("/projects/1/files");

  path.value = "/settings";
  await nextTick();
  expect(boundary()).toBe(first);
  expect(first.dataset.ssgoiTransition).toBe("/settings");
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
      h(SsgoiRouteBoundary, { "data-boundary": "", ...props }, () =>
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
