"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  CornerDownLeft,
  FileText,
  Hash,
  Layers,
  Monitor,
  Newspaper,
  Play,
  Search,
  Smartphone,
  X,
} from "lucide-react";
import { useSiteSearch } from "@/lib/state";
import { releasePreviews } from "@/page/showcase/preview/scheduler";
import { loadSearchIndex, peekSearchIndex } from "@/lib/search/client-index";
import {
  holdAnchor,
  holdAnchorAfterNavigation,
} from "@/lib/search/hold-anchor";
import {
  groupMatches,
  matchHref,
  rank,
  type PreparedDoc,
  type SearchMatch,
  type SearchResultGroup,
} from "@/lib/search/match";
import type { SearchDoc } from "@/lib/search/types";
import { getOpener } from "./load";
import { useSearchShortcutLabel } from "./search-button";

export function preloadSearchIndex() {
  loadSearchIndex().catch(() => {});
}

/** Shown before anything is typed: the pages people come for first. */
const START_HERE = [
  "/docs/install",
  "/docs/transitions",
  "/docs/route-rules",
  "/docs/transitions/drill",
  "/docs/transitions/sheet",
  "/docs/frameworks/react#nextjs",
  "/showcase/youtube-mobile",
  "/showcase/air-bnb",
  "/showcase/kakao-talk",
];

const SUGGESTIONS = [
  "sheet",
  "hero",
  "route rules",
  "Next.js",
  "scroll",
  "youtube",
];

function startHere(docs: readonly PreparedDoc[]): SearchResultGroup[] {
  const byHref = new Map(docs.map((p) => [p.doc.href, p]));
  const items: SearchMatch[] = [];
  for (const href of START_HERE) {
    const p = byHref.get(href);
    if (p) items.push({ doc: p.doc, score: 0, clip: -1, order: p.order });
  }
  return items.length ? [{ group: "docs", label: "Start here", items }] : [];
}

type IndexState = { docs: PreparedDoc[] | null; failed: boolean };

function useSearchIndex() {
  const [state, setState] = useState<IndexState>(() => ({
    docs: peekSearchIndex(),
    failed: false,
  }));
  const [attempt, setAttempt] = useState(0);
  const loaded = state.docs !== null;

  useEffect(() => {
    if (loaded) return;
    let live = true;
    loadSearchIndex().then(
      (docs) => live && setState({ docs, failed: false }),
      () => live && setState({ docs: null, failed: true }),
    );
    return () => {
      live = false;
    };
  }, [loaded, attempt]);

  const retry = () => {
    setState({ docs: null, failed: false });
    setAttempt((n) => n + 1);
  };
  return { ...state, retry };
}

export function SearchDialog() {
  const { open, initialQuery, actions } = useSiteSearch((s) => ({
    open: s.open,
    initialQuery: s.initialQuery,
    actions: s.actions,
  }));

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) actions.close();
      }}
    >
      {open && (
        <SearchPanel initialQuery={initialQuery} onClose={actions.close} />
      )}
    </Dialog.Root>
  );
}

