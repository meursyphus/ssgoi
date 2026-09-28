import { hero, zoom } from "../src/lib/transitions";
import {
  parsePixelRadius,
  resolveElementMediaGeometry,
} from "../src/lib/transitions/media-geometry";
import type { Animation } from "../src/lib/animation/animation";
import type { CreateElement, SsgoiTransitionContext } from "../src/lib/types";

const scene = document.querySelector<HTMLElement>("#scene")!;
const casesRoot = document.querySelector<HTMLElement>("#cases")!;
const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path fill="#2878c8" d="M0 0h200v200H0z"/></svg>',
  );

function image(width: number, height: number, className = ""): HTMLElement {
  const img = document.createElement("img");
  img.src = picture;
  img.className = className;
  img.style.width = `${width}px`;
  img.style.height = `${height}px`;
  return img;
}

function clip(width: number, height: number, child: HTMLElement) {
  const wrapper = document.createElement("div");
  wrapper.className = "clip rounded-full";
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.append(child);
  return wrapper;
}

function measure(el: HTMLElement) {
  const { left, top, width, height } = el.getBoundingClientRect();
  return { left, top, width, height };
}

/** `keyed` carries the shared key; `styled` is the element whose radius counts. */
const cases: {
  name: string;
  build: () => { keyed: HTMLElement; styled: HTMLElement; root: HTMLElement };
}[] = [
  {
    name: "rounded-full image 78x78",
    build: () => {
      const keyed = image(78, 78, "rounded-full");
      return { keyed, styled: keyed, root: keyed };
    },
  },
  {
    name: "rounded-full clipping pill 240x60",
    build: () => {
      const keyed = clip(240, 60, image(240, 60));
      return { keyed, styled: keyed, root: keyed };
    },
  },
  {
    name: "rounded-full avatar clipping a keyed image 58x58",
    build: () => {
      const keyed = image(58, 58);
      const styled = clip(58, 58, keyed);
      return { keyed, styled, root: styled };
    },
  },
  {
    name: "9999px image 200x40",
    build: () => {
      const keyed = image(200, 40);
      keyed.style.borderRadius = "9999px";
      return { keyed, styled: keyed, root: keyed };
    },
  },
  {
    name: "12px image 100x100",
    build: () => {
      const keyed = image(100, 100);
      keyed.style.borderRadius = "12px";
      return { keyed, styled: keyed, root: keyed };
    },
  },
  {
    name: "50% image 100x100",
    build: () => {
      const keyed = image(100, 100);
      keyed.style.borderRadius = "50%";
      return { keyed, styled: keyed, root: keyed };
    },
  },
];

async function geometry() {
  casesRoot.replaceChildren();
  const built = cases.map(({ name, build }) => {
    const page = document.createElement("div");
    const parts = build();
    page.append(parts.root);
    casesRoot.append(page);
    return { name, page, ...parts };
  });
  await Promise.all(
    [...casesRoot.querySelectorAll("img")].map((img) => img.decode()),
  );
  return built.map(({ name, page, keyed, styled }) => {
    const computed = getComputedStyle(styled).borderTopLeftRadius;
    const resolved = resolveElementMediaGeometry(
      keyed,
      measure(keyed),
      measure,
      {
        clipRoot: page,
      },
    );
    return {
      name,
      computed,
      parsed: parsePixelRadius(computed),
      radius: resolved.radius,
      radiusSource: resolved.radiusSource,
      contentAware: resolved.contentAware,
    };
  });
}

type Options = {
  effect: "hero" | "zoom";
  direction?: "forward" | "backward";
};
let animation: Animation | undefined;
let start: (() => Promise<void>) | undefined;
let outgoing: HTMLElement;

// A circular avatar on the list page and a square photo on the detail page,
// placed apart so the avatar's bbox corners are background at either end.
async function setup({ effect, direction = "forward" }: Options) {
  animation?.cancel({ reason: "disposed", owns: () => true });
  scene.replaceChildren();
  const list = document.createElement("article");
  const detail = document.createElement("article");
  for (const [page, role, className] of [
    [list, "exit", "avatar rounded-full"],
    [detail, "enter", "photo"],
  ] as const) {
    page.className = "page";
    const img = document.createElement("img");
    img.src = picture;
    img.className = className;
    img.setAttribute(`data-${effect}-${role}-key`, "photo");
    page.append(img);
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
      ? hero({ type: "static" })
      : zoom({ type: "static", variant: "fade" });
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

// Hold actual WAAPI keyframes at a track progress.
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
  geometry,
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
    roundedFull: typeof harness;
  }
}
window.roundedFull = harness;
