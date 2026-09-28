import { zoom } from "../src/lib/transitions";
import type { Animation } from "../src/lib/animation/animation";
import type { CreateElement, SsgoiTransitionContext } from "../src/lib/types";

const scene = document.querySelector<HTMLElement>("#scene")!;
const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><path fill="#2878c8" d="M0 0h400v240H0z"/></svg>',
  );

type Options = {
  type?: "static" | "expand" | "blur";
  variant?: "default" | "fade";
  direction?: "forward" | "backward";
};
let animation: Animation | undefined;
let start: (() => Promise<void>) | undefined;
let outgoing: HTMLElement;

/**
 * List: a card whose thumbnail carries a badge and sits under a bottom bar.
 * Detail: the player image with a control over it and page body below.
 */
function buildList(): HTMLElement {
  const list = document.createElement("article");
  list.className = "page list";
  list.innerHTML = `
    <div class="card">
      <img data-zoom-exit-key="photo" alt="" />
      <span class="badge"></span>
    </div>
    <nav class="bar"></nav>`;
  list.querySelector("img")!.src = picture;
  return list;
}

function buildDetail(): HTMLElement {
  const detail = document.createElement("article");
  detail.className = "page detail";
  detail.innerHTML = `
    <div class="player">
      <img data-zoom-enter-key="photo" alt="" />
      <button type="button" class="control"></button>
    </div>
    <section class="body"></section>`;
  detail.querySelector("img")!.src = picture;
  return detail;
}

async function setup({
  type = "expand",
  variant = "default",
  direction = "backward",
}: Options = {}) {
  animation?.cancel({ reason: "disposed", owns: () => true });
  scene.replaceChildren();
  const list = buildList();
  const detail = buildDetail();
  const [from, to] = direction === "forward" ? [list, detail] : [detail, list];
  outgoing = from;
  Object.assign(from.style, {
    position: "absolute",
    left: "0",
    top: "0",
  });
  scene.append(to, from);
  await Promise.all(
    [...scene.querySelectorAll("img")].map((img) => img.decode()),
  );
  const transition = zoom({ type, variant });
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

// Hold actual WAAPI keyframes at the first frame whose progress reaches
// `progress`, on every track of the composite.
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

function box(selector: string) {
  const rect = scene.querySelector(selector)!.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

const harness = {
  setup,
  start: () => start!(),
  seek,
  box,
  inlineOpacity: (selector: string) =>
    scene.querySelector<HTMLElement>(selector)!.style.opacity,
  computedOpacity: (selector: string) =>
    getComputedStyle(scene.querySelector<HTMLElement>(selector)!).opacity,
  complete: () => animation!.complete(),
  finish: () => {
    animation!.complete();
    outgoing.remove();
  },
};
declare global {
  interface Window {
    zoomChrome: typeof harness;
  }
}
window.zoomChrome = harness;
