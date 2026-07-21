const GUARD_ATTRIBUTE = "data-ssgoi-scroll-guard";
const SAFETY_TIMEOUT_MS = 5000;

type GuardState = {
  guard: HTMLElement | null;
  installed: boolean;
  timer: ReturnType<typeof setTimeout> | null;
};

const states = new WeakMap<Document, GuardState>();

function getState(document: Document): GuardState {
  let state = states.get(document);
  if (!state) {
    state = { guard: null, installed: false, timer: null };
    states.set(document, state);
  }
  return state;
}

function clearSafetyTimer(state: GuardState): void {
  if (state.timer === null) return;
  clearTimeout(state.timer);
  state.timer = null;
}

function isNavigationClick(event: Event, document: Document): boolean {
  const mouseEvent = event as MouseEvent;
  if (
    mouseEvent.button !== 0 ||
    mouseEvent.metaKey ||
    mouseEvent.ctrlKey ||
    mouseEvent.shiftKey ||
    mouseEvent.altKey
  ) {
    return false;
  }

  const target = event.target as {
    closest?: (selector: string) => Element | null;
  };
  const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor || anchor.hasAttribute("download")) return false;
  if (anchor.target && anchor.target !== "_self") return false;

  let destination: URL;
  try {
    destination = new URL(anchor.href, document.baseURI);
  } catch {
    return false;
  }

  if (destination.protocol !== "http:" && destination.protocol !== "https:") {
    return false;
  }

  const current = new URL(document.URL);
  const sameDocumentHash =
    destination.origin === current.origin &&
    destination.pathname === current.pathname &&
    destination.search === current.search &&
    Boolean(destination.hash);
  return !sameDocumentHash;
}

function holdDocumentScrollExtent(document: Document): void {
  const body = document.body;
  const scrollingElement = document.scrollingElement;
  if (!body || !scrollingElement || scrollingElement.scrollTop <= 0) return;

  const state = getState(document);
  const scrollHeight = scrollingElement.scrollHeight;
  if (scrollHeight <= scrollingElement.clientHeight) return;

  let guard = state.guard;
  if (!guard?.isConnected) {
    guard = document.createElement("div");
    guard.setAttribute(GUARD_ATTRIBUTE, "");
    guard.setAttribute("aria-hidden", "true");
    state.guard = guard;
  }

  Object.assign(guard.style, {
    position: "absolute",
    top: `${Math.max(0, scrollHeight - 1)}px`,
    left: "0",
    width: "1px",
    height: "1px",
    pointerEvents: "none",
    visibility: "hidden",
  });

  if (!guard.isConnected) body.appendChild(guard);

  clearSafetyTimer(state);
  state.timer = setTimeout(() => {
    releaseDocumentScrollGuard(document);
  }, SAFETY_TIMEOUT_MS);
}

/**
 * Preserve the current document scrollable extent across a link-driven route
 * commit. The outgoing page can be removed before its MutationObserver runs;
 * without this floor, a body-scrolled document immediately clamps scrollTop
 * against the not-yet-laid-out incoming page.
 */
export function installDocumentScrollGuard(document: Document): void {
  const state = getState(document);
  if (state.installed) return;
  state.installed = true;

  document.addEventListener(
    "click",
    (event) => {
      if (isNavigationClick(event, document)) {
        holdDocumentScrollExtent(document);
      }
    },
    { capture: true },
  );
}

/** Remove the temporary scroll-extent floor after incoming scroll restore. */
export function releaseDocumentScrollGuard(document: Document): void {
  const state = states.get(document);
  if (!state) return;
  clearSafetyTimer(state);
  state.guard?.remove();
  state.guard = null;
}
