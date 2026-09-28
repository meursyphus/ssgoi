import { hero } from "../src/lib/transitions";
import { HostAnimation } from "../src/lib/animation/host-animation";
import { createSggoiTransitionContext } from "../src/lib/ssgoi-transition/create-ssgoi-transition-context";
import type { Animation } from "../src/lib/animation/animation";
import type {
  CreateElement,
  SsgoiContext,
  SsgoiTransitionContext,
} from "../src/lib/types";

const scene = document.querySelector<HTMLElement>("#scene")!;
// Portrait 1:2. Red top quarter, blue middle half, green bottom quarter, so
// any cover crop of the middle half (every crop in this scene) is all blue.
const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="400"><path fill="#e0402a" d="M0 0h200v100H0z"/><path fill="#2878c8" d="M0 100h200v200H0z"/><path fill="#2a9d4a" d="M0 300h200v100H0z"/></svg>',
  );

/**
 * - flow: a flex-item image that owns its crop (`overflow: visible` + clip-path)
 * - gallery: an absolutely positioned image filling a positioned clipping frame
 * - plain: a flex-item image with the default replaced-element overflow
 * - cell: a static image filling an unpositioned `overflow: hidden` cell
 * - spaceLast / spaceFirst: the image last / first in Tailwind v4 / v3
 *   `space-y-*` spacing, which counts every sibling including temporary copies
 */
type Layout =
  | "flow"
  | "gallery"
  | "plain"
  | "cell"
  | "spaceLast"
  | "spaceFirst";

function listPage(): HTMLElement {
  const page = document.createElement("article");
  page.className = "page list";
  page.innerHTML = `<h2>Gallery</h2><img class="thumb" data-hero-exit-key="photo" src="${picture}"><p class="note">Thumbnail</p>`;
  return page;
}

function detailPage(layout: Layout): HTMLElement {
  const page = document.createElement("article");
  page.className = `page detail ${layout}`;
  const photo = `<img class="photo" data-hero-enter-key="photo" src="${picture}">`;
  const body = {
    flow: photo,
    plain: photo,
    gallery: `<div class="gallery">${photo}<span class="badge">1 / 4</span></div>`,
    cell: `<div class="clip-cell">${photo}</div>`,
    spaceLast: `<div class="stack"><p class="lead">Lead</p>${photo}</div>`,
    spaceFirst: `<div class="stack3">${photo}<p class="lead">After</p></div>`,
  }[layout];
  page.innerHTML = `<h2>Detail</h2>${body}<p class="caption">The rest of the page must not move.</p><div class="chips"><span>One</span><span>Two</span></div>`;
  return page;
}

const decode = () =>
  Promise.all([...scene.querySelectorAll("img")].map((img) => img.decode()));

/**
 * Temporary copies: Hero's source copy and exit layer, and the inert,
 * aria-hidden copy an interrupted run may crossfade out (motion handoff
 * fallback). Any other node inserted into the real tree still counts.
 */
const TRANSIENT =
  '[data-ssgoi-crossfade], [data-hero-layer], [inert][aria-hidden="true"]';
const transient = (el: Element) => el.closest(TRANSIENT) !== null;

/** Layout box in scene coordinates; transforms never enter offset* values. */
function layoutBox(el: HTMLElement) {
  let x = 0,
    y = 0;
  for (
    let node: HTMLElement | null = el;
    node && node !== scene;
    node = node.offsetParent as HTMLElement | null
  ) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return [x, y, el.offsetWidth, el.offsetHeight];
}

/** Stable address that ignores transient copies among the siblings. */
function path(el: Element): string {
  const parts: string[] = [];
  for (let node: Element | null = el; node && node !== scene; ) {
    const parent: Element | null = node.parentElement;
    const index = parent
      ? [...parent.children].filter((child) => !transient(child)).indexOf(node)
      : 0;
    const name = node.className
      ? `.${String(node.className).split(" ").join(".")}`
      : "";
    parts.unshift(`${node.tagName.toLowerCase()}${name}:${index}`);
    node = parent;
  }
  return parts.join(">");
}

