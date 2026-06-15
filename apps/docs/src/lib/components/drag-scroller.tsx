"use client";

import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const FRICTION = 0.95; // decel per 16ms frame (pointer-flick momentum)
const MIN_VELOCITY = 0.02; // px/ms — momentum stops below this
const DRAG_THRESHOLD = 8; // px — move past this to be a "drag" (swallow click + capture); below = tap
const LINE_HEIGHT = 16; // px, normalizes wheel deltaMode=line
const KEY_STEP_RATIO = 0.8; // arrow key steps this fraction of the viewport width
const CLICK_SWALLOW_MS = 350; // window after a drag in which the next click is swallowed

type Props = ComponentPropsWithoutRef<"div"> & {
  /** class for the track (the item row) — gap/padding etc. */
  trackClassName?: string;
  children: ReactNode;
};

/**
 * translateX-based MANUAL horizontal scroller — mouse / trackpad / touch / keyboard.
 *
 * Why transform instead of native overflow:
 *  - The position lives in the track's inline transform — not a layout-derived
 *    value — so it isn't lost when the node is hidden. This docs app runs Next
 *    `cacheComponents`, which wraps route segments in <Activity>: navigating away
 *    (home → listing detail) hides the page with display:none rather than
 *    unmounting it, so the node stays alive and the transform position is
 *    preserved for free → no restore logic needed. (A native overflow scrollLeft
 *    is React-invisible state that Activity can't keep, which is exactly why it
 *    would need restoring.) The offset is applied imperatively, so re-renders
 *    never clobber it.
 *  - getBoundingClientRect reflects the transform, so ssgoi's zoom measures a
 *    tile's true on-screen rect even when the row is scrolled — a card scrolled
 *    out of its starting spot zooms from where it actually is.
 *
 * Re-implements what native gave for free: pointer drag + flick momentum (capture
 * only past the threshold so taps still navigate; pointerId isolates multitouch;
 * touch-action: pan-y yields vertical swipes to the page), wheel/trackpad
 * (non-passive listener, deltaMode-normalized, consumes horizontal intent only),
 * keyboard (←/→) + focus-into-view for a11y, and a ResizeObserver that re-clamps
 * on size changes (skips display:none so the offset is preserved while hidden).
 */
