"use client";

import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IframeLoadingOverlay } from "./iframe-loading-overlay";
import {
  PhoneHomeIndicator,
  phoneSafeAreaFrameProps,
} from "./phone-home-indicator";

type Props = {
  src: string;
  title?: string;
  /** Tailwind classes that size the outer phone. Default is showcase-card size. */
  widthClassName?: string;
  className?: string;
  /** If false, the iframe is pointer-events:none (used in cards / locked auto-mode). */
  interactive?: boolean;
  /**
   * If true (default), iframe renders at NATIVE_WIDTH viewport and is `transform: scale`-d
   * down to fit the screen area — good for tiny card thumbnails.
   * If false, iframe uses the container's real pixel size as its viewport — set
   * the outer phone width to something close to a real device (e.g. 400px).
   */
  scaleViewport?: boolean;
  /** Overlay rendered above the iframe but inside the rounded screen area. */
  children?: ReactNode;
};

/**
 * Mobbin-style miniature phone mockup with a live iframe inside.
 *
 * The iframe is rendered at a real mobile viewport (NATIVE_WIDTH px), then
 * transformed down with `scale` to fit the visible screen area. This keeps the
 * demo's responsive layout intact — small text doesn't get squashed, breakpoints
 * trigger the mobile branch, etc.
 *
 * The iframe fills the screen below the status bar exactly, and a home
 * indicator is drawn over its bottom edge. The iframe declares that zone
 * (`phoneSafeAreaFrameProps`), so the demo's bottom bars inset themselves
 * with `--safe-bottom` as they would on a real iPhone.
 */
const NATIVE_WIDTH = 440;
const NATIVE_ASPECT = 19 / 9; // matches the outer phone aspect
/** MiniStatusBar height, in the mockup's own (unscaled) px. */
const STATUS_BAR_HEIGHT = 22;