/** Every non-transient element's layout box and inline style. */
function snapshot(root: Element = scene) {
  const elements = [...root.querySelectorAll<HTMLElement>("*")].filter(
    (el) => !transient(el),
  );
  return {
    layout: Object.fromEntries(elements.map((el) => [path(el), layoutBox(el)])),
    // An emptied style attribute holds no inline style.
    styles: Object.fromEntries(
      elements.map((el) => [path(el), el.getAttribute("style") || null]),
    ),
    children: Object.fromEntries(
      elements.map((el) => [
        path(el),
        [...el.children].filter((child) => !transient(child)).length,
      ]),
    ),
    // No transition-state attribute appears on any real element.
    attributes: Object.fromEntries(
      elements.map((el) => [
        path(el),
        el
          .getAttributeNames()
          .filter((name) => name !== "style")
          .sort()
          .join(" "),
      ]),
    ),
  };
}

/** On-screen clip window and transformed box of an animated visual. */
function visible(el: HTMLElement) {
  const sceneRect = scene.getBoundingClientRect();
  const [x, y, w, h] = layoutBox(el);
  const box = {
    left: sceneRect.left + x!,
    top: sceneRect.top + y!,
    w: w!,
    h: h!,
  };
  const style = getComputedStyle(el);
  const m =
    style.transform === "none"
      ? [1, 0, 0, 1, 0, 0]
      : style.transform
          .slice(style.transform.indexOf("(") + 1, -1)
          .split(",")
          .map(Number);
  // inset() serializes one to four lengths like margins.
  const lengths = /inset\(([^)]*)\)/
    .exec(style.clipPath)![1]!
    .split(" round ")[0]!
    .trim()
    .split(/\s+/);
  const [t, r = t, b = t, l = r] = lengths;
  const length = (value: string, size: number) =>
    value.endsWith("%")
      ? (Number.parseFloat(value) / 100) * size
      : Number.parseFloat(value);
  const cx = box.left + box.w / 2;
  const cy = box.top + box.h / 2;
  const mapX = (v: number) => cx + m[0]! * (v - cx) + m[4]!;
  const mapY = (v: number) => cy + m[3]! * (v - cy) + m[5]!;
  const x0 = mapX(box.left + length(l!, box.w));
  const x1 = mapX(box.left + box.w - length(r!, box.w));
  const y0 = mapY(box.top + length(t!, box.h));
  const y1 = mapY(box.top + box.h - length(b!, box.h));
  return {
    window: { left: x0, top: y0, width: x1 - x0, height: y1 - y0 },
    box: {
      left: mapX(box.left),
      top: mapY(box.top),
      width: mapX(box.left + box.w) - mapX(box.left),
      height: mapY(box.top + box.h) - mapY(box.top),
    },
  };
}

/* ── Direct: sampled WAAPI keyframes of one transition ─────────────────── */

let animation: Animation | undefined;
let start: ((interrupt?: boolean) => Promise<void>) | undefined;
let from: HTMLElement;
let to: HTMLElement;

type Options = {
  layout?: Layout;
  direction?: "forward" | "backward";
  type?: "static" | "fade";
};

async function setup({
  layout = "flow",
  direction = "forward",
  type = "static",
}: Options = {}) {
  animation?.cancel({ reason: "disposed", owns: () => true });
  scene.replaceChildren();
  const list = listPage();
  const detail = detailPage(layout);
  [from, to] = direction === "forward" ? [list, detail] : [detail, list];
  Object.assign(from.style, {
    position: "absolute",
    left: "0",
    top: "0",
    zIndex: "1",
  });
  scene.append(to, from);
  await decode();
  const transition = hero({ type });
  const context: SsgoiTransitionContext = {
    direction,
    scrollOffset: { x: 0, y: 0 },
    from: { scroll: { x: 0, y: 0 } },
    to: { scroll: { x: 0, y: 0 } },
    scrollingElement: scene,
    positionedParent: scene,
  };
  start = async (interrupt = false) => {
    const previous = animation;
    const extras = await transition.prepare?.({
      from: Promise.resolve(from),
      to: Promise.resolve(to),
      context,
      createElement: ((_id: string, tag = "div") =>
        document.createElement(tag)) as CreateElement,
    });
    const next = transition.animation({ from, to, context, ...extras });
    animation = next;
    // A replacement disposes the run it replaces, as a host would: the old
    // run keeps ownership of everything the new run does not drive.
    if (interrupt) {
      const claimed = new Set<HTMLElement>([
        from,
        to,
        ...next.getMotionTracks().map((track) => track.element),
      ]);
      previous?.cancel({
        reason: "disposed",
        owns: (element) => !claimed.has(element),
      });
    }
    animation.play();
    animation.pause();
    await decode();
  };
  return snapshot();
}

