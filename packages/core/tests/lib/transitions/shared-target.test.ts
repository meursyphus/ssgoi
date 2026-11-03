import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isRendered,
  waitForSharedTarget,
} from "../../../src/lib/transitions/shared-target";

type Callback = (records: MutationRecord[], observer: MutationObserver) => void;

/** Records observe/disconnect and lets a test fire a mutation batch. */
class FakeMutationObserver {
  static instances: FakeMutationObserver[] = [];
  observed: { target: Node; options: MutationObserverInit }[] = [];
  disconnected = false;
  constructor(private callback: Callback) {
    FakeMutationObserver.instances.push(this);
  }
  observe(target: Node, options: MutationObserverInit) {
    this.observed.push({ target, options });
  }
  disconnect() {
    this.disconnected = true;
  }
  takeRecords(): MutationRecord[] {
    return [];
  }
  fire() {
    this.callback([], this as unknown as MutationObserver);
  }
}

const page = () => ({ style: { opacity: "0.5" } }) as unknown as HTMLElement;

describe("waitForSharedTarget", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeMutationObserver.instances = [];
    vi.stubGlobal("MutationObserver", FakeMutationObserver);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("resolves at once without observing when the target is ready", async () => {
    const el = page();
    await expect(waitForSharedTarget(el, () => true)).resolves.toBe(true);
    expect(FakeMutationObserver.instances).toHaveLength(0);
    expect(el.style.opacity).toBe("0.5");
  });

  it("hides the page, watches it, and resolves when the target appears", async () => {
    const el = page();
    let ready = false;
    const wait = waitForSharedTarget(el, () => ready);
    expect(el.style.opacity).toBe("0");
    const observer = FakeMutationObserver.instances[0]!;
    expect(observer.observed[0]).toMatchObject({
      target: el,
      options: { childList: true, subtree: true, attributes: true },
    });

    observer.fire(); // unrelated mutation: still waiting
    ready = true;
    observer.fire();
    await expect(wait).resolves.toBe(true);
    expect(observer.disconnected).toBe(true);
    expect(el.style.opacity).toBe("0.5");
  });

  it("gives up after the timeout and restores the page", async () => {
    const el = page();
    const wait = waitForSharedTarget(el, () => false, { timeoutMs: 300 });
    vi.advanceTimersByTime(299);
    expect(el.style.opacity).toBe("0");
    vi.advanceTimersByTime(1);
    await expect(wait).resolves.toBe(false);
    expect(el.style.opacity).toBe("0.5");
    expect(FakeMutationObserver.instances[0]!.disconnected).toBe(true);
  });

  it("stops on abort and restores the page", async () => {
    const el = page();
    const controller = new AbortController();
    const wait = waitForSharedTarget(el, () => false, {
      signal: controller.signal,
    });
    controller.abort();
    await expect(wait).resolves.toBe(false);
    expect(el.style.opacity).toBe("0.5");
  });

  it("does not wait on an already aborted signal", async () => {
    const el = page();
    const controller = new AbortController();
    controller.abort();
    await expect(
      waitForSharedTarget(el, () => false, { signal: controller.signal }),
    ).resolves.toBe(false);
    expect(FakeMutationObserver.instances).toHaveLength(0);
  });
});

describe("isRendered", () => {
  it("needs a connected element with a layout box", () => {
    const box = { isConnected: true, getClientRects: () => [{}] };
    const hidden = { isConnected: true, getClientRects: () => [] };
    const detached = { isConnected: false, getClientRects: () => [{}] };
    expect(isRendered(box as unknown as Element)).toBe(true);
    expect(isRendered(hidden as unknown as Element)).toBe(false);
    expect(isRendered(detached as unknown as Element)).toBe(false);
  });

  it("trusts elements that cannot be measured", () => {
    expect(isRendered({} as Element)).toBe(true);
  });
});
