"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/link";
import { ShowcasePhone } from "@/components/showcase-phone";
import { DesktopFrame } from "@/components/desktop-frame";
import { IframeLoadingOverlay } from "@/components/iframe-loading-overlay";
import type { CardPlan, CatalogApp } from "@/lib/search/catalog";
import {
  effectProgram,
  focusProgram,
  stepCaption,
  tourProgram,
  type PreviewProgram,
} from "../preview/program";
import {
  PLAY_MIN_RATIO,
  useDocumentVisible,
  useLoadSlot,
  useOnScreen,
  usePreviewTour,
  type PreviewPlayback,
} from "../preview/use-preview-tour";
import type { ShowcasePlatform } from "../data";

/** Typing settles before a card switches what it loops. */
const PLAN_SETTLE_MS = 400;

function planKey(plan: CardPlan) {
  if (plan.mode === "effect") return `effect:${plan.effect}`;
  if (plan.mode === "focus") return `focus:${plan.screen}`;
  return "tour";
}

function programFor(app: CatalogApp, key: string): PreviewProgram {
  const { showcase } = app;
  if (key.startsWith("effect:"))
    return effectProgram(showcase, key.slice(7)) ?? tourProgram(showcase);
  if (key.startsWith("focus:"))
    return focusProgram(showcase, key.slice(6)) ?? tourProgram(showcase);
  return tourProgram(showcase);
}

export function ShowcaseCard({
  app,
  platform,
  livePreview,
  plan,
  clip,
  hidden,
  order,
}: {
  app: CatalogApp;
  platform: ShowcasePlatform;
  livePreview: boolean;
  /** What the preview loops: the tour, one effect, or one screen. */
  plan: CardPlan;
  /** Detail page clip to link to, or -1. */
  clip: number;
  hidden: boolean;
  order?: number;
}) {
  const { showcase } = app;
  const wantedKey = planKey(plan);
  const [key, setKey] = useState(wantedKey);
  useEffect(() => {
    if (wantedKey === key) return;
    const id = window.setTimeout(() => setKey(wantedKey), PLAN_SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [wantedKey, key]);
  const program = useMemo(() => programFor(app, key), [app, key]);

  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const near = useOnScreen(box, "400px");
  const onScreen = useOnScreen(box, "0px", PLAY_MIN_RATIO);
  const docVisible = useDocumentVisible();
  const wantLive = livePreview && near && !hidden;

  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
  const playback = usePreviewTour(frame, program, {
    name: showcase.slug,
    active: onScreen && !hidden && docVisible,
    // While the query settles, start nothing the new plan would undo.
    hold: wantedKey !== key,
    mask: true,
  });
  // The iframe is created only when no other preview is "out" (see
  // `acquireLoad`), so its back can always find the entry it came from.
  const granted = useLoadSlot(wantLive, playback.ready);
  const showLive = granted;

  // The iframe src is fixed when it first goes live; everything after
  // navigates inside it, because a new src would reload the whole demo.
  const [src, setSrc] = useState<string | null>(null);
  if (showLive && src === null) setSrc(program.start);
  const liveSrc = src ?? program.start;

  const step = playback.step;
  const effect = program.mode === "effect" ? (program.effect ?? null) : null;
  const highlight = effect ?? step?.transition ?? null;
  const path = playback.path ?? liveSrc;

  return (
    <Link
      href={
        clip >= 0
          ? `/showcase/${showcase.slug}#clip-${clip}`
          : `/showcase/${showcase.slug}`
      }
      hidden={hidden}
      style={order === undefined ? undefined : { order }}
      className="group flex flex-col gap-3"
    >
      <div
        ref={setBox}
        className={
          "relative flex justify-center rounded-3xl border border-white/5 bg-neutral-900/70 transition-all group-hover:border-white/15 " +
          (platform === "web" ? "px-4 py-5 sm:px-6 sm:py-7" : "px-6 py-8")
        }
      >
        {showLive ? (
          platform === "web" ? (
            <DesktopFrame
              ref={setFrame}
              src={liveSrc}
              title={`${showcase.name} preview`}
              widthClassName="w-full"
              interactive={false}
              urlLabel={`ssgoi.dev${path === "/" ? "" : path}`}
            >
              <RepositionMask playback={playback} />
            </DesktopFrame>
          ) : (
            <ShowcasePhone
              ref={setFrame}
              src={liveSrc}
              title={`${showcase.name} preview`}
              widthClassName="w-[78%] max-w-[380px]"
              interactive={false}
            >
              <RepositionMask playback={playback} />
            </ShowcasePhone>
          )
        ) : (
          <ShowcasePreviewLoadingFrame platform={platform} />
        )}
        {showcase.badge && (
          <span className="absolute left-4 top-4 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-white/80 backdrop-blur">
            {showcase.badge}
          </span>
        )}
        {program.mode !== "tour" && (
          <span className="absolute right-4 top-4 rounded-md bg-orange-500/15 px-2 py-1 text-[11px] font-medium text-orange-200 backdrop-blur">
            {program.mode === "effect"
              ? `Only ${program.effect}`
              : `Only ${program.steps[0]?.toLabel ?? "this screen"}`}
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
          <p
            className="mt-1 flex h-4 min-w-0 items-center gap-1.5 text-xs text-neutral-500"
            data-preview-caption=""
          >
            {step && (
              <>
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400"
                />
                {step.transition && (
                  <>
                    <span className="shrink-0 font-semibold text-orange-200">
                      {step.transition}
                    </span>
                    <span aria-hidden className="text-neutral-600">
                      ·
                    </span>
                  </>
                )}
                <span className="truncate">{stepCaption(step)}</span>
              </>
            )}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {showcase.transitions.map((t) => (
              <span
                key={t}
                className={
                  "rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors " +
                  (t === highlight
                    ? "bg-orange-400/15 text-orange-200"
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

/**
 * Covers the screen while the preview silently jumps to where its next move
 * starts (effect loops, switching loops): a quick fade to the page's own
 * background, so the jump dissolves instead of cutting.
 */
function RepositionMask({ playback }: { playback: PreviewPlayback }) {
  return (
    <div
      aria-hidden
      data-preview-mask={playback.masked ? "on" : "off"}
      className="pointer-events-none absolute inset-0 transition-opacity duration-150 ease-out"
      style={{
        opacity: playback.masked ? 1 : 0,
        backgroundColor: playback.maskColor,
      }}
    />
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
      <div className="relative aspect-[9/19] min-h-0 rounded-[32px] bg-gradient-to-b from-[#1c1611] to-[#0f0b08] p-[6px] shadow-[0_22px_50px_-14px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
        <div className="relative h-full overflow-hidden rounded-[26px] bg-white">
          <IframeLoadingOverlay visible variant="light" />
        </div>
      </div>
    </div>
  );
}
