import { afterEach, beforeEach, expect, it } from "vitest";
import { flushSync, mount, unmount } from "svelte";
import BoundaryFixture from "./BoundaryFixture.svelte";
import { page, content, startNavigation } from "./navigation";
import type { SsgoiRouteBoundaryProps } from "../src/lib/sveltekit";

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
function render(props: Partial<SsgoiRouteBoundaryProps> = {}) {
  app = mount(BoundaryFixture, { target: host, props });
  flushSync();
}

it("detaches the outgoing content before Kit updates its live snippet", () => {
  render();
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
  render({
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
  expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe(
    "/projects/42/docs",
  );
  const finishOther = startNavigation("/projects/43");
  expect(boundary()).toBeNull();
  finishOther();
  expect(boundary()).not.toBe(shell);
});

it("ignores search-only navigation by default", () => {
  render();
  const element = boundary();
  startNavigation("/projects/42?q=two")();
  flushSync();
  expect(boundary()).toBe(element);
});

it("can opt into search changes through the URL resolver", () => {
  render({ resolve: ({ url }) => ({ id: url.pathname + url.search }) });
  const element = boundary();
  startNavigation("/projects/42?q=two")();
  expect(boundary()).not.toBe(element);
  expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe(
    "/projects/42?q=two",
  );
});

it("accepts zero as a stable route key", () => {
  render({ routeKey: 0 });
  const element = boundary();
  startNavigation("/other")();
  flushSync();
  expect(boundary()).toBe(element);
  expect(boundary()!.getAttribute("data-ssgoi-transition")).toBe("/other");
});

it("does not remount after an owning layout was destroyed during navigation", async () => {
  render();
  const finish = startNavigation("/other");
  await unmount(app!);
  app = undefined;
  finish();
  flushSync();
  expect(host.children).toHaveLength(0);
});
