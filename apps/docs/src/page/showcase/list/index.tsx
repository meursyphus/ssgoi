"use client";

import Image from "next/image";
import { Link } from "@/lib/link";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type Ref,
} from "react";
import { Play, Search } from "lucide-react";
import { showcaseFrameProtocol } from "@/lib/hooks";
import { ShowcasePhone } from "@/components/showcase-phone";
import { DesktopFrame } from "@/components/desktop-frame";
import { IframeLoadingOverlay } from "@/components/iframe-loading-overlay";
import { setOpener } from "@/components/search/load";
import { useSearchShortcutLabel } from "@/components/search/search-button";
import { isTypingTarget } from "@/components/search/site-search";
import { showcaseToDoc } from "@/lib/search/aliases";
import { prepareDoc, rank, type SearchMatch } from "@/lib/search/match";
import {
  showcases,
  type ShowcaseApp,
  type ShowcaseClip,
  type ShowcasePlatform,
} from "../data";
import { useShowcasePlatform, useSiteSearch } from "@/lib/state";

/** Same documents and matcher as the ⌘K palette, so both agree on demos. */
const PREPARED = showcases.map((s, i) => prepareDoc(showcaseToDoc(s), i));

const SUGGESTIONS = ["sheet", "drill", "zoom", "hero", "유튜브"];

const PLATFORM_LABEL: Record<ShowcasePlatform, string> = {
  mobile: "Mobile",
  web: "Web",
};

