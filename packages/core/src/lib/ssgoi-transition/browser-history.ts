export type HistoryEntry = { key: string; index: number; url: string };

type NavigationPort = {
  currentEntry: HistoryEntry | null;
  entries(): HistoryEntry[];
};

export type BrowserHistory = {
  read(): HistoryEntry | null;
  previous(): HistoryEntry | null;
  dispose(): void;
};

const STATE_KEY = "__ssgoi_entry_v1";
type SharedHistory = BrowserHistory & { users: number };
const histories = new WeakMap<Window, SharedHistory>();
const emptyHistory: BrowserHistory = {
  read: () => null,
  previous: () => null,
  dispose() {},
};

/** Read committed entries, not a pending back() intent or a late popstate flag. */
export function connectBrowserHistory(): BrowserHistory {
  if (typeof window === "undefined") return emptyHistory;
  const navigation = (window as Window & { navigation?: NavigationPort })
    .navigation;
  const target = window;
  let shared = histories.get(target);
  if (!shared) {
    shared = createTrackedHistory(target, navigation);
    histories.set(target, shared);
  }
  shared.users++;
  const source = shared;
  let released = false;
  return {
    read: source.read,
    previous: source.previous,
    dispose() {
      if (released) return;
      released = true;
      if (--source.users === 0) {
        source.dispose();
        histories.delete(target);
      }
    },
  };
}

function snapshot(entry: HistoryEntry | null | undefined): HistoryEntry | null {
  return entry &&
    typeof entry.key === "string" &&
    typeof entry.url === "string" &&
    Number.isSafeInteger(entry.index) &&
    entry.index >= 0
    ? { key: entry.key, index: entry.index, url: entry.url }
    : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * History API commits are authoritative, including when a browser exposes a
 * Navigation API whose currentEntry has not caught up. Merely detecting that
 * API is insufficient: a push can otherwise look like replace and lose the
 * selected entry effect. Keep one marker alongside the router's own state.
 */
function createTrackedHistory(
  target: Window,
  navigation?: NavigationPort,
): SharedHistory {
  const history = target.history;
  const push = history.pushState;
  const replace = history.replaceState;
  const prefix = `${Date.now()}-${Math.random().toString(36).slice(2)}-`;
  let serial = 0;
  let active = true;
  let previous: HistoryEntry | null = null;
  let previousForKey: string | null = null;
  const readNative = () => {
    const entry = snapshot(navigation?.currentEntry);
    // An opaque History state cannot carry our marker. Use native identity
    // only if it describes the committed URL, never a stale previous page.
    return entry?.url === target.location.href ? entry : null;
  };
  const read = (): HistoryEntry | null => {
    const state: unknown = history.state;
    const stamp = isRecord(state) ? state[STATE_KEY] : null;
    if (
      !isRecord(stamp) ||
      typeof stamp.key !== "string" ||
      !stamp.key.startsWith(prefix) ||
      !Number.isSafeInteger(stamp.index)
    )
      return readNative();
    return {
      key: stamp.key,
      index: stamp.index as number,
      url: target.location.href,
    };
  };
  const stamp = (data: unknown, entry: { key: string; index: number }) => {
    // Do not turn primitive, array or structured state into a different shape.
    if (data !== null && !isRecord(data)) return data;
    return { ...data, [STATE_KEY]: entry };
  };
  const fresh = (index: number) => ({ key: `${prefix}${++serial}`, index });

  try {
    replace.call(
      history,
      stamp(history.state, fresh(readNative()?.index ?? 0)),
      "",
    );
  } catch {
    // A sandbox may deny history writes. Keep route matching available.
    return { ...emptyHistory, read: readNative, users: 0 };
  }

  const wrappedPush: History["pushState"] = function (
    this: History,
    data,
    unused,
    url,
  ) {
    if (!active) return push.call(this, data, unused, url);
    const from = read();
    const next = fresh((from?.index ?? 0) + 1);
    push.call(this, stamp(data, next), unused, url);
    previous = from;
    previousForKey = read()?.key ?? null;
  };
  const wrappedReplace: History["replaceState"] = function (
    this: History,
    data,
    unused,
    url,
  ) {
    if (!active) return replace.call(this, data, unused, url);
    const current = read();
    replace.call(this, stamp(data, current ?? fresh(0)), unused, url);
  };
  history.pushState = wrappedPush;
  history.replaceState = wrappedReplace;

  return {
    users: 0,
    read,
    previous: () => {
      if (read()?.key === previousForKey) return previous;
      const entry = readNative();
      return entry
        ? snapshot(
            navigation?.entries().find((e) => e.index === entry.index - 1),
          )
        : null;
    },
    dispose() {
      active = false;
      if (history.pushState === wrappedPush) history.pushState = push;
      if (history.replaceState === wrappedReplace)
        history.replaceState = replace;
    },
  };
}
