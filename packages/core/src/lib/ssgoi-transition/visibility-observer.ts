/**
 * Visibility observer — detects React `<Activity>` / Next `cacheComponents`
 * hide/show of a registered page element.
 *
 * React's `<Activity mode="hidden">` does NOT unmount or wrap its children. It
 * hides the subtree by writing, on the inline style of the TOP-MOST host node
 * of that subtree:
 *
 *     topHostNode.style.setProperty("display", "none", "important")
 *
 * and reveals it again with `topHostNode.style.display = ""` (or the declared
 * `style.display` prop value — always WITHOUT priority). There is no wrapper
 * element and no `data-*` marker. (Verified against react-dom 19.2
 * `ReactFiberConfigDOM.js` `hideInstance` / `unhideInstance`.) So the ONLY
 * observable signal is a mutation of the element's `style` attribute whose
 * `display` flips to / from `none`.
 *
 * Two design points make the detection robust:
 *
 *  1. The hide edge is gated on the EXACT React signature `display:none
 *     !important`. A plain `display:none` (an app's own CSS-in-JS / conditional
 *     style on a page boundary) is deliberately ignored — otherwise every
 *     unrelated `display:none` would be hijacked into a bogus hidden-mode OUT.
 *     React's reveal is plain `display:<value>`, which we tell apart from our
 *     own reveal because we always write the override WITH `!important`.
 *
 *  2. Decisions key on the `display` VALUE only, and on a per-element
 *     "accounted" value. A style mutation whose display equals the accounted
 *     value (our own reveal/re-hide write, or a transition's opacity/transform
 *     write that left display untouched) is ignored. Only React's writes — which
 *     we did not account — surface as `onHide` / `onShow` edges. A `reactHidden`
 *     latch ensures `onShow` only fires for a node we previously saw React hide.
 */

export type VisibilityHandlers = {
  /** React drove this element to `display:none !important`. */
  onHide: () => void;
  /** React drove this element from its hidden state back to a visible display. */
  onShow: () => void;
};

export type VisibilityHandle = {
  /** Whether the element is currently React-hidden (`display:none !important`). */
  readonly isHidden: boolean;
  /**
   * Write `display` as a LIBRARY-owned change that the observer will ignore.
   * Pass `null` to remove the inline `display` property entirely. `important`
   * defaults to false; pass `true` when overriding React's
   * `display:none !important`.
   */
  setDisplay(value: string | null, important?: boolean): void;
  /**
   * Re-read the element's current `display` and accept it as the accounted
   * value WITHOUT firing `onHide` / `onShow`. Call this after writing the
   * element's style through a channel other than `setDisplay` (e.g. restoring
   * `cssText`) so the resulting style mutation is not mistaken for a React edge.
   */
  sync(): void;
  /** Stop reacting to this element's style mutations. */
  stop(): void;
};

type Rec = {
  accounted: string;
  reactHidden: boolean;
  onHide: () => void;
  onShow: () => void;
};

// One shared observer watches every registered element's `style` attribute.
// MutationObserver holds its observed nodes weakly, so a page element that React
// removes is still GC-able even though there is no per-target `unobserve` —
// `stop()` simply drops dispatch by deleting the record.
const records = new WeakMap<HTMLElement, Rec>();
let sharedObserver: MutationObserver | null = null;

const HIDDEN = "none !important";

function readDisplay(el: HTMLElement): string {
  const value = el.style.getPropertyValue("display");
  const priority = el.style.getPropertyPriority("display");
  return priority ? `${value} !important` : value;
}

function ensureObserver(): MutationObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      const el = m.target as HTMLElement;
      const rec = records.get(el);
      if (!rec) continue;
      const current = readDisplay(el);
      // Equal to what we last accounted -> our own write, a redundant write, or
      // a non-display style change. Not a React intent edge.
      if (current === rec.accounted) continue;
      rec.accounted = current;
      if (current === HIDDEN) {
        // React Activity hide signature. (A plain `display:none` is some other
        // code's doing — ignore it so we never hijack it into a hidden-mode OUT.)
        rec.reactHidden = true;
        rec.onHide();
      } else if (current !== "none") {
        // Became visible. Only meaningful if we previously saw React hide it.
        if (rec.reactHidden) {
          rec.reactHidden = false;
          rec.onShow();
        }
      }
    }
  });
  return sharedObserver;
}

/**
 * Start watching `element` for React-driven `display:none !important` hide/show
 * edges. Returns a handle that also lets the caller perform library-owned
 * `display` writes the observer will not mistake for React edges.
 */
export function watchVisibility(
  element: HTMLElement,
  handlers: VisibilityHandlers,
): VisibilityHandle {
  const accounted = readDisplay(element);
  const rec: Rec = {
    accounted,
    reactHidden: accounted === HIDDEN,
    onHide: handlers.onHide,
    onShow: handlers.onShow,
  };
  records.set(element, rec);

  ensureObserver().observe(element, {
    attributes: true,
    attributeFilter: ["style"],
  });

  return {
    get isHidden() {
      return readDisplay(element) === HIDDEN;
    },
    setDisplay(value, important = false) {
      if (value === null) {
        element.style.removeProperty("display");
      } else {
        element.style.setProperty(
          "display",
          value,
          important ? "important" : "",
        );
      }
      // Pre-account our own write so the style mutation it produces is ignored.
      rec.accounted = readDisplay(element);
    },
    sync() {
      rec.accounted = readDisplay(element);
      rec.reactHidden = rec.accounted === HIDDEN;
    },
    stop() {
      records.delete(element);
    },
  };
}