export function DragScroller({
  trackClassName,
  children,
  className,
  ...rest
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offset = useRef(0); // current scroll amount (px); transform = translateX(-offset)
  const vel = useRef(0); // px/ms (pointer momentum)
  const max = useRef(0); // max scroll amount
  const raf = useRef(0); // momentum rAF id
  const dragging = useRef(false); // past threshold, actively dragging (= captured)
  const start = useRef({ x: 0, off: 0, t: 0, pointerId: -1, pending: false });

  const apply = () => {
    const t = trackRef.current;
    if (t) t.style.transform = `translate3d(${-offset.current}px,0,0)`;
  };
  const clamp = (v: number) => (v < 0 ? 0 : v > max.current ? max.current : v);
  const computeMax = () => {
    const vp = viewportRef.current;
    const t = trackRef.current;
    if (!vp || !t || !vp.clientWidth) return; // not rendered (display:none) → keep max so offset is preserved
    max.current = Math.max(0, t.scrollWidth - vp.clientWidth);
  };
  const setOffset = (v: number) => {
    offset.current = clamp(v);
    apply();
  };
  const stopMomentum = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
  };
  const momentum = () => {
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      if (Math.abs(vel.current) < MIN_VELOCITY) return void (raf.current = 0);
      const next = clamp(offset.current + vel.current * dt);
      if (next === offset.current)
        return void ((vel.current = 0), (raf.current = 0)); // hit the edge
      offset.current = next;
      apply();
      vel.current *= Math.pow(FRICTION, dt / 16); // framerate-independent decel
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  // Swallow the one click (a child <Link> nav) that fires right after a drag /
  // momentum-stop. Auto-releases after 350ms. One-shot listener so the guard
  // can't get stuck on pointercancel etc.
  const swallowNextClick = () => {
    const vp = viewportRef.current;
    if (!vp) return;
    let timer = 0;
    const done = () => {
      window.clearTimeout(timer);
      vp.removeEventListener("click", swallow, true);
    };
    const swallow = (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      done();
    };
    vp.addEventListener("click", swallow, true);
    timer = window.setTimeout(done, CLICK_SWALLOW_MS);
  };

  // ── pointer drag ──────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // primary button / touch / pen only
    if (dragging.current || start.current.pending) return; // another pointer owns it → multitouch isolation
    const wasMoving = raf.current !== 0;
    stopMomentum();
    computeMax();
    vel.current = 0;
    dragging.current = false;
    start.current = {
      x: e.clientX,
      off: offset.current,
      t: performance.now(),
      pointerId: e.pointerId,
      pending: true,
    };
    if (wasMoving) swallowNextClick(); // tap during momentum = intent to stop, not navigate
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (e.pointerId !== s.pointerId) return;
    if (!s.pending && !dragging.current) return;
    if (!dragging.current) {
      if (Math.abs(e.clientX - s.x) < DRAG_THRESHOLD) return;
      // capture only once past the threshold — so a tap still fires as a click
      dragging.current = true;
      s.pending = false;
      s.x = e.clientX; // rebase to the current point to avoid a jump
      s.off = offset.current;
      s.t = performance.now();
      viewportRef.current?.setPointerCapture(e.pointerId);
      if (viewportRef.current) viewportRef.current.style.cursor = "grabbing";
      return;
    }
    const now = performance.now();
    const next = clamp(s.off - (e.clientX - s.x));
    const dt = now - s.t;
    if (dt > 0) vel.current = (next - offset.current) / dt;
    offset.current = next;
    apply();
    s.t = now;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (e.pointerId !== s.pointerId) return;
    if (dragging.current) {
      dragging.current = false;
      viewportRef.current?.releasePointerCapture?.(e.pointerId);
      if (viewportRef.current) viewportRef.current.style.cursor = "";
      swallowNextClick(); // swallow the click that would navigate
      if (Math.abs(vel.current) >= MIN_VELOCITY) momentum();
    }
    s.pending = false;
    s.pointerId = -1;
  };
  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (e.pointerId !== s.pointerId) return;
    // cancel doesn't produce a click, so no swallow — just release the guard.
    dragging.current = false;
    viewportRef.current?.releasePointerCapture?.(e.pointerId);
    if (viewportRef.current) viewportRef.current.style.cursor = "";
    s.pending = false;
    s.pointerId = -1;
  };

  // ── keyboard (←/→) ────────────────────────────────────────────
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const t = e.target as HTMLElement;
    if (
      t.tagName === "INPUT" ||
      t.tagName === "TEXTAREA" ||
      t.tagName === "SELECT" ||
      t.isContentEditable
    )
      return;
    const vp = viewportRef.current;
    if (!vp) return;
    e.preventDefault();
    stopMomentum();
    computeMax();
    setOffset(
      offset.current +
        (e.key === "ArrowRight" ? 1 : -1) * vp.clientWidth * KEY_STEP_RATIO,
    );
  };

  // ── focus-into-view (Tab onto an off-screen link) ─────────────
  const onFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const vp = viewportRef.current;
    const t = trackRef.current;
    const child = e.target as HTMLElement;
    if (!vp || !t || !t.contains(child)) return;
    computeMax();
    const c = child.getBoundingClientRect();
    const v = vp.getBoundingClientRect();
    let delta = 0;
    if (c.left < v.left)
      delta = c.left - v.left; // off the left → move content right
    else if (c.right > v.right) delta = c.right - v.right; // off the right → move content left
    if (delta !== 0) setOffset(offset.current + delta);
  };

  // ── wheel/trackpad + resize: native (non-passive) listeners ───
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onWheel = (e: WheelEvent) => {
      const unit =
        e.deltaMode === 1
          ? LINE_HEIGHT
          : e.deltaMode === 2
            ? vp.clientWidth
            : 1;
      let dx = e.deltaX * unit;
      let dy = e.deltaY * unit;
      if (e.shiftKey && dx === 0) {
        dx = dy; // shift+wheel → horizontal (when the browser doesn't translate it)
        dy = 0;
      }
      if (Math.abs(dx) <= Math.abs(dy)) return; // vertical intent → let the page scroll
      e.preventDefault(); // consume horizontal intent only
      stopMomentum();
      computeMax();
      setOffset(offset.current + dx);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });

    const ro = new ResizeObserver(() => {
      if (!vp.clientWidth) return; // display:none → keep the offset
      computeMax();
      setOffset(offset.current); // re-clamp to the new max
    });
    ro.observe(vp);
    if (trackRef.current) ro.observe(trackRef.current);

    return () => {
      vp.removeEventListener("wheel", onWheel);
      ro.disconnect();
      stopMomentum();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={viewportRef}
      className={cn(
        "cursor-grab touch-pan-y select-none overflow-hidden overscroll-x-contain",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onDragStart={(e) => e.preventDefault()}
      {...rest}
    >
      <div ref={trackRef} className={cn("flex w-max", trackClassName)}>
        {children}
      </div>
    </div>
  );
}
