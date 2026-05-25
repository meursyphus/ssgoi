"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { showcaseFrameProtocol } from "@/lib/hooks";
import { ShowcasePhone } from "@/components/showcase-phone";
import { DesktopFrame } from "@/components/desktop-frame";
import { IframeLoadingOverlay } from "@/components/iframe-loading-overlay";
import { SiteLogo } from "@/components/site-logo";
import {
  showcases,
  allTransitions,
  type ShowcaseApp,
  type ShowcasePlatform,
} from "../data";
import { useShowcasePlatform } from "@/lib/state";

export default function ShowcaseListPage() {
  const { platform, setPlatform } = useShowcasePlatform((s) => ({
    platform: s.value,
    setPlatform: s.actions.set,
  }));
  const canRenderLivePreviews = useCanRenderShowcasePreviews();
  const [query, setQuery] = useState("");
  const [activeTransitions, setActiveTransitions] = useState<Set<string>>(
    () => new Set(),
  );

  const transitions = useMemo(() => allTransitions(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return showcases.filter((s) => {
      if (!s.platforms.includes(platform)) return false;
      if (activeTransitions.size > 0) {
        let hit = false;
        for (const t of s.transitions) {
          if (activeTransitions.has(t)) {
            hit = true;
            break;
          }
        }
        if (!hit) return false;
      }
      if (!q) return true;
      const haystack = [
        s.name,
        s.tagline,
        s.category,
        ...s.transitions,
        ...s.clips.map((c) => c.title),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [platform, query, activeTransitions]);

  const toggleTransition = (t: string) => {
    setActiveTransitions((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 sm:px-8">
      <SiteLogo />

      <header className="mt-10 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-100 sm:text-4xl">
          Find your transition.
        </h1>
        <p className="max-w-xl text-sm text-neutral-400">
          Pick one from the demos and drop it into your app.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-b border-white/5 pb-5">
        <PlatformToggle value={platform} onChange={setPlatform} />
        <div className="ml-auto flex w-full items-center gap-2 sm:w-[420px]">
          <SearchInput value={query} onChange={setQuery} />
        </div>
      </div>

      {transitions.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-neutral-500">
            Transition
          </span>
          {transitions.map((t) => {
            const on = activeTransitions.has(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTransition(t)}
                className={
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                  (on
                    ? "border-orange-400/60 bg-orange-400/10 text-orange-200"
                    : "border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/20 hover:text-neutral-100")
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      )}

      <div
        className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${
            platform === "web" ? "520px" : "380px"
          }), 1fr))`,
        }}
      >
        {filtered.map((s) => (
          <ShowcaseCard
            key={s.slug}
            showcase={s}
            platform={platform}
            livePreview={canRenderLivePreviews}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-neutral-500">
          No examples match.{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveTransitions(new Set());
            }}
            className="text-neutral-300 underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        </p>
      )}
    </main>
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

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="flex w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-base shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-colors focus-within:border-orange-400/60 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(251,146,60,0.12)] hover:border-white/25">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-5 w-5 text-neutral-300"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M20 20l-3-3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search apps or transitions…"
        className="flex-1 bg-transparent text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-full px-2 py-0.5 text-xs font-medium text-neutral-400 hover:bg-white/10 hover:text-neutral-100"
        >
          Clear
        </button>
      )}
    </label>
  );
}

function ShowcaseCard({
  showcase,
  platform,
  livePreview,
}: {
  showcase: ShowcaseApp;
  platform: ShowcasePlatform;
  livePreview: boolean;
}) {
  const previewClip =
    (showcase.previewTransition &&
      showcase.clips.find(
        (c) => c.transition === showcase.previewTransition,
      )) ||
    showcase.clips[0];
  const previewPath = previewClip?.exitPath ?? showcase.demoOrigin;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!livePreview || !previewClip) return;
    let onEnter = false;
    const id = window.setInterval(() => {
      const next = onEnter ? previewClip.exitPath : previewClip.enterPath;
      onEnter = !onEnter;
      iframeRef.current?.contentWindow?.postMessage(
        { type: showcaseFrameProtocol.messages.navigate, path: next },
        "*",
      );
    }, 5000);
    return () => window.clearInterval(id);
  }, [livePreview, previewClip]);

  return (
    <Link
      href={`/showcase/${showcase.slug}`}
      className="group flex flex-col gap-3"
    >
      <div
        className={
          "relative flex justify-center rounded-3xl border border-white/5 bg-neutral-900/70 transition-all group-hover:border-white/15 " +
          (platform === "web" ? "px-4 py-5 sm:px-6 sm:py-7" : "px-6 py-8")
        }
      >
        {livePreview ? (
          platform === "web" ? (
            <DesktopFrame
              ref={iframeRef}
              src={previewPath}
              title={`${showcase.name} preview`}
              widthClassName="w-full"
              interactive={false}
              urlLabel={`ssgoi.dev${previewPath === "/" ? "" : previewPath}`}
            />
          ) : (
            <ShowcasePhone
              ref={iframeRef}
              src={previewPath}
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
          <div className="mt-1 flex flex-wrap gap-1">
            {showcase.transitions.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400"
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
