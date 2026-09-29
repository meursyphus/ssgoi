"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Search } from "lucide-react";
import { setOpener } from "@/components/search/load";
import { useSearchShortcutLabel } from "@/components/search/search-button";
import { isTypingTarget } from "@/components/search/site-search";
import {
  CATALOG,
  catalogApp,
  onPlatform,
  parseEffectQuery,
  searchCatalog,
  suggest,
  type CatalogFilter,
  type CatalogHit,
  type Suggestion,
} from "@/lib/search/catalog";
import { useShowcasePlatform, useSiteSearch } from "@/lib/state";
import { validateTour } from "../preview/program";
import type { ShowcaseApp, ShowcasePlatform } from "../data";
import { ShowcaseCard } from "./card";
import { SearchField, type SearchPill } from "./search-field";

const SUGGESTIONS = ["sheet", "drill", "zoom", "hero", "youtube"];

const PLATFORM_LABEL: Record<ShowcasePlatform, string> = {
  mobile: "Mobile",
  web: "Web",
};

/** Words of `text` that are effect terms ("zoom", "bottom", "sheet"…). */
function effectWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w && parseEffectQuery(w).rest.tokens.length === 0);
}

export default function ShowcaseCatalog() {
  const { platform, setPlatform } = useShowcasePlatform((s) => ({
    platform: s.value,
    setPlatform: s.actions.set,
  }));
  const openSiteSearch = useSiteSearch((s) => s.actions.open);
  const canRenderLivePreviews = useCanRenderShowcasePreviews();
  const [text, setText] = useState("");
  const [effect, setEffect] = useState<string | undefined>();
  const [app, setApp] = useState<string | undefined>();
  const [screen, setScreen] = useState<string | undefined>();
  const deferredText = useDeferredValue(text);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useDevTourCheck();

  const filter: CatalogFilter = useMemo(
    () => ({ text: deferredText, effect, app, screen }),
    [deferredText, effect, app, screen],
  );
  const search = useMemo(() => searchCatalog(filter), [filter]);
  const groups = useMemo(
    () => suggest({ text, effect, app, screen }, platform),
    [text, effect, app, screen, platform],
  );

  const otherPlatform: ShowcasePlatform = platform === "web" ? "mobile" : "web";
  const { current, other } = useMemo(() => {
    const current: CatalogHit[] = [];
    const other: ShowcaseApp[] = [];
    for (const hit of search.hits.values()) {
      if (onPlatform(hit.app, platform)) current.push(hit);
      else other.push(hit.app.showcase);
    }
    return { current, other };
  }, [search, platform]);

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

  const onPick = (s: Suggestion) => {
    const words = effectWords(text);
    if (s.kind === "effect") {
      // Drop the word being completed and terms for this same effect.
      const all = text.trim().split(/\s+/).filter(Boolean);
      const last = all[all.length - 1];
      const keep = all.filter(
        (w, i) =>
          !(i === all.length - 1 && !words.includes(last)) &&
          !parseEffectQuery(w).groups.some((g) => g.includes(s.effect)),
      );
      setEffect(s.effect);
      setText(keep.join(" "));
      return;
    }
    const slug = s.app.showcase.slug;
    setApp(slug);
    setScreen(s.kind === "screen" ? s.screen.key : undefined);
    setText(words.join(" "));
    if (!onPlatform(s.app, platform)) setPlatform(s.app.showcase.platforms[0]);
  };

  const pills: SearchPill[] = [];
  if (effect)
    pills.push({
      id: "effect",
      name: `${effect} effect`,
      label: (
        <>
          <span className="text-orange-300/70">effect </span>
          {effect}
        </>
      ),
    });
  const pinned = app ? catalogApp(app) : undefined;
  if (pinned) {
    const screenLabel = screen
      ? pinned.screens.find((s) => s.key === screen)?.label
      : undefined;
    pills.push({
      id: "app",
      name: pinned.showcase.name,
      label: screenLabel
        ? `${pinned.showcase.name} › ${screenLabel}`
        : pinned.showcase.name,
    });
  }

  const removePill = (id: SearchPill["id"]) => {
    if (id === "effect") setEffect(undefined);
    else {
      setApp(undefined);
      setScreen(undefined);
    }
  };

  const active = search.active;
  const currentCount = current.length;
  const otherCount = other.length;
  const queryLabel = [effect, pinned?.showcase.name, deferredText.trim()]
    .filter(Boolean)
    .join(" ");
  const hitBySlug = new Map(current.map((h) => [h.app.showcase.slug, h]));

  return (
    <section
      id="demos"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-4 pb-24 sm:px-8"
    >
      <div className="flex flex-wrap items-center gap-4 border-b border-white/5 pb-5">
        <PlatformToggle value={platform} onChange={setPlatform} />
        <div className="ml-auto flex w-full items-center gap-2 sm:w-[460px]">
          <SearchField
            inputRef={inputRef}
            value={text}
            onChange={setText}
            pills={pills}
            onRemovePill={removePill}
            groups={groups}
            onPick={onPick}
            platform={platform}
          />
        </div>
      </div>

      {/* Always mounted, so screen readers hear each new count. */}
      <p aria-live="polite" className="sr-only">
        {active &&
          announce(
            currentCount,
            otherCount,
            platform,
            otherPlatform,
            search.effect,
          )}
      </p>

      {active && currentCount > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-neutral-400">
          <span>
            {currentCount} {PLATFORM_LABEL[platform].toLowerCase()}{" "}
            {currentCount === 1 ? "demo" : "demos"}
            {search.effect && (
              <>
                {" "}
                with <span className="text-orange-200">{search.effect}</span>
                <span className="text-neutral-500">
                  {" "}
                  — previews loop only its moves
                </span>
              </>
            )}
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
        hidden={active && currentCount === 0}
        className={
          "grid grid-cols-1 gap-x-6 gap-y-12 " + (active ? "mt-6" : "mt-8")
        }
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${
            platform === "web" ? "520px" : "380px"
          }), 1fr))`,
        }}
      >
        {/* Every card stays mounted (hidden, not unmounted), and rank is CSS
            order: remounting would reload its live iframe and strand the
            history entries its preview pushed. */}
        {CATALOG.map((a) => {
          const here = onPlatform(a, platform);
          const hit = hitBySlug.get(a.showcase.slug);
          return (
            <ShowcaseCard
              key={a.showcase.slug}
              app={a}
              platform={here ? platform : a.showcase.platforms[0]}
              livePreview={canRenderLivePreviews}
              plan={hit?.plan ?? { mode: "tour" }}
              clip={hit?.clip ?? -1}
              hidden={!here || (active && !hit)}
              order={active ? hit?.rank : undefined}
            />
          );
        })}
      </div>

      {active && currentCount === 0 && (
        <div className="mx-auto mt-12 max-w-xl text-center">
          {otherCount > 0 ? (
            <>
              <p className="text-balance text-sm leading-6 text-neutral-400">
                No {PLATFORM_LABEL[platform].toLowerCase()} demo matches{" "}
                <span className="text-neutral-100">“{queryLabel}”</span> —{" "}
                {listNames(other)} ({PLATFORM_LABEL[otherPlatform]}){" "}
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
                <span className="text-neutral-100">“{queryLabel}”</span>. Try a
                transition or an app name:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => {
                      setEffect(undefined);
                      setApp(undefined);
                      setScreen(undefined);
                      setText(word);
                    }}
                    className="min-h-9 rounded-full border border-white/10 bg-white/[0.02] px-3.5 text-sm text-neutral-300 transition-colors hover:border-white/20 hover:text-neutral-100"
                  >
                    {word}
                  </button>
                ))}
              </div>
              <DocsSearchLink
                query={queryLabel}
                onOpen={(opener) => {
                  setOpener(opener);
                  openSiteSearch(queryLabel);
                }}
              />
            </>
          )}
        </div>
      )}
    </section>
  );
}

/** Development: report authored tours that break the loop invariants. */
function useDevTourCheck() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    for (const { showcase } of CATALOG)
      for (const issue of validateTour(showcase)) {
        const where = issue.step < 0 ? "tour" : `tour[${issue.step}]`;
        const line = `[showcase] ${showcase.slug} ${where}: ${issue.message}`;
        if (issue.level === "error") console.error(line);
        else console.warn(line);
      }
  }, []);
}

function announce(
  current: number,
  other: number,
  platform: ShowcasePlatform,
  otherPlatform: ShowcasePlatform,
  effect: string | null,
) {
  const here = PLATFORM_LABEL[platform].toLowerCase();
  const there = PLATFORM_LABEL[otherPlatform];
  const found =
    current === 0
      ? `No ${here} demo matches.`
      : `${current} ${here} ${current === 1 ? "demo matches" : "demos match"}${
          effect ? `, looping ${effect}` : ""
        }.`;
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
