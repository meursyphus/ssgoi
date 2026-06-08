import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The shared unmount-observer must fire a node's leave callback ONLY on a real
 * unmount — never on a MOVE. A `childList` "removed" record also fires when a
 * node is detached and re-attached within one commit (e.g. Next.js reordering
 * its bfcache `<Activity>` siblings on back/forward navigation). Firing on a
 * move would tear down a kept-alive page's tracking and break later
 * transitions. The package test env is `node`, so we fake the slice the module
 * touches: HTMLElement, a MutationObserver whose records we dispatch by hand,
 * and a minimal document.
 */

class FakeNode {
  childNodes: FakeNode[] = [];
  isConnected = false;
}

let observerCb: ((mutations: unknown[]) => void) | null = null;

class FakeMutationObserver {
  constructor(cb: (mutations: unknown[]) => void) {
    observerCb = cb;
  }
  observe(): void {}
  disconnect(): void {}
  takeRecords(): unknown[] {
    return [];
  }
}

function fireRemoval(node: FakeNode): void {
  observerCb?.([{ removedNodes: [node] }]);
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

beforeEach(() => {
  vi.stubGlobal("HTMLElement", FakeNode);
  vi.stubGlobal("Node", FakeNode);
  vi.stubGlobal("MutationObserver", FakeMutationObserver);
  vi.stubGlobal("document", {
    body: new FakeNode(),
    addEventListener() {},
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("watchUnmount", () => {
  it("fires the leave callback on a real unmount (node stays detached)", async () => {
    const { watchUnmount } = await import("./unmount-observer");
    const node = new FakeNode();
    node.isConnected = false;
    const cb = vi.fn();
    watchUnmount(node as unknown as HTMLElement, cb);

    fireRemoval(node);
    await flushMicrotasks();

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("does NOT fire on a MOVE (node reattached -> isConnected), and keeps watching", async () => {
    const { watchUnmount } = await import("./unmount-observer");
    const node = new FakeNode();
    node.isConnected = true; // re-inserted within the same commit (a reorder)
    const cb = vi.fn();
    watchUnmount(node as unknown as HTMLElement, cb);

    fireRemoval(node);
    await flushMicrotasks();
    expect(cb).not.toHaveBeenCalled();

    // The watch must survive the move: a later REAL removal still fires.
    node.isConnected = false;
    fireRemoval(node);
    await flushMicrotasks();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("stops firing after the returned disposer runs", async () => {
    const { watchUnmount } = await import("./unmount-observer");
    const node = new FakeNode();
    node.isConnected = false;
    const cb = vi.fn();
    const dispose = watchUnmount(node as unknown as HTMLElement, cb);

    dispose();
    fireRemoval(node);
    await flushMicrotasks();
    expect(cb).not.toHaveBeenCalled();
  });
});
