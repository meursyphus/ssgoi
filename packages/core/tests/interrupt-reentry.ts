import { createSggoiTransitionContext } from "../src/lib/ssgoi-transition/create-ssgoi-transition-context";
import { HostAnimation } from "../src/lib/animation/host-animation";
import * as effects from "../src/lib/transitions";
import type { SsgoiContext } from "../src/lib/types";

// A page-level fixture driven through the real transition context, so an
// interrupted entry goes through unmount (or Activity hide) → OUT reinsertion
// exactly as a framework adapter would drive it. `motion-continuity.html`
// bypasses that path and never detaches the outgoing page.
const params = new URLSearchParams(location.search);
const hidden = params.has("hidden");
const scene = document.querySelector<HTMLElement>("#scene")!;
const header = document.querySelector<HTMLElement>("#header")!;
if (params.has("header")) header.classList.add("tall");
if (params.has("static")) scene.classList.add("static");

type Effect = [name: keyof typeof effects, options: Record<string, unknown>];
const cases: Effect[] = [
  ["slide", {}],
  ["fade", {}],
  ["axis", { type: "x" }],
  ["axis", { type: "y" }],
  ["axis", { type: "z" }],
  ["drill", {}],
  ["sheet", {}],
  ["scroll", {}],
  ["rotate", {}],
  ["strip", {}],
  ["jaemin", {}],
  ["film", {}],
  ["blind", {}],
];
const label = ([name, options]: Effect) =>
  name + (Object.keys(options).length ? " " + JSON.stringify(options) : "");

const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="#78b2d8"/><circle cx="650" cy="180" r="95" fill="#ffe5a3"/></svg>',
  );

let host = new HostAnimation();
let context: SsgoiContext | null = null;
let current: HTMLElement | null = null;
const persistent = new Map<string, HTMLElement>();

function makePage(name: string): HTMLElement {
  const page = document.createElement("article");
  page.className = `page ${name}`;
  page.dataset.page = name;
  page.setAttribute("data-ssgoi-transition", `/${name}`);
  page.innerHTML = `<h1>${name.toUpperCase()} page</h1><img src="${picture}"><p>Interrupted entry fixture</p>`;
  return page;
}

const frames = async (count = 3) => {
  for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};

