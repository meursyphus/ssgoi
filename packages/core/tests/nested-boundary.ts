import { createSggoiTransitionContext } from "../src/lib/ssgoi-transition/create-ssgoi-transition-context";
import { observeSsgoiTransitions } from "../src/lib/ssgoi-transition/observe-ssgoi-transitions";
import { HostAnimation } from "../src/lib/animation/host-animation";
import { fade } from "../src/lib/transitions/fade/transition";

// A profile-style layout: an outer boundary "/a" around a nested tab boundary
// whose default tab also resolves to "/a" (the docs Instagram demo's profile
// grid). Routes are committed the way React commits them and the real
// observer registers every boundary, so arrivals reach the context in the
// same batches an app produces.
//  ?hidden    Activity: leaving routes are hidden, not unmounted.
//  ?streamed  The default tab mounts in a later commit than its layout (a
//             Suspense reveal), so its IN is a late duplicate of the layout's.
const params = new URLSearchParams(location.search);
const hidden = params.has("hidden");
const streamed = params.has("streamed");

const scene = document.querySelector<HTMLElement>("#scene")!;
const log = document.querySelector<HTMLOutputElement>("#log")!;
const host = new HostAnimation();

const runs: string[] = [];
const base = fade();
const recorded: typeof base = {
  ...base,
  animation(args) {
    runs.push(`${args.from.dataset.name} → ${args.to.dataset.name}`);
    log.value = runs.join(", ");
    return base.animation(args);
  },
};
const context = createSggoiTransitionContext(
  { transitions: [{ on: "/**", transition: recorded }] },
  { host },
);

function boundary(name: string, id: string, ...children: HTMLElement[]) {
  const element = document.createElement("div");
  element.dataset.name = name;
  element.setAttribute("data-ssgoi-transition", id);
  element.append(name, ...children);
  return element;
}

// One commit: the old route leaves (unmount, or Activity hide) and the new
// one mounts, or is revealed if Activity kept it.
function commit(from: HTMLElement, to: HTMLElement, parent: HTMLElement) {
  if (hidden) from.style.setProperty("display", "none", "important");
  else from.remove();
  if (to.isConnected) to.style.removeProperty("display");
  else parent.append(to);
}

const frames = async (count = 3) => {
  for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};

const home = boundary("home", "/home");
scene.append(home);
observeSsgoiTransitions(scene, context);

let slot = document.createElement("div");
let layout = boundary("layout", "/a", slot);
let grid = boundary("grid", "/a");
const reels = boundary("reels", "/a/x");
const b = boundary("b", "/b");

const steps = {
  async enter() {
    if (!streamed) slot.append(grid);
    commit(home, layout, scene);
    if (streamed) {
      await frames();
      slot.append(grid);
    }
  },
  tab: () => commit(grid, reels, slot),
  leave: () => commit(layout, b, scene),
  back() {
    if (!hidden) {
      // A fresh layout, back on its default tab.
      slot = document.createElement("div");
      grid = boundary("grid", "/a");
      slot.append(grid);
      layout = boundary("layout", "/a", slot);
    }
    commit(b, layout, scene);
  },
};

type Step = keyof typeof steps;

/** Run one step, settle its transition, and report every run so far. */
async function step(name: Step) {
  await steps[name]();
  await frames();
  host.complete();
  await frames();
  return [...runs];
}

const order = Object.keys(steps) as Step[];
let next = 0;
document.querySelector("#step")!.addEventListener("click", () => {
  const name = order[next++];
  if (name) void step(name);
});

const harness = { step };
declare global {
  interface Window {
    nestedBoundary: typeof harness;
  }
}
window.nestedBoundary = harness;
await frames();
document.title = "SSGOI nested boundary regression — ready";
