"use client";

import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IframeLoadingOverlay } from "./iframe-loading-overlay";

type Props = {
  src: string;
  title?: string;
  /** Tailwind classes that size the outer window. Default fills container. */
  widthClassName?: string;
  className?: string;
  /** If false, the iframe is pointer-events:none. */
  interactive?: boolean;
  /**
   * If true (default), iframe renders at NATIVE_WIDTH viewport and is scaled
   * down to fit — good for thumbnail cards.
   * If false, iframe uses container's real pixel size.
   */
  scaleViewport?: boolean;
  /** Optional URL bar label (just text, not navigable). */
  urlLabel?: string;
  /** Overlay rendered inside the rounded screen area. */
  children?: ReactNode;
};

/**
 * 데스크톱(맥OS Safari/Chrome) 윈도우 mockup — 안에 live iframe.
 *
 * ShowcasePhone의 데스크톱 형제. 트래픽라이트 + 가짜 URL 바 + 내부 iframe.
 *
 * 카드용 썸네일이면 scaleViewport=true(기본)으로 native 1280px 뷰포트를 비율
 * 유지하며 축소해서 그려서 데모의 데스크톱 breakpoint가 그대로 발동한다.
 */
const NATIVE_WIDTH = 1280;
const NATIVE_ASPECT = 800 / 1280; // ~16:10

export const DesktopFrame = forwardRef<HTMLIFrameElement, Props>(
  function DesktopFrame(
    {
      src,
      title = "Live demo",
      widthClassName,
      className,
      interactive = true,
      scaleViewport = true,
      urlLabel,
      children,
    },
    ref,
  ) {
    const screenRef = useRef<HTMLDivElement>(null);
    const [screenW, setScreenW] = useState(0);
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
      const update = () => setScreenW(el.clientWidth);
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, [scaleViewport]);

    const scale = scaleViewport && screenW > 0 ? screenW / NATIVE_WIDTH : 1;
    const nativeHeight = NATIVE_WIDTH * NATIVE_ASPECT;

    const iframeStyle: React.CSSProperties = scaleViewport
      ? {
          position: "absolute",
          inset: 0,
          width: `${NATIVE_WIDTH}px`,
          height: `${nativeHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          border: 0,
          background: "black",
          pointerEvents: interactive ? "auto" : "none",
        }
      : {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          background: "black",
          pointerEvents: interactive ? "auto" : "none",
        };

    return (
      <div
        className={
          "relative " +
          (widthClassName ?? "w-full") +
          (className ? " " + className : "")
        }
      >
        <div className="relative rounded-[12px] bg-[#1c1611] p-[1px] shadow-[0_28px_60px_-18px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
          <Chrome urlLabel={urlLabel} />
          <div
            ref={screenRef}
            className="relative overflow-hidden rounded-b-[11px] bg-black"
            style={{ aspectRatio: `${NATIVE_WIDTH} / ${nativeHeight}` }}
          >
            <iframe
              ref={ref}
              src={src}
              title={title}
              tabIndex={-1}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              style={iframeStyle}
            />
            <IframeLoadingOverlay visible={!loaded} variant="dark" />
            {children}
          </div>
        </div>
      </div>
    );
  },
);

function Chrome({ urlLabel }: { urlLabel?: string }) {
  return (
    <div className="flex h-7 w-full items-center gap-2 rounded-t-[11px] bg-gradient-to-b from-[#2a221c] to-[#1c1611] px-2.5">
      <div className="flex items-center gap-[5px]">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      {urlLabel && (
        <div className="ml-2 flex h-4 max-w-[60%] items-center truncate rounded-md bg-black/30 px-2 font-mono text-[9px] leading-none text-neutral-400">
          {urlLabel}
        </div>
      )}
    </div>
  );
}
