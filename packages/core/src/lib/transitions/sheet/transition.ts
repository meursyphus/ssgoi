import type { TransitionConfig } from "@types";
import { getViewportRect } from "@utils";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { SHEET_PROVIDERS } from "./provider";
import type { SheetOptions, SheetType } from "./types";

export type { SheetOptions, SheetType } from "./types";

const DEFAULT_TYPE: SheetType = "static";
const SHEET_WILL_CHANGE = "transform";

export const sheet = (options: SheetOptions = {}): TransitionConfig => {
  const direction = options.direction ?? "enter";
  const provider = SHEET_PROVIDERS[options.type ?? DEFAULT_TYPE];
  const physics =
    direction === "enter" ? provider.enterPhysics : provider.exitPhysics;
  const bg = provider.background;
  // Empty willChange == "don't touch the background at all" (zoom-style static).
  const animatesBackground = bg.willChange !== "";

  return {
    prepare: ({ from, to }) => {
      const sheet = direction === "enter" ? to : from;
      const background = direction === "enter" ? from : to;

      sheet.then((el) => {
        el.style.willChange = SHEET_WILL_CHANGE;
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        if (direction === "exit") {
          el.style.pointerEvents = "none";
          el.style.zIndex = "100";
        }
      });

      background.then((el) => {
        if (animatesBackground) {
          el.style.willChange = bg.willChange;
          el.style.backfaceVisibility = "hidden";
          (el.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        }
        if (direction === "enter") {
          // Make sure the cloned outgoing page stays beneath the rising sheet.
          el.style.pointerEvents = "none";
          el.style.zIndex = "-1";
        }
      });

      return {};
    },
    animation: ({ from, to, context }) => {
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
          // (the sheet itself on `exit`, the background on `enter`). The rest
          // of the `from` background props on `enter` are cleared by bgAnim.
          resetFromInteractionProps();
        },
      });

      if (!animatesBackground) {
        // Static: the background sits untouched for the whole duration.
        return new MultiAnimation([sheetAnim], { mode: "parallel" });
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
        // On `exit` the background is the incoming (`to`) node; on `enter` it is
        // the reused outgoing (`from`) node — in both cases its inline styles
        // must be restored when the animation settles, so the reused node is
        // not left scaled/faded/clipped the next time it is shown. The `enter`
        // branch mirrors the `exit` cleanup and additionally clears the
        // transform/opacity final frame WAAPI leaves behind.
        onComplete:
          direction === "exit"
            ? () => {
                backgroundEl.style.willChange = "auto";
                backgroundEl.style.backfaceVisibility = "";
                (
                  backgroundEl.style as CSSStyleDeclaration & {
                    contain: string;
                  }
                ).contain = "";
                backgroundEl.style.clipPath = "";
                backgroundEl.style.transformOrigin = "";
              }
            : () => {
                backgroundEl.style.willChange = "auto";
                backgroundEl.style.backfaceVisibility = "";
                (
                  backgroundEl.style as CSSStyleDeclaration & {
                    contain: string;
                  }
                ).contain = "";
                backgroundEl.style.clipPath = "";
                backgroundEl.style.transformOrigin = "";
                backgroundEl.style.transform = "";
                backgroundEl.style.opacity = "";
              },
      });

      return new MultiAnimation([sheetAnim, bgAnim], { mode: "parallel" });
    },
  };
};
