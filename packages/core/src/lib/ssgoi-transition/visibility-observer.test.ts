import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { watchVisibility } from "./visibility-observer";

/**
 * The visibility-observer's whole job is to surface ONLY React-driven
 * display:none hide/show edges while swallowing our own display writes (the
 * reveal/re-hide we do to animate the outgoing page) and the opacity/transform
 * writes every transition makes. These tests pin that filter.
 *
 * The package test env is `node` (no DOM), so we fake exactly the slice the
 * module touches: a `style` with display get/set/priority/remove, and a
 * MutationObserver whose records we dispatch by hand. React's writes are modeled
 * the way they are actually observed: a hide is `display:none !important`, a
 * reveal is a plain `display:<value>` (no priority).
 */

let lastObserverCb: MutationCallback | null = null;

class FakeMutationObserver {
  constructor(cb: MutationCallback) {
    lastObserverCb = cb;
  }
  observe(): void {}
  disconnect(): void {}
  takeRecords(): MutationRecord[] {
    return [];
  }
}

type FakeEl = HTMLElement & { __display: string; __priority: string };

function makeEl(initialDisplay = ""): FakeEl {
  const el = {
    __display: initialDisplay,
    __priority: "",
  } as FakeEl;
  (el as { style: unknown }).style = {
    getPropertyValue: (prop: string) =>
      prop === "display" ? el.__display : "",
    getPropertyPriority: (prop: string) =>
      prop === "display" ? el.__priority : "",
    setProperty: (prop: string, value: string, priority?: string) => {
      if (prop !== "display") return;
      el.__display = value;
      el.__priority = priority === "important" ? "important" : "";
    },
    removeProperty: (prop: string) => {
      if (prop !== "display") return;
      el.__display = "";
      el.__priority = "";
    },
  };
  return el;
}

/** Simulate React's hide: display:none !important. */
function reactHide(el: FakeEl): void {
  el.__display = "none";
  el.__priority = "important";
}

/** Simulate React's reveal: a plain `display:<value>` with no priority. */
function reactShow(el: FakeEl, value = "flex"): void {
  el.__display = value;
  el.__priority = "";
}

/** Flush the observer as if the element's `style` attribute mutated. */
function flush(el: FakeEl): void {
  lastObserverCb?.(
    [{ target: el } as unknown as MutationRecord],
    {} as MutationObserver,
  );
}

beforeEach(() => {
  vi.stubGlobal("MutationObserver", FakeMutationObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("watchVisibility", () => {
  it("fires onHide when React sets display:none !important", () => {
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    watchVisibility(el, { onHide, onShow });

    reactHide(el);
    flush(el);

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onShow).not.toHaveBeenCalled();
  });

  it("fires onShow when React reveals a hidden element", () => {
    const el = makeEl("none");
    el.__priority = "important"; // mounted hidden
    const onHide = vi.fn();
    const onShow = vi.fn();
    watchVisibility(el, { onHide, onShow });

    reactShow(el, "flex");
    flush(el);

    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();
  });

  it("ignores our own reveal write (setDisplay), so no feedback loop", () => {
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    const handle = watchVisibility(el, { onHide, onShow });

    // React hides -> onHide (expected)
    reactHide(el);
    flush(el);
    expect(onHide).toHaveBeenCalledTimes(1);

    // We reveal the real node to animate it out. This must NOT read back as a
    // React show.
    handle.setDisplay("flex", true); // display:flex !important
    flush(el);
    expect(onShow).not.toHaveBeenCalled();
  });

  it("ignores our own re-hide write (setDisplay none)", () => {
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    const handle = watchVisibility(el, { onHide, onShow });

    reactHide(el);
    flush(el);
    handle.setDisplay("flex", true); // reveal
    flush(el);
    onHide.mockClear();

    // Settle: we re-hide the reused node ourselves.
    handle.setDisplay("none", true);
    flush(el);
    expect(onHide).not.toHaveBeenCalled();
    expect(onShow).not.toHaveBeenCalled();
  });

  it("still catches a React reveal that interrupts our out-animation", () => {
    // The crux: while we hold the node visible with `!important`, React decides
    // to show it again (user navigated back). React's plain `display:` differs
    // from our `!important` string, so the edge is still observable.
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    const handle = watchVisibility(el, { onHide, onShow });

    reactHide(el);
    flush(el); // onHide
    handle.setDisplay("flex", true); // our reveal: flex !important
    flush(el); // ignored
    onShow.mockClear();
    onHide.mockClear();

    reactShow(el, "flex"); // React reveal: flex (no priority)
    flush(el);
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();
  });

  it("ignores non-display style mutations (opacity/transform writes)", () => {
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    watchVisibility(el, { onHide, onShow });

    // A transition writes opacity/transform — display is unchanged. Flushing a
    // style mutation must not classify it as an edge.
    flush(el);
    expect(onHide).not.toHaveBeenCalled();
    expect(onShow).not.toHaveBeenCalled();
  });

  it("sync() adopts an out-of-band display write without firing", () => {
    // After restoring cssText (a non-setDisplay channel) the caller calls
    // sync() so the resulting mutation is not mistaken for a React edge.
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    const handle = watchVisibility(el, { onHide, onShow });

    // cssText restore lands display:none !important directly on the style.
    el.__display = "none";
    el.__priority = "important";
    handle.sync();
    flush(el);
    expect(onHide).not.toHaveBeenCalled();
  });

  it("tracks a full hide -> reveal -> settle -> hide-again cycle", () => {
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    const handle = watchVisibility(el, { onHide, onShow });

    // 1. React hides (nav away)
    reactHide(el);
    flush(el);
    expect(onHide).toHaveBeenCalledTimes(1);

    // 2. We reveal to animate out
    handle.setDisplay("flex", true);
    flush(el);

    // 3. We settle: re-hide
    handle.setDisplay("none", true);
    flush(el);

    // 4. React reveals (nav back) — must fire onShow
    reactShow(el, "flex");
    flush(el);
    expect(onShow).toHaveBeenCalledTimes(1);

    // 5. React hides again (nav away again) — must fire onHide again
    reactHide(el);
    flush(el);
    expect(onHide).toHaveBeenCalledTimes(2);
  });

  it("ignores a plain display:none (only React's !important signature triggers)", () => {
    // An app's own conditional `display:none` on a page boundary must NOT be
    // hijacked into a hidden-mode OUT.
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    watchVisibility(el, { onHide, onShow });

    el.__display = "none"; // plain, no priority
    el.__priority = "";
    flush(el);
    expect(onHide).not.toHaveBeenCalled();
    expect(onShow).not.toHaveBeenCalled();
  });

  it("does not fire onShow without a prior React hide (reactHidden latch)", () => {
    const el = makeEl("flex");
    const onHide = vi.fn();
    const onShow = vi.fn();
    watchVisibility(el, { onHide, onShow });

    // A visible->visible display change (e.g. flex->block) is not a reveal.
    el.__display = "block";
    el.__priority = "";
    flush(el);
    expect(onShow).not.toHaveBeenCalled();
  });

  it("isHidden reflects the live inline display", () => {
    const el = makeEl("flex");
    const handle = watchVisibility(el, { onHide: vi.fn(), onShow: vi.fn() });
    expect(handle.isHidden).toBe(false);
    reactHide(el);
    expect(handle.isHidden).toBe(true);
  });
});