export const ShowcasePhone = forwardRef<HTMLIFrameElement, Props>(
  function ShowcasePhone(
    {
      src,
      title = "Live demo",
      widthClassName,
      className,
      interactive = true,
      scaleViewport = true,
      children,
    },
    ref,
  ) {
    const screenRef = useRef<HTMLDivElement>(null);
    const [screen, setScreen] = useState({ width: 0, height: 0 });
    const [loaded, setLoaded] = useState(false);

    // Reset the loading overlay only when `src` ACTUALLY changes — not on a bare
    // effect re-run. React <Activity> re-runs passive effects on hidden→visible,
    // so a `useEffect(..., [src])` would fire on every reveal and re-show the
    // overlay over an already-loaded iframe that never re-fires `onLoad`.
    const [trackedSrc, setTrackedSrc] = useState(src);
    if (src !== trackedSrc) {
      setTrackedSrc(src);
      setLoaded(false);
    }

    useLayoutEffect(() => {
      if (!scaleViewport) return;
      const el = screenRef.current;
      if (!el) return;
      const update = (width: number, height: number) =>
        setScreen((prev) =>
          prev.width === width && prev.height === height
            ? prev
            : { width, height },
        );
      // Synchronous first measure so the first paint is already scaled; the
      // observer then refines it to fractional (untransformed) layout size.
      update(el.clientWidth, el.clientHeight);
      const ro = new ResizeObserver(([entry]) =>
        update(entry.contentRect.width, entry.contentRect.height),
      );
      ro.observe(el);
      return () => ro.disconnect();
    }, [scaleViewport]);

    const measured = scaleViewport && screen.width > 0;
    const scale = measured ? screen.width / NATIVE_WIDTH : 1;
    // The viewport height that, scaled, ends exactly at the screen's bottom
    // edge: a taller one ran past the rounded corners and hid the demo's
    // bottom bar under them.
    const nativeHeight = measured
      ? (screen.height - STATUS_BAR_HEIGHT) / scale
      : NATIVE_WIDTH * NATIVE_ASPECT;

    const iframeStyle: React.CSSProperties = scaleViewport
      ? {
          position: "absolute",
          top: STATUS_BAR_HEIGHT,
          left: 0,
          width: `${NATIVE_WIDTH}px`,
          height: `${nativeHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          border: 0,
          background: "white",
          pointerEvents: interactive ? "auto" : "none",
        }
      : {
          position: "absolute",
          top: STATUS_BAR_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: `calc(100% - ${STATUS_BAR_HEIGHT}px)`,
          border: 0,
          background: "white",
          pointerEvents: interactive ? "auto" : "none",
        };

    return (
      <div
        className={
          "relative " +
          (widthClassName ?? "w-[180px]") +
          (className ? " " + className : "")
        }
      >
        <div className="relative aspect-[9/19] min-h-0 rounded-[32px] bg-gradient-to-b from-[#1c1611] to-[#0f0b08] p-[6px] shadow-[0_22px_50px_-14px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
          <div className="pointer-events-none absolute inset-[6px] rounded-[26px] ring-1 ring-white/5" />
          {/* overflow-clip, not hidden: a hidden box is still a scroll
              container, and scrolling the iframe into view used to scroll it,
              sliding the status bar up. */}
          <div
            ref={screenRef}
            className="relative h-full w-full overflow-clip rounded-[26px] bg-white"
          >
            <MiniStatusBar />
            <iframe
              ref={ref}
              src={src}
              title={title}
              tabIndex={-1}
              // Not lazy: the preview scheduler creates this iframe only when
              // it is near the viewport, and WebKit keeps a lazy iframe's
              // pushState out of the session history (its back would then
              // move the embedding page).
              onLoad={() => setLoaded(true)}
              style={iframeStyle}
              {...phoneSafeAreaFrameProps}
            />
            <IframeLoadingOverlay
              visible={!loaded}
              variant="light"
              style={{ top: STATUS_BAR_HEIGHT }}
            />
            <PhoneHomeIndicator scale={scale} />
            {children}
          </div>
        </div>
      </div>
    );
  },
);

function MiniStatusBar() {
  return (
    <div className="relative z-10 flex h-[22px] w-full items-center justify-between bg-white px-3 pt-1 text-[9px] font-semibold leading-none text-neutral-900">
      <span className="tabular-nums">9:41</span>
      <div className="pointer-events-none absolute left-1/2 top-[3px] h-3 w-10 -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-center gap-[3px]">
        <Signal />
        <Wifi />
        <Battery />
      </div>
    </div>
  );
}

function Signal() {
  return (
    <svg viewBox="0 0 18 12" className="h-[8px] w-[12px]" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
      <rect x="5" y="6" width="3" height="6" rx="0.5" fill="currentColor" />
      <rect x="10" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function Wifi() {
  return (
    <svg viewBox="0 0 16 12" className="h-[9px] w-[11px]" aria-hidden>
      <path
        d="M8 11.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm0-4.2a3.4 3.4 0 0 1 2.4 1l-1 1a2 2 0 0 0-2.8 0l-1-1A3.4 3.4 0 0 1 8 7Zm0-3a6.3 6.3 0 0 1 4.5 1.9l-1 1A4.9 4.9 0 0 0 8 5.4a4.9 4.9 0 0 0-3.5 1.5l-1-1A6.3 6.3 0 0 1 8 4Zm0-3a9.2 9.2 0 0 1 6.6 2.8l-1 1A7.8 7.8 0 0 0 8 2.4 7.8 7.8 0 0 0 2.4 4.8l-1-1A9.2 9.2 0 0 1 8 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Battery() {
  return (
    <svg viewBox="0 0 26 12" className="h-[10px] w-[20px]" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect
        x="23.5"
        y="3.5"
        width="1.6"
        height="5"
        rx="0.4"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <rect x="2" y="2" width="18" height="8" rx="1.4" fill="currentColor" />
    </svg>
  );
}