/** Swap the two pages and start the reverse run over the one in flight. */
async function reverse() {
  [from, to] = [to, from];
  from.style.zIndex = "1";
  await start!(true);
}

function seek(progress: number) {
  for (const track of animation!.getMotionTracks()) {
    const frames = track.getTimeline()[0]!.frames;
    const frame =
      frames.find((frame) => frame.value >= progress) ??
      frames[frames.length - 1]!;
    for (const native of track.element.getAnimations())
      native.currentTime = frame.time;
  }
  return snapshot();
}

function destination() {
  return to.querySelector<HTMLElement>(
    "[data-hero-enter-key], [data-hero-exit-key]",
  )!;
}

/** Hide the source copy so pixels show only what the real image paints. */
function hideCopies(hidden = true) {
  for (const copy of scene.querySelectorAll<HTMLElement>(
    "[data-ssgoi-crossfade]",
  ))
    copy.style.visibility = hidden ? "hidden" : "";
}

const harness = {
  setup,
  start: (interrupt?: boolean) => start!(interrupt),
  reverse,
  seek,
  snapshot,
  hideCopies,
  visible: () => visible(destination()),
  source: () => {
    const el = from.querySelector<HTMLElement>(
      "[data-hero-enter-key], [data-hero-exit-key]",
    )!;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  },
  computed: () => {
    const style = getComputedStyle(destination());
    return {
      transform: style.transform,
      clipPath: style.clipPath,
      opacity: style.opacity,
      borderRadius: style.borderTopLeftRadius,
      willChange: style.willChange,
      transformOrigin: style.transformOrigin,
    };
  },
  transients: () => scene.querySelectorAll(TRANSIENT).length,
  /** Whether the in-page copy precedes (paints below) the real image. */
  copyBelow: () =>
    destination().previousElementSibling?.hasAttribute(
      "data-ssgoi-crossfade",
    ) ?? false,
  finish: () => {
    animation!.complete();
    return snapshot();
  },
  runtime,
};

/* ── Runtime: real transition context, interrupted and re-entered ──────── */

const frame = () => new Promise(requestAnimationFrame);
const wait = async (ms: number, each?: () => void) => {
  const until = performance.now() + ms;
  while (performance.now() < until) {
    await frame();
    each?.();
  }
};

/**
 * list → detail, back to list mid-flight, then detail again mid-flight: with
 * Activity-hidden pages the last run re-enters the very image the first run
 * was still animating. Everything must settle to the authored DOM.
 */
