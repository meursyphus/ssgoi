import type { TransitionConfig } from "@types";
import { getViewportRect, getOverlayRect } from "@utils";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { SHEET_PROVIDERS } from "./provider";
import { Z_BACKGROUND, Z_FOREGROUND, Z_OVERLAY } from "../stacking";
import type { SheetOptions, SheetType } from "./types";

export type { SheetOptions, SheetType } from "./types";

const DEFAULT_TYPE: SheetType = "static";
const SHEET_WILL_CHANGE = "transform";

/** Prepare → animation hand-off: the optional backdrop-filter overlay layer. */
interface SheetExtras {
  overlay?: HTMLElement;
}

export const sheet = (
  options: SheetOptions = {},
): TransitionConfig<SheetExtras> => {
  const provider = SHEET_PROVIDERS[options.type ?? DEFAULT_TYPE];
  const bg = provider.background;
  const overlayConfig = provider.overlay;
  // Empty willChange == "don't touch the background at all" (zoom-style static).
  const animatesBackground = bg.willChange !== "";

  return {
    prepare: ({ from, to, context, createElement }) => {
      const direction = context.direction === "forward" ? "enter" : "exit";
      const sheet = direction === "enter" ? to : from;
      const background = direction === "enter" ? from : to;

      sheet.then((el) => {
        el.style.willChange = SHEET_WILL_CHANGE;
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        // The sheet is always the foreground layer.
        el.style.zIndex = Z_FOREGROUND;
        if (direction === "enter") {
          // sheet is the incoming `to`, still in normal flow — promote it so
          // its z-index takes effect.
          el.style.position = "relative";
        } else {
          // sheet is the outgoing `from` (already absolute); keep it inert.
          el.style.pointerEvents = "none";
        }
      });

      background.then((el) => {
        if (animatesBackground) {
          el.style.willChange = bg.willChange;
          el.style.backfaceVisibility = "hidden";
          (el.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        }
        // The background sits beneath the sheet. An explicit z-index forms its
        // own stacking context so its descendants stay trapped below.
        el.style.zIndex = Z_BACKGROUND;
        if (direction === "enter") {
          // background is the outgoing `from` (absolute); keep it inert.
          el.style.pointerEvents = "none";
        } else {
          // background is the incoming `to`, in normal flow — promote it so its
          // z-index takes effect.
          el.style.position = "relative";
        }
      });

      // Tones that frost the background (currently `blur`) need a separate
      // backdrop-filter layer between the background and the sheet. Stage it
      // here and hand it to `animation` via extras. It is deliberately NOT
      // clipped or scaled — keeping the blur on its own layer is what decouples
      // it from the background's clip + scale. The dispatcher removes nodes
      // created via `createElement` on settle, so it needs no teardown.
      let overlay: HTMLElement | undefined;
      if (overlayConfig) {
        overlay = createElement("sheet-overlay");
        Object.assign(overlay.style, overlayConfig.initialStyle);
        overlay.style.willChange = overlayConfig.willChange;
        context.positionedParent.appendChild(overlay);
      }

      return { overlay };
    },
    animation: ({ from, to, context, overlay }) => {
      const direction = context.direction === "forward" ? "enter" : "exit";
      const physics =
        direction === "enter" ? provider.enterPhysics : provider.exitPhysics;
      const sheetEl = direction === "enter" ? to : from;
      const backgroundEl = direction === "enter" ? from : to;
      const sheetRect = getViewportRect(
        context,
        direction === "enter" ? "to" : "from",
      );

      // The outgoing (`from`) node is now reused across navigations (it is
      // re-hidden with display:none and shown again next time), so any inline
      // style we leave on it would corrupt the page when it reappears. Reset
      // the `from`-only prepare props that the per-element onComplete below
      // does not already clear (the `to`-side cleanup is the template). For
      // `enter` the `from` is the background; for `exit` it is the sheet.
      const resetFromInteractionProps = () => {
        from.style.pointerEvents = "";
        from.style.zIndex = "";
      };

      // `to` is the surviving page and now also carries stacking props (the
      // foreground sheet on `enter`, the promoted background on `exit`). Clear
      // them too — in unmount mode the context never cleans the persistent `to`.
      const resetToStackProps = () => {
        // Guard: if a follow-up navigation already re-claimed this node (e.g.
        // as the next outgoing `from`, now position:absolute), leave its fresh
        // stacking intact instead of stripping it.
        const toZ = direction === "enter" ? Z_FOREGROUND : Z_BACKGROUND;
        if (to.style.position === "relative") to.style.position = "";
        if (to.style.zIndex === toZ) to.style.zIndex = "";
      };

      // Drop a WAAPI forwards-fill once its run settles, so the inline resets
      // in onComplete (not a lingering final frame) govern the resting visual —
      // mirrors the zoom transition. Without this a reused node (React
      // <Activity>) reappears holding its animated transform/clip.
      const releaseFillOnSettle = (anim: WebAnimation) => {
        const prev = anim.onComplete;
        anim.onComplete = () => {
          prev?.();
          anim.releaseFill();
        };
      };

      // Clip the moving sheet to its visible viewport slice — without this it
      // can paint outside the chrome (top nav / player bar) during translate.
      sheetEl.style.clipPath = `inset(${sheetRect.top}px 0 calc(100% - ${sheetRect.top + sheetRect.height}px) 0)`;

      const sheetStyle =
        direction === "enter"
          ? (_t: number, u: number) => ({
              transform: `translate3d(0, ${u * sheetRect.height}px, 0)`,
            })
          : (t: number) => ({
              transform: `translate3d(0, ${t * sheetRect.height}px, 0)`,
            });

      const sheetAnim = new WebAnimation({
        element: sheetEl,
        integrator: IntegratorProvider.from(physics),
        style: sheetStyle,
        onComplete: () => {
          sheetEl.style.willChange = "auto";
          sheetEl.style.backfaceVisibility = "";
          (sheetEl.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
          sheetEl.style.clipPath = "";
          sheetEl.style.transform = "";
          // The sheet animation always settles, so use it to clear the
          // pointerEvents/zIndex that prepare put on the reused `from` node
          // (the sheet itself on `exit`, the background on `enter`) and the
          // stacking props on the surviving `to` node. The rest of the `from`
          // background props on `enter` are cleared by bgAnim.
          resetFromInteractionProps();
          resetToStackProps();
        },
      });
      releaseFillOnSettle(sheetAnim);

      const anims: WebAnimation[] = [sheetAnim];

      if (animatesBackground) {
        // The clip slice below and the `contain: paint` set in prepare both
        // assume the background's border box equals its full content height —
        // the clip's `100%` is the element box, and the slice is offset by
        // `scroll.y` so it lands at the viewport. But prepareOutgoing made the
        // outgoing page `position: absolute`, under which a page root sized
        // `height: 100%` (`h-full`) collapses to one viewport. `contain: paint`
        // would then delete everything the user scrolled past, and the clip's
        // `100%` would be a viewport — together leaving a white band of height
        // `scroll.y` below the scrolled-in content. Pin the box to the real
        // content height so both assumptions hold. Read after re-insertion
        // (this runs in `animation`, where the node is laid out); guard against
        // a 0 from an edge-case detached node so we never collapse it.
        const contentHeight = backgroundEl.scrollHeight;
        if (contentHeight > 0) {
          backgroundEl.style.height = `${contentHeight}px`;
        }

        const bgRect = getViewportRect(
          context,
          direction === "enter" ? "from" : "to",
        );
        const bgCenterX = bgRect.left + bgRect.width / 2;
        const bgCenterY = bgRect.top + bgRect.height / 2;
        backgroundEl.style.clipPath = `inset(${bgRect.top}px 0 calc(100% - ${bgRect.top + bgRect.height}px) 0)`;
        backgroundEl.style.transformOrigin = `${bgCenterX}px ${bgCenterY}px`;

        const bgStyle =
          direction === "enter"
            ? (t: number, u: number) => bg.enterStyle(t, u)
            : (t: number) => bg.exitStyle(t);

        const bgAnim = new WebAnimation({
          element: backgroundEl,
          integrator: IntegratorProvider.from(physics),
          style: bgStyle,
          // The background is the reused outgoing (`from`) node on `enter` and
          // the surviving incoming (`to`) node on `exit` — in both cases its
          // inline styles must be cleared on settle so the reused node is not
          // left scaled/faded/clipped the next time it is shown. releaseFill
          // below drops the WAAPI fill so these resets actually take effect.
          onComplete: () => {
            backgroundEl.style.willChange = "auto";
            backgroundEl.style.backfaceVisibility = "";
            (
              backgroundEl.style as CSSStyleDeclaration & { contain: string }
            ).contain = "";
            backgroundEl.style.clipPath = "";
            backgroundEl.style.transformOrigin = "";
            backgroundEl.style.transform = "";
            backgroundEl.style.opacity = "";
            // Release the content-height pin applied above.
            backgroundEl.style.height = "";
          },
        });
        releaseFillOnSettle(bgAnim);
        anims.push(bgAnim);
      }

      // Blur tone: animate the backdrop-filter on the separate overlay layer.
      // It sits at Z_OVERLAY — between the background (Z_BACKGROUND) and the
      // sheet (Z_FOREGROUND) — so it frosts the receding background but never
      // the sheet. Unclipped and unscaled by design. The dispatcher removes
      // the created node on settle, so no inline-style cleanup is needed.
      if (overlay && overlayConfig) {
        overlay.style.zIndex = Z_OVERLAY;
        // The overlay must stay inside positionedParent so it sits between the
        // background and the sheet in the stacking order. But positionedParent
        // is the scroll container, and absolute children of a scroll container
        // translate with the content — a plain inset:0 would ride the scroll
        // and leave the bottom `scroll.y` px of the viewport unblurred (a
        // missing strip, seen on exit once the sheet drops past it). The
        // container is restored to the INCOMING page's scroll
        // (context.to.scroll.y) for the whole run, so anchor the overlay to
        // that live viewport slice instead (getOverlayRect backs out both the
        // scroll and positionedParent's own offset so it covers [0, viewport]).
        const overlayRect = getOverlayRect(context, "to");
        overlay.style.top = `${overlayRect.top}px`;
        overlay.style.height = `${overlayRect.height}px`;
        anims.push(
          new WebAnimation({
            element: overlay,
            integrator: IntegratorProvider.from(physics),
            style: (t) => overlayConfig.style(direction, t),
          }),
        );
      }

      return new MultiAnimation(anims, { mode: "parallel" });
    },
  };
};