export default function ShowcaseCatalog() {
  const { platform, setPlatform } = useShowcasePlatform((s) => ({
    platform: s.value,
    setPlatform: s.actions.set,
  }));
  const openSiteSearch = useSiteSearch((s) => s.actions.open);
  const canRenderLivePreviews = useCanRenderShowcasePreviews();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Both platforms are ranked; the catalog only ever shows the chosen one and
  // offers the other with a count instead of switching under the user.
  const search = useMemo(() => {
    const q = deferredQuery.trim();
    if (!q) return null;
    const current = new Map<string, { match: SearchMatch; rank: number }>();
    const other: ShowcaseApp[] = [];
    for (const match of rank(PREPARED, q)) {
      const showcase = showcases[match.order];
      if (showcase.platforms.includes(platform))
        current.set(showcase.slug, { match, rank: current.size });
      else other.push(showcase);
    }
    return { query: q, current, other };
  }, [deferredQuery, platform]);

  const visible = useMemo(
    () => showcases.filter((s) => s.platforms.includes(platform)),
    [platform],
  );
  const otherPlatform: ShowcasePlatform = platform === "web" ? "mobile" : "web";

  // "/" jumps to the search field (the palette leaves "/" to the catalog here).
  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.defaultPrevented || isTypingTarget(e.target)) return;
      e.preventDefault();
      const input = inputRef.current;
      if (!input) return;
      input.focus({ preventScroll: true });
      input.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const currentCount = search?.current.size ?? 0;
  const otherCount = search?.other.length ?? 0;

  return (
    <section
      id="demos"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-4 pb-24 sm:px-8"
    >
      <div className="flex flex-wrap items-center gap-4 border-b border-white/5 pb-5">
        <PlatformToggle value={platform} onChange={setPlatform} />
        <div className="ml-auto flex w-full items-center gap-2 sm:w-[420px]">
          <SearchInput ref={inputRef} value={query} onChange={setQuery} />
        </div>
      </div>

      {/* Always mounted, so screen readers hear each new count. */}
      <p aria-live="polite" className="sr-only">
        {search && announce(currentCount, otherCount, platform, otherPlatform)}
      </p>

      {search && currentCount > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-neutral-400">
          <span>
            {currentCount} {PLATFORM_LABEL[platform].toLowerCase()}{" "}
            {currentCount === 1 ? "demo" : "demos"}
          </span>
          {otherCount > 0 && (
            <>
              <span aria-hidden className="text-neutral-600">
                ·
              </span>
              <button
                type="button"
                onClick={() => setPlatform(otherPlatform)}
                className="-my-2 py-2 text-neutral-200 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {otherCount} more on {PLATFORM_LABEL[otherPlatform]} →
              </button>
            </>
          )}
        </p>
      )}

      <div
        hidden={Boolean(search) && currentCount === 0}
        className={
          "grid grid-cols-1 gap-x-6 gap-y-12 " + (search ? "mt-6" : "mt-8")
        }
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${
            platform === "web" ? "520px" : "380px"
          }), 1fr))`,
        }}
      >
        {/* Non-matches are hidden, not unmounted, and rank is CSS order: moving
            or remounting a card would reload its live iframe. */}
        {visible.map((s) => {
          const hit = search?.current.get(s.slug);
          return (
            <ShowcaseCard
              key={s.slug}
              showcase={s}
              platform={platform}
              livePreview={canRenderLivePreviews}
              match={hit?.match}
              hidden={Boolean(search) && !hit}
              order={hit?.rank}
            />
          );
        })}
      </div>

      {search && currentCount === 0 && (
        <div className="mx-auto mt-12 max-w-xl text-center">
          {otherCount > 0 ? (
            <>
              <p className="text-balance text-sm leading-6 text-neutral-400">
                No {PLATFORM_LABEL[platform].toLowerCase()} demo matches{" "}
                <span className="text-neutral-100">“{search.query}”</span> —{" "}
                {listNames(search.other)} ({PLATFORM_LABEL[otherPlatform]}){" "}
                {otherCount === 1 ? "does" : "do"}.
              </p>
              <button
                type="button"
                onClick={() => setPlatform(otherPlatform)}
                className="mt-5 inline-flex min-h-10 items-center rounded-full bg-orange-500 px-5 text-sm font-semibold text-[#0e0b08] transition-colors hover:bg-orange-400"
              >
                Show {PLATFORM_LABEL[otherPlatform].toLowerCase()} demos
              </button>
            </>
          ) : (
            <>
              <p className="text-sm leading-6 text-neutral-400">
                No demo matches{" "}
                <span className="text-neutral-100">“{search.query}”</span>. Try
                a transition or an app name:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => setQuery(word)}
                    className="min-h-9 rounded-full border border-white/10 bg-white/[0.02] px-3.5 text-sm text-neutral-300 transition-colors hover:border-white/20 hover:text-neutral-100"
                  >
                    {word}
                  </button>
                ))}
              </div>
              <DocsSearchLink
                query={search.query}
                onOpen={(opener) => {
                  setOpener(opener);
                  openSiteSearch(search.query);
                }}
              />
            </>
          )}
        </div>
      )}
    </section>
  );
}

function announce(
  current: number,
  other: number,
  platform: ShowcasePlatform,
  otherPlatform: ShowcasePlatform,
) {
  const here = PLATFORM_LABEL[platform].toLowerCase();
  const there = PLATFORM_LABEL[otherPlatform];
  const found =
    current === 0
      ? `No ${here} demo matches.`
      : `${current} ${here} ${current === 1 ? "demo matches" : "demos match"}.`;
  if (!other) return found;
  return `${found} ${other} ${current ? "more " : ""}on ${there}.`;
}

function listNames(apps: ShowcaseApp[]) {
  const names = apps.slice(0, 2).map((a) => a.name);
  if (apps.length > 2) return `${names.join(", ")} and ${apps.length - 2} more`;
  return names.join(" and ");
}

function DocsSearchLink({
  query,
  onOpen,
}: {
  query: string;
  onOpen: (opener: HTMLElement) => void;
}) {
  const shortcut = useSearchShortcutLabel();
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      className="mt-6 inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-neutral-300 transition-colors hover:border-white/20 hover:text-neutral-100"
    >
      <Search aria-hidden className="h-4 w-4 shrink-0 text-neutral-500" />
      <span className="truncate">Search the docs for “{query}”</span>
      {shortcut && (
        <kbd className="hidden rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-sans text-[11px] text-neutral-500 sm:inline">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}

function useCanRenderShowcasePreviews() {
  return useSyncExternalStore(
    subscribeToFrameContext,
    getCanRenderShowcasePreviewsSnapshot,
    getServerCanRenderShowcasePreviewsSnapshot,
  );
}

function subscribeToFrameContext() {
  return () => {};
}

function getCanRenderShowcasePreviewsSnapshot() {
  try {
    return window.self === window.top;
  } catch {
    return false;
  }
}

function getServerCanRenderShowcasePreviewsSnapshot() {
  return false;
}

/** Latches `hasBeenVisible` once the element nears the viewport; tracks live `inView`. */
function useInViewport<T extends Element>(rootMargin = "400px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenVisible(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView, hasBeenVisible };
}

function PlatformToggle({
  value,
  onChange,
}: {
  value: ShowcasePlatform;
  onChange: (next: ShowcasePlatform) => void;
}) {
  const opts: { id: ShowcasePlatform; label: string }[] = [
    { id: "mobile", label: "Mobile" },
    { id: "web", label: "Web" },
  ];
  return (
    <div
      role="radiogroup"
      className="inline-flex rounded-full border border-white/10 bg-white/[0.02] p-0.5"
    >
      {opts.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors " +
              (on
                ? "bg-white text-neutral-900"
                : "text-neutral-300 hover:text-neutral-100")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SearchInput({
  ref,
  value,
  onChange,
}: {
  ref: Ref<HTMLInputElement>;
  value: string;
  onChange: (next: string) => void;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "Escape") {
      if (!value) return;
      e.preventDefault();
      onChange("");
    } else if (
      e.key === "Enter" &&
      window.matchMedia("(hover: none)").matches
    ) {
      // Touch: put the keyboard away so the filtered cards are visible.
      e.currentTarget.blur();
    }
  };

  return (
    <label className="flex w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-base shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-colors focus-within:border-orange-400/60 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(251,146,60,0.12)] hover:border-white/25">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-5 w-5 shrink-0 text-neutral-300"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M20 20l-3-3" />
      </svg>
      <input
        ref={ref}
        type="search"
        enterKeyHint="search"
        aria-label="Search demos by app or transition"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search — try “sheet” or “유튜브”"
        className="peer min-w-0 flex-1 bg-transparent text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="-my-2 -mr-2 shrink-0 rounded-full px-2.5 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-100"
        >
          Clear
        </button>
      ) : (
        <kbd
          aria-hidden
          className="hidden h-6 min-w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] font-sans text-xs text-neutral-500 peer-focus:!hidden sm:inline-flex"
        >
          /
        </kbd>
      )}
    </label>
  );
}

function defaultPreviewClip(showcase: ShowcaseApp): ShowcaseClip | undefined {
  return (
    (showcase.previewTransition &&
      showcase.clips.find(
        (c) => c.transition === showcase.previewTransition,
      )) ||
    showcase.clips[0]
  );
}

function ShowcaseCard({
  showcase,
  platform,
  livePreview,
  match,
  hidden,
  order,
}: {
  showcase: ShowcaseApp;
  platform: ShowcasePlatform;
  livePreview: boolean;
  /** Set while a query matches this demo. */
  match?: SearchMatch;
  hidden: boolean;
  order?: number;
}) {
  const matchedIndex = match && match.clip >= 0 ? match.clip : -1;
  const matchedClip =
    matchedIndex >= 0 ? showcase.clips[matchedIndex] : undefined;
  const wantedClip = matchedClip ?? defaultPreviewClip(showcase);

  // The preview follows the matched clip, but only once typing settles.
  const [previewClip, setPreviewClip] = useState(wantedClip);
  useEffect(() => {
    if (wantedClip === previewClip) return;
    const id = window.setTimeout(() => setPreviewClip(wantedClip), 400);
    return () => window.clearTimeout(id);
  }, [wantedClip, previewClip]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const {
    ref: frameRef,
    inView,
    hasBeenVisible,
  } = useInViewport<HTMLDivElement>();
  const showLive = livePreview && hasBeenVisible;

  // The iframe src is fixed when it first goes live; clip changes navigate
  // inside it, because a new src would reload the whole demo.
  const [src, setSrc] = useState<string | null>(null);
  const firstSrc = previewClip?.exitPath ?? showcase.demoOrigin;
  if (showLive && src === null) setSrc(firstSrc);
  const liveSrc = src ?? firstSrc;

  const playingClip = useRef<ShowcaseClip | undefined>(undefined);
  useEffect(() => {
    if (!showLive || !inView || !previewClip) return;
    const post = (path: string) =>
      iframeRef.current?.contentWindow?.postMessage(
        { type: showcaseFrameProtocol.messages.navigate, path },
        "*",
      );
    let onEnter = false;
    let soon: number | undefined;
    if (playingClip.current && playingClip.current !== previewClip) {
      // Switched to the clip a search matched: reset to its start now and
      // play it shortly, instead of waiting out the regular interval.
      post(previewClip.exitPath);
      soon = window.setTimeout(() => {
        onEnter = true;
        post(previewClip.enterPath);
      }, 1200);
    }
    playingClip.current = previewClip;
    const id = window.setInterval(() => {
      onEnter = !onEnter;
      post(onEnter ? previewClip.enterPath : previewClip.exitPath);
    }, 5000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(soon);
    };
  }, [showLive, inView, previewClip]);

  return (
    <Link
      href={
        matchedIndex >= 0
          ? `/showcase/${showcase.slug}#clip-${matchedIndex}`
          : `/showcase/${showcase.slug}`
      }
      hidden={hidden}
      style={order === undefined ? undefined : { order }}
      className="group flex flex-col gap-3"
    >
      <div
        ref={frameRef}
        className={
          "relative flex justify-center rounded-3xl border border-white/5 bg-neutral-900/70 transition-all group-hover:border-white/15 " +
          (platform === "web" ? "px-4 py-5 sm:px-6 sm:py-7" : "px-6 py-8")
        }
      >
        {showLive ? (
          platform === "web" ? (
            <DesktopFrame
              ref={iframeRef}
              src={liveSrc}
              title={`${showcase.name} preview`}
              widthClassName="w-full"
              interactive={false}
              urlLabel={`ssgoi.dev${liveSrc === "/" ? "" : liveSrc}`}
            />
          ) : (
            <ShowcasePhone
              ref={iframeRef}
              src={liveSrc}
              title={`${showcase.name} preview`}
              widthClassName="w-[78%] max-w-[380px]"
              interactive={false}
            />
          )
        ) : (
          <ShowcasePreviewLoadingFrame platform={platform} />
        )}
        {showcase.badge && (
          <span className="absolute left-4 top-4 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-white/80 backdrop-blur">
            {showcase.badge}
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        {showcase.logo ? (
          <Image
            src={showcase.logo}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-xl"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 text-sm font-semibold text-neutral-900">
            {showcase.name[0]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-neutral-100 group-hover:text-white">
            {showcase.name}
          </h3>
          <p className="truncate text-xs text-neutral-400">
            {showcase.tagline}
          </p>
          {matchedClip && (
            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-orange-200">
              <Play aria-hidden className="h-2.5 w-2.5 shrink-0 fill-current" />
              <span className="truncate">
                {matchedClip.title}
                <span className="text-neutral-500">
                  {" "}
                  · {matchedClip.transition}
                </span>
              </span>
            </p>
          )}
          <div className="mt-1 flex flex-wrap gap-1">
            {showcase.transitions.map((t) => (
              <span
                key={t}
                className={
                  "rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider " +
                  (t === matchedClip?.transition
                    ? "bg-orange-400/10 text-orange-200"
                    : "bg-white/[0.04] text-neutral-400")
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ShowcasePreviewLoadingFrame({
  platform,
}: {
  platform: ShowcasePlatform;
}) {
  if (platform === "web") {
    return (
      <div className="w-full overflow-hidden rounded-[12px] bg-[#1c1611] p-[1px] shadow-[0_28px_60px_-18px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
        <div className="flex h-7 w-full items-center gap-[5px] rounded-t-[11px] bg-gradient-to-b from-[#2a221c] to-[#1c1611] px-2.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="relative aspect-[1280/800] overflow-hidden rounded-b-[11px] bg-neutral-950">
          <IframeLoadingOverlay visible variant="dark" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[78%] max-w-[380px]">
      <div className="relative aspect-[9/19] rounded-[32px] bg-gradient-to-b from-[#1c1611] to-[#0f0b08] p-[6px] shadow-[0_22px_50px_-14px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        <div className="relative h-full overflow-hidden rounded-[26px] bg-white">
          <IframeLoadingOverlay visible variant="light" />
        </div>
      </div>
    </div>
  );
}
