import { hero, zoom } from "../src/lib/transitions";
import type { Animation } from "../src/lib/animation/animation";
import type { CreateElement, SsgoiTransitionContext } from "../src/lib/types";

const scene = document.querySelector<HTMLElement>("#scene")!;
const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path fill="#2878c8" d="M0 0h200v200H0z"/></svg>',
  );

type Options = {
  effect: "hero" | "zoom";
  type?: "static" | "fade" | "expand" | "blur";
  direction?: "forward" | "backward";
  opacity?: number;
};
let animation: Animation | undefined;
let start: (() => Promise<void>) | undefined;
let outgoing: HTMLElement;

async function setup({
  effect,
  type = "static",
  direction = "forward",
  opacity = 1,
}: Options) {
  animation?.cancel({ reason: "disposed", owns: () => true });
  scene.replaceChildren();
  const list = document.createElement("article");
  const detail = document.createElement("article");
  for (const [page, role] of [
    [list, "exit"],
    [detail, "enter"],
  ] as const) {
    page.className = "page";
    const image = document.createElement("img");
    image.src = picture;
    image.setAttribute(`data-${effect}-${role}-key`, "photo");
    image.style.opacity = String(opacity);
    page.append(image);
  }
  const [from, to] = direction === "forward" ? [list, detail] : [detail, list];
  outgoing = from;
  Object.assign(from.style, {
    position: "absolute",
    left: "0",
    top: "0",
    zIndex: "1",
  });
  scene.append(to, from);
  await Promise.all(
    [...scene.querySelectorAll("img")].map((img) => img.decode()),
  );
  const transition =
    effect === "hero"
      ? hero({ type: type === "fade" ? "fade" : "static" })
      : zoom({
          type: type === "expand" || type === "blur" ? type : "static",
          variant: "fade",
        });
  const context: SsgoiTransitionContext = {
    direction,
    scrollOffset: { x: 0, y: 0 },
    from: { scroll: { x: 0, y: 0 } },
    to: { scroll: { x: 0, y: 0 } },
    scrollingElement: scene,
    positionedParent: scene,
  };
  start = async () => {
    const extras = await transition.prepare?.({
      from: Promise.resolve(from),
      to: Promise.resolve(to),
      context,
      createElement: ((_id: string, tag = "div") =>
        document.createElement(tag)) as CreateElement,
    });
    animation = transition.animation({ from, to, context, ...extras });
    animation.play();
    animation.pause();
    await Promise.all(
      [...scene.querySelectorAll("img")].map((img) => img.decode()),
    );
  };
}

// Hold actual WAAPI keyframes. Identical geometry/images isolate compositing
// from motion and image loading: the painted pixel must not change at all.
function seek(progress: number) {
  for (const track of animation!.getMotionTracks()) {
    const frames = track.getTimeline()[0]!.frames;
    const frame =
      frames.find((frame) => frame.value >= progress) ??
      frames[frames.length - 1]!;
    for (const native of track.element.getAnimations())
      native.currentTime = frame.time;
  }
}

const harness = {
  setup,
  start: () => start!(),
  seek,
  finish: () => {
    animation!.complete();
    outgoing.remove();
  },
};
declare global {
  interface Window {
    sharedCrossfade: typeof harness;
  }
}
window.sharedCrossfade = harness;