async function runtime({
  layout = "flow",
  hidden = false,
  delays = [140, 110],
}: {
  layout?: Layout;
  hidden?: boolean;
  delays?: number[];
}) {
  animation?.cancel({ reason: "disposed", owns: () => true });
  scene.replaceChildren();
  const host = new HostAnimation();
  const context: SsgoiContext = createSggoiTransitionContext(
    { transitions: [{ on: "/**", transition: hero({ type: "fade" }) }] },
    { host },
  );
  const templates = {
    list: snapshot(listPage()),
    detail: snapshot(detailPage(layout)),
  };
  const persistent = new Map<string, HTMLElement>();
  const make = (name: "list" | "detail") => {
    const page = name === "list" ? listPage() : detailPage(layout);
    page.setAttribute("data-ssgoi-transition", `/${name}`);
    return page;
  };
  let current: HTMLElement;
  if (hidden) {
    for (const name of ["list", "detail"] as const) {
      const page = make(name);
      if (name !== "list")
        page.style.setProperty("display", "none", "important");
      scene.append(page);
      persistent.set(name, page);
      context.register(`/${name}`, page);
    }
    current = persistent.get("list")!;
  } else {
    current = make("list");
    scene.append(current);
    context.register("/list", current);
  }
  await decode();
  await wait(250);
  const navigate = (name: "list" | "detail") => {
    let next: HTMLElement;
    if (hidden) {
      next = persistent.get(name)!;
      current.style.setProperty("display", "none", "important");
      next.style.removeProperty("display");
    } else {
      next = make(name);
      current.remove();
      scene.append(next);
      context.register(`/${name}`, next);
    }
    current = next;
    return next;
  };
  // The detail page's siblings of the visual must hold still in every frame.
  const shifts: number[] = [];
  const unmatched = new Set<string>();
  let reference: Record<string, number[]> | null = null;
  const sample = () => {
    const detail = scene.querySelector<HTMLElement>(
      ".detail:not([style*='display: none'])",
    );
    if (!detail) return;
    const boxes = Object.fromEntries(
      [
        ...detail.querySelectorAll<HTMLElement>(
          "h2, .gallery, .clip-cell, .stack, .stack3, .lead, .photo, .caption, .chips",
        ),
      ]
        .filter((el) => !transient(el))
        .map((el) => [path(el).replace(/^[^>]*>/, ""), layoutBox(el)]),
    );
    reference ??= boxes;
    for (const [key, box] of Object.entries(boxes)) {
      const expected = reference[key];
      if (!expected) unmatched.add(key);
      else
        shifts.push(Math.max(...box.map((v, i) => Math.abs(v - expected[i]!))));
    }
  };
  navigate("detail");
  await decode();
  await wait(delays[0]!, sample);
  navigate("list");
  await wait(delays[1]!, sample);
  navigate("detail");
  await decode();
  let settled = false;
  for (let i = 0; i < 240 && !settled; i++) {
    await frame();
    sample();
    settled = !host.activeChild && host.retiringCount === 0;
  }
  await wait(100);
  const pages = [...scene.querySelectorAll<HTMLElement>(".page")];
  const compare = (page: HTMLElement) => {
    const name = page.classList.contains("list") ? "list" : "detail";
    const actual = snapshot(page);
    const expected = templates[name];
    // Paths inside the page drop the page element itself.
    const strip = (record: Record<string, unknown>) =>
      Object.fromEntries(
        Object.entries(record).map(([key, value]) => [
          key.replace(/^[^>]*>/, ""),
          value,
        ]),
      );
    return {
      styles:
        JSON.stringify(strip(actual.styles)) ===
        JSON.stringify(strip(expected.styles))
          ? true
          : { actual: strip(actual.styles), expected: strip(expected.styles) },
      children:
        JSON.stringify(strip(actual.children)) ===
        JSON.stringify(strip(expected.children)),
      attributes:
        JSON.stringify(strip(actual.attributes)) ===
        JSON.stringify(strip(expected.attributes)),
    };
  };
  const result = {
    settled,
    shift: Math.max(0, ...shifts),
    samples: shifts.length,
    unmatched: [...unmatched],
    transients: harness.transients(),
    animations: scene.getAnimations({ subtree: true }).length,
    pages: pages.map(compare),
    image: (() => {
      const image = scene.querySelector<HTMLElement>(
        ".detail:not([style*='display: none']) .photo",
      );
      if (!image) return null;
      const style = getComputedStyle(image);
      return {
        transform: style.transform,
        opacity: style.opacity,
        clipPath: style.clipPath,
        willChange: style.willChange,
      };
    })(),
  };
  context.disconnect?.();
  host.cancel({ reason: "disposed", owns: () => true });
  return result;
}

declare global {
  interface Window {
    heroInPlace: typeof harness;
  }
}
window.heroInPlace = harness;
