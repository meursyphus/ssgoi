// Sheet enter and exit over a page that carries a sticky bottom nav.
//
// The list page is tall and scrolled; the sheet route enters with
// `sheet({ type })` and leaves again. The fixture drives the REAL transition
// context with unmount-mode pages (like the React adapter) and samples where
// the sticky nav is painted relative to the scroller on every frame, while the
// list is the outgoing background (enter) and the incoming page (exit).
//
//   ?type=blur|scale|static   sheet tone (default blur)
//   ?scroll=500               list scroll before opening the sheet
//   ?slow=20                  WAAPI playbackRate divisor for eyeballing
//   ?auto=1                   open, then close automatically (for simctl)
import { createSggoiTransitionContext } from "../src/lib/ssgoi-transition/create-ssgoi-transition-context";
import { sheet } from "../src/lib/transitions";
import type { SheetType } from "../src/lib/transitions/sheet";

const params = new URLSearchParams(location.search);
const type = (params.get("type") ?? "blur") as SheetType;
const savedScroll = Number(params.get("scroll") ?? 500);
const slow = Number(params.get("slow") ?? 1);

const scene = document.querySelector<HTMLElement>("#scene")!;
const mount = document.querySelector<HTMLElement>("#transition")!;
const out = document.querySelector<HTMLElement>("#out")!;
const clock = document.querySelector<HTMLElement>("#clock")!;

const context = createSggoiTransitionContext({
  transitions: [{ on: "/sheet", transition: sheet({ type }) }],
});

const makeList = () => {
  const page = document.createElement("div");
  page.className = "page list";
  page.setAttribute("data-ssgoi-transition", "/list");
  const content = document.createElement("div");
  content.className = "content";
  for (let i = 1; i <= 30; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = `Item ${i}`;
    content.append(card);
  }
  const nav = document.createElement("nav");
  nav.id = "nav";
  nav.innerHTML =
    '<div class="capsule"><div class="tab">Home</div><div class="tab">Explore</div><div class="tab">Log</div><div class="tab">Me</div></div>';
  page.append(content, nav);
  return page;
};

const makeSheet = () => {
  const page = document.createElement("div");
  page.className = "page sheet";
  page.setAttribute("data-ssgoi-transition", "/sheet");
  page.innerHTML =
    '<div class="big">47 × 23</div><div style="text-align:center;color:#777">sheet page</div>';
  return page;
};

let current: HTMLElement = makeList();
mount.append(current);
context.register("/list", current);

const frames = async (count = 1) => {
  for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};

type Sample = {
  t: number;
  scrollTop: number;
  navTop: number | null;
  navBottom: number | null;
  listPosition: string | null;
  listTransform: string;
  /** Uniform scale of the list page (1 when untransformed). */
  listScale: number;
};

let clockStart: number | null = null;
(function tickClock() {
  clock.textContent =
    clockStart == null
      ? "idle"
      : `${((performance.now() - clockStart) / 1000).toFixed(2)}s`;
  requestAnimationFrame(tickClock);
})();

const sample = (t0: number): Sample => {
  const nav = document.querySelector<HTMLElement>("#nav");
  const sceneRect = scene.getBoundingClientRect();
  const list = mount.querySelector<HTMLElement>(".list");
  let navTop: number | null = null;
  let navBottom: number | null = null;
  if (nav) {
    const rect = nav.getBoundingClientRect();
    navTop = Math.round(rect.top - sceneRect.top);
    navBottom = Math.round(rect.bottom - sceneRect.top);
  }
  const style = list ? getComputedStyle(list) : null;
  const listTransform = style?.transform ?? "none";
  return {
    t: Math.round(performance.now() - t0),
    scrollTop: Math.round(scene.scrollTop),
    navTop,
    navBottom,
    listPosition: style?.position ?? null,
    listTransform,
    listScale:
      listTransform === "none" ? 1 : new DOMMatrixReadOnly(listTransform).a,
  };
};

// Sample every frame until `stop()`; `onFrame` runs after each sample.
const record = (t0: number, onFrame?: () => void) => {
  const samples: Sample[] = [];
  let done = false;
  const tick = () => {
    samples.push(sample(t0));
    onFrame?.();
    if (!done) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return {
    samples,
    stop: () => {
      done = true;
    },
  };
};

// Navigate like a router with unmount-mode pages: push/pop history so the
// navigation detector sees the direction, remove the old node, mount the new.
const navigate = async (to: "/list" | "/sheet", back: boolean) => {
  if (back) history.back();
  else history.pushState(null, "", `#${to}`);
  // Let popstate/pushstate settle before the DOM swap, like a router would.
  await new Promise((resolve) => setTimeout(resolve, 0));
  const next = to === "/list" ? makeList() : makeSheet();
  current.remove();
  mount.append(next);
  context.register(to, next);
  current = next;
};

const slowDown = () => {
  if (slow <= 1) return;
  for (const animation of document.getAnimations()) {
    if (animation.playbackRate === 1) animation.playbackRate = 1 / slow;
  }
};

const openSheet = async (): Promise<Sample[]> => {
  scene.scrollTo({ top: savedScroll, behavior: "instant" });
  // The scroll listener records the position on the next frame; give it a
  // few so the saved /list scroll is what the exit restores to.
  await frames(4);
  const t0 = performance.now();
  clockStart = t0;
  const recording = record(t0);
  await navigate("/sheet", false);
  // The entry runs at native speed; only the exit is slowed for eyeballing.
  await new Promise((resolve) => setTimeout(resolve, 1500));
  recording.stop();
  clockStart = null;
  out.textContent = `sheet open · list scroll was ${savedScroll}`;
  return recording.samples;
};

const closeSheet = async (): Promise<Sample[]> => {
  const t0 = performance.now();
  clockStart = t0;
  const recording = record(t0, slowDown);
  const samples = recording.samples;
  await navigate("/list", true);
  await new Promise((resolve) => setTimeout(resolve, 1500 * slow));
  recording.stop();
  clockStart = null;
  const withNav = samples.filter((s) => s.navBottom != null);
  const viewport = scene.clientHeight;
  const min = Math.min(...withNav.map((s) => s.navBottom!));
  const max = Math.max(...withNav.map((s) => s.navBottom!));
  out.textContent = `closed · navBottom ${min}..${max} (viewport ${viewport}) · first ${JSON.stringify(withNav[0])}`;
  return samples;
};

const sheetHarness = { openSheet, closeSheet, frames, scene, context, sample };
declare global {
  interface Window {
    sheetHarness: typeof sheetHarness;
  }
}
window.sheetHarness = sheetHarness;
document.querySelector("#open")!.addEventListener("click", () => {
  void openSheet();
});
document.querySelector("#close")!.addEventListener("click", () => {
  void closeSheet();
});

// The first registration suppresses scroll capture for its settle window
// (10 frames); wait it out so the scroll below is recorded.
await frames(14);
document.title = "SSGOI sheet sticky — ready";
if (params.has("auto")) {
  await openSheet();
  await new Promise((resolve) => setTimeout(resolve, 800));
  await closeSheet();
}