function SearchPanel({
  initialQuery,
  onClose,
}: {
  initialQuery: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigating = useRef(false);
  // Radix returns focus only to a Dialog.Trigger; the palette has several
  // openers (nav buttons, hotkeys, the catalog), so remember the one used.
  const [returnFocus] = useState(getOpener);
  const keyboardMove = useRef(false);
  const modLabel = useSearchShortcutLabel()?.startsWith("⌘") ? "⌘" : "Ctrl";

  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const trimmed = deferredQuery.trim();
  const { docs, failed, retry } = useSearchIndex();

  const groups = useMemo(() => {
    if (!docs) return [];
    return trimmed ? groupMatches(rank(docs, trimmed)) : startHere(docs);
  }, [docs, trimmed]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const offsets = useMemo(
    () =>
      groups.map((_, gi) =>
        groups.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0),
      ),
    [groups],
  );

  // New results: the first row is active again and the list starts at the top.
  const [active, setActive] = useState(0);
  const [shownFor, setShownFor] = useState(flat);
  if (shownFor !== flat) {
    setShownFor(flat);
    setActive(0);
  }
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [flat]);
  useEffect(() => {
    if (!keyboardMove.current) return;
    keyboardMove.current = false;
    document
      .getElementById(`${baseId}-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, baseId]);

  const go = (m: SearchMatch, newTab: boolean) => {
    const href = matchHref(m);
    if (newTab) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    navigating.current = true;
    onClose();
    const url = new URL(href, window.location.href);
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      // Same page: scroll by hand once the scroll lock is gone. A hash-only
      // router.push after an earlier #hash navigation doubles the hash
      // (/a#x#y) in Next 16.2; Next's patched pushState keeps it in sync.
      if (url.hash !== window.location.hash)
        window.history.pushState(
          null,
          "",
          `${url.pathname}${url.search}${url.hash}`,
        );
      if (url.hash) holdAnchor(decodeURIComponent(url.hash.slice(1)));
      else requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      return;
    }
    // Live previews (landing, showcase pages) return first, or their history
    // entries would sit under the next page and eat the user's Backs.
    void releasePreviews().then(() => {
      router.push(href);
      // Next scrolls to the #hash once; keep it there while the page settles.
      holdAnchorAfterNavigation(href);
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Enter and arrows belong to the IME while Hangul is being composed.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!flat.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      keyboardMove.current = true;
      setActive((i) => (i + step + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      const m = flat[active];
      if (!m) return;
      e.preventDefault();
      go(m, e.metaKey || e.ctrlKey);
    }
  };

  const count = flat.length;
  const status = !docs
    ? ""
    : trimmed
      ? `${count} ${count === 1 ? "result" : "results"}`
      : "";

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="search-overlay fixed inset-0 z-[90] hidden bg-black/60 backdrop-blur-sm sm:block" />
      <Dialog.Content
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          // Navigating away: don't pull focus (and the page) back to the opener.
          if (!navigating.current && returnFocus?.isConnected)
            returnFocus.focus({ preventScroll: true });
        }}
        onEscapeKeyDown={(e) => {
          if (e.isComposing) {
            e.preventDefault();
            return;
          }
          // First Esc clears, second closes.
          if (query) {
            e.preventDefault();
            setQuery("");
          }
        }}
        className="search-panel fixed inset-0 z-[91] flex h-dvh flex-col bg-canvas text-ink outline-none sm:inset-x-0 sm:bottom-auto sm:top-[12vh] sm:mx-auto sm:h-auto sm:max-h-[70vh] sm:w-[640px] sm:max-w-[calc(100vw-2rem)] sm:overflow-hidden sm:rounded-2xl sm:border sm:border-line-strong sm:bg-panel sm:shadow-[0_32px_90px_-24px_rgba(0,0,0,0.9)]"
      >
        <Dialog.Title className="sr-only">Search SSGOI</Dialog.Title>
        <Dialog.Description className="sr-only">
          Search the docs, transitions, frameworks, demos and blog.
        </Dialog.Description>

        <div className="flex shrink-0 items-center gap-2 border-b border-line pl-4 pr-2 pt-[env(safe-area-inset-top)] sm:pr-3">
          <Search aria-hidden className="h-5 w-5 shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={count > 0}
            aria-controls={count ? listId : undefined}
            aria-activedescendant={count ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label="Search SSGOI"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search docs, transitions, demos…"
            type="text"
            inputMode="search"
            enterKeyHint="go"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-ink sm:h-8 sm:w-8"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          )}
          <Dialog.Close className="flex h-11 shrink-0 items-center rounded-lg px-2.5 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink sm:hidden">
            Cancel
          </Dialog.Close>
          <Dialog.Close
            aria-label="Close search"
            className="hidden h-6 shrink-0 items-center rounded-md border border-line-strong px-1.5 font-mono text-[11px] text-ink-faint transition-colors hover:text-ink sm:inline-flex"
          >
            esc
          </Dialog.Close>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-1"
        >
          {failed ? (
            <Message>
              Couldn&apos;t load the search index.{" "}
              <button
                type="button"
                onClick={retry}
                className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink-dim"
              >
                Try again
              </button>
            </Message>
          ) : !docs ? (
            <Skeleton />
          ) : count === 0 ? (
            <NoResults query={trimmed} onPick={setQuery} />
          ) : (
            <div id={listId} role="listbox" aria-label="Search results">
              {groups.map((g, gi) => (
                <div
                  key={g.label}
                  role="group"
                  aria-labelledby={`${baseId}-group-${gi}`}
                  className="pt-2"
                >
                  <div
                    id={`${baseId}-group-${gi}`}
                    className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint"
                  >
                    {g.label}
                  </div>
                  {g.items.map((m, i) => {
                    const index = offsets[gi] + i;
                    return (
                      <ResultRow
                        key={m.doc.href}
                        id={optionId(index)}
                        match={m}
                        active={index === active}
                        onHover={() => {
                          if (index !== active) setActive(index);
                        }}
                        onGo={(newTab) => go(m, newTab)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          <div aria-live="polite" className="sr-only">
            {status}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-4 border-t border-line px-4 py-2.5 text-[11px] text-ink-faint sm:flex">
          <Hint keys={["↑", "↓"]}>move</Hint>
          <Hint keys={["↵"]}>open</Hint>
          <Hint keys={[`${modLabel} ↵`]}>new tab</Hint>
          <span className="ml-auto">
            <Hint keys={["esc"]}>{query ? "clear" : "close"}</Hint>
          </span>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function Hint({ keys, children }: { keys: string[]; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {keys.map((k) => (
        <kbd
          key={k}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line-strong bg-raised px-1 font-sans text-[10px] text-ink-dim"
        >
          {k}
        </kbd>
      ))}
      {children}
    </span>
  );
}

function Message({ children }: { children: ReactNode }) {
  return (
    <p className="px-4 py-12 text-center text-sm text-ink-dim">{children}</p>
  );
}

function Skeleton() {
  return (
    <div aria-hidden className="pt-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex min-h-14 items-center gap-3 px-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-raised" />
          <div className="flex-1">
            <div
              className="h-3 animate-pulse rounded bg-raised"
              style={{ width: `${60 - i * 7}%` }}
            />
            <div className="mt-2 h-2.5 w-2/5 animate-pulse rounded bg-raised/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NoResults({
  query,
  onPick,
}: {
  query: string;
  onPick: (q: string) => void;
}) {
  return (
    <div className="px-4 py-12 text-center">
      <p className="text-sm text-ink-soft">
        Nothing matches <span className="text-ink">“{query}”</span>
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-ink-faint">
        Try a transition, a framework or an app name.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="min-h-9 rounded-full border border-white/10 bg-white/[0.03] px-3.5 text-[13px] text-ink-soft transition-colors hover:border-white/20 hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function RowIcon({ doc }: { doc: SearchDoc }) {
  if (doc.kind === "demo" && doc.icon) {
    return (
      <img
        src={doc.icon}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-lg"
      />
    );
  }
  const Icon =
    doc.kind === "section"
      ? Hash
      : doc.group === "blog"
        ? Newspaper
        : doc.group === "transitions"
          ? Layers
          : doc.group === "frameworks"
            ? Boxes
            : FileText;
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-ink-dim">
      <Icon aria-hidden className="h-4 w-4" />
    </span>
  );
}

function subtitle(m: SearchMatch): ReactNode {
  const { doc } = m;
  const clip = m.clip >= 0 ? doc.clips?.[m.clip] : undefined;
  if (clip) {
    return (
      <>
        <Play
          aria-hidden
          className="h-2.5 w-2.5 shrink-0 fill-brand text-brand"
        />
        <span className="truncate">
          <span className="text-ink-dim">{clip.title}</span> · {clip.transition}
        </span>
      </>
    );
  }
  if (doc.kind === "section")
    return <span className="truncate">{doc.parent}</span>;
  const line =
    doc.kind === "demo"
      ? [doc.parent, doc.text].filter(Boolean).join(" · ")
      : (doc.text ?? doc.parent);
  return <span className="truncate">{line}</span>;
}

function ResultRow({
  id,
  match,
  active,
  onHover,
  onGo,
}: {
  id: string;
  match: SearchMatch;
  active: boolean;
  onHover: () => void;
  onGo: (newTab: boolean) => void;
}) {
  const { doc } = match;
  const Platform =
    doc.kind === "demo"
      ? doc.platform === "web"
        ? Monitor
        : Smartphone
      : undefined;
  return (
    <a
      id={id}
      role="option"
      aria-selected={active}
      href={matchHref(match)}
      tabIndex={-1}
      data-active={active || undefined}
      onPointerMove={onHover}
      onClick={(e) => {
        // Let the browser handle new-tab and new-window clicks.
        if (e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onGo(e.metaKey || e.ctrlKey);
      }}
      className="group flex min-h-14 items-center gap-3 rounded-xl px-3 py-2 outline-none data-[active]:bg-white/[0.07] sm:min-h-12"
    >
      <RowIcon doc={doc} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-ink sm:text-sm">
          {doc.title}
        </span>
        <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-ink-faint">
          {subtitle(match)}
        </span>
      </span>
      {Platform && (
        <Platform aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
      )}
      <CornerDownLeft
        aria-hidden
        className="hidden h-4 w-4 shrink-0 text-ink-faint sm:group-data-[active]:block"
      />
    </a>
  );
}