function setup(effect: Effect) {
  context?.disconnect?.();
  host.cancel({ reason: "disposed", owns: () => true });
  scene.replaceChildren();
  persistent.clear();
  host = new HostAnimation();
  const [name, options] = effect;
  const factory = effects[name] as (o: object) => never;
  context = createSggoiTransitionContext(
    {
      transitions: [
        {
          on: "/**",
          transition: factory(options),
          preserveScroll: { from: true, to: true },
        },
      ],
    },
    { host },
  );
  if (hidden) {
    for (const name of ["a", "b", "c"]) {
      const page = makePage(name);
      if (name !== "a") page.style.setProperty("display", "none", "important");
      scene.append(page);
      persistent.set(name, page);
      context.register(`/${name}`, page);
    }
    current = persistent.get("a")!;
  } else {
    current = makePage("a");
    scene.append(current);
    context.register("/a", current);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

/** Drive a navigation the way a framework adapter would. */
function navigate(name: string): HTMLElement {
  if (!context || !current) throw new Error("setup() first");
  let next: HTMLElement;
  if (hidden) {
    next = persistent.get(name)!;
    current.style.setProperty("display", "none", "important");
    next.style.removeProperty("display");
  } else {
    next = makePage(name);
    current.remove();
    scene.append(next);
    context.register(`/${name}`, next);
  }
  current = next;
  return next;
}

type Sample = {
  t: number;
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  detached: boolean;
  scroll: number;
};
function sample(el: HTMLElement): Sample {
  const r = el.getBoundingClientRect();
  // A page that has settled (unmounted, or re-hidden by Activity) has no box.
  const detached = !el.isConnected || (r.width === 0 && r.height === 0);
  return {
    t: performance.now(),
    x: r.x,
    y: r.y,
    w: r.width,
    h: r.height,
    opacity: detached ? NaN : Number(getComputedStyle(el).opacity),
    detached,
    scroll: document.documentElement.scrollTop,
  };
}

function summarize(samples: Sample[], mark: number) {
  let preIndex = -1;
  for (let i = samples.length - 1; i >= 0; i--)
    if (samples[i]!.t <= mark) {
      preIndex = i;
      break;
    }
  const pre = samples[preIndex];
  const post = samples[preIndex + 1];
  const delta = (a: Sample, b: Sample) => ({
    x: Math.abs(b.x - a.x),
    y: Math.abs(b.y - a.y),
    w: Math.abs(b.w - a.w),
    h: Math.abs(b.h - a.h),
    opacity: Math.abs(b.opacity - a.opacity),
  });
  const magnitude = (i: number) => {
    const a = samples[i - 1],
      b = samples[i];
    if (!a || !b || a.detached || b.detached) return null;
    const d = delta(a, b);
    return Math.max(d.x, d.y, d.w, d.h);
  };
  let maxStep = 0;
  for (let i = 1; i < samples.length; i++) {
    if (i === preIndex + 1) continue;
    maxStep = Math.max(maxStep, magnitude(i) ?? 0);
  }
  return {
    frames: samples.length,
    detachedFrames: samples.filter((s) => s.detached).length,
    handoff: pre && post ? delta(pre, post) : null,
    // Motion continues through a handoff, so the step across it should be
    // close to the steps on either side of it, not close to zero.
    stepBefore: magnitude(preIndex),
    stepAfter: magnitude(preIndex + 2),
    pre: pre && [pre.x, pre.y, pre.w, pre.h, pre.opacity, pre.scroll],
    post: post && [post.x, post.y, post.w, post.h, post.opacity, post.scroll],
    around: samples
      .slice(Math.max(0, preIndex - 2), preIndex + 7)
      .map((s) =>
        [s.t - mark, s.x, s.y, s.w, s.h, s.opacity, s.scroll].map(
          (v) => Math.round(v * 100) / 100,
        ),
      ),
    maxStep,
  };
}

type RunOptions = {
  effect: Effect;
  /**
   * Milliseconds into the A→B entry before navigating away from B. `null`
   * waits for the entry to settle first, which measures an ordinary exit.
   */
  interruptAfter?: number | null;
  /** Where the interruption goes: back to A or on to C. */
  second?: "a" | "c";
  /** Document scroll on A before the first navigation. */
  scroll?: number;
  settle?: number;
};

// Sample after each paint. A rAF callback runs before the frame's remaining
// callbacks (scroll restoration, the frame scheduler) mutate the scene, so
// reading there records states the user never sees. A message posted from
// rAF is delivered once rendering has finished.
const channel = new MessageChannel();
let painted: (() => void) | null = null;
channel.port1.onmessage = () => painted?.();
const afterPaint = () =>
  new Promise<void>((resolve) => {
    painted = resolve;
    requestAnimationFrame(() => channel.port2.postMessage(0));
  });

async function run({
  effect,
  interruptAfter = 120,
  second = "a",
  scroll = 0,
  settle = 1600,
}: RunOptions) {
  setup(effect);
  // The context records scroll only once a registration has settled
  // (TRANSITION_SETTLE_FRAMES); a user scrolls A after it settled.
  await frames(12);
  if (scroll) {
    window.scrollTo({ top: scroll, behavior: "instant" });
    await frames(3);
  }
  const bSamples: Sample[] = [];
  const firstSamples: Sample[] = [];
  const first = current!;
  const b = navigate("b");
  const start = performance.now();
  let re: HTMLElement | null = null;
  let mark = 0;
  let idle = 0;
  while (true) {
    await afterPaint();
    bSamples.push(sample(b));
    firstSamples.push(sample(first));
    if (!re) {
      const settledEntry = !host.activeChild && host.retiringCount === 0;
      if (settledEntry) idle++;
      const due =
        interruptAfter === null
          ? idle >= 2
          : performance.now() - start >= interruptAfter;
      if (due) {
        // Navigate in a task, as a click handler would: the scroll policy
        // and playback both start in this frame's rendering update.
        mark = performance.now();
        re = navigate(second);
      }
    } else if (performance.now() - mark >= settle) break;
  }
  const invalid = [...scene.querySelectorAll("*"), scene].some((el) =>
    /NaN|Infinity/.test(el.getAttribute("style") || ""),
  );
  const result = {
    effect: label(effect),
    mode: hidden ? "hidden" : "unmount",
    second,
    scroll,
    outgoing: summarize(bSamples, mark),
    // In hidden mode `second: "a"` re-enters the very node that was leaving.
    reentering:
      hidden && re === first ? summarize(firstSamples, mark) : undefined,
    invalid,
    settled: !host.activeChild && host.retiringCount === 0,
    retiring: host.retiringCount,
    animations: scene.getAnimations({ subtree: true }).length,
    pages: scene.querySelectorAll(".page:not([style*='display: none'])").length,
  };
  return result;
}

async function runAll({
  only,
  ...options
}: Omit<RunOptions, "effect"> & { only?: string } = {}) {
  const results = [];
  for (const effect of cases) {
    if (only && !label(effect).startsWith(only)) continue;
    results.push(await run({ effect, ...options }));
  }
  return results;
}

const select = document.querySelector<HTMLSelectElement>("#effect")!;
cases.forEach((entry, i) => select.add(new Option(label(entry), String(i))));
select.onchange = () => setup(cases[Number(select.value)]!);
for (const name of ["a", "b", "c"])
  document.querySelector(`#${name}`)!.addEventListener("click", () => {
    if (!context) setup(cases[Number(select.value)]!);
    if (current?.dataset.page !== name) navigate(name);
  });
document
  .querySelector("#finish")!
  .addEventListener("click", () => host.complete());

const harness = {
  cases,
  label,
  setup,
  navigate,
  run,
  runAll,
  frames,
  get host() {
    return host;
  },
  get context() {
    return context;
  },
  get current() {
    return current;
  },
};
declare global {
  interface Window {
    reentry: typeof harness;
  }
}
window.reentry = harness;
setup(cases[0]!);
await frames();
document.title = "SSGOI interrupted entry — ready";
