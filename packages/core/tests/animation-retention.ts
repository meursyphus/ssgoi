/// <reference lib="es2021.weakref" />
import { WebAnimation } from "../src/lib/animation/web-animation";
import { HostAnimation } from "../src/lib/animation/host-animation";
import { createSggoiTransitionContext } from "../src/lib/ssgoi-transition/create-ssgoi-transition-context";
import { fade } from "../src/lib/transitions/fade/transition";
import type { Integrator } from "../src/lib/animation/integrator";

type Mode =
  | "none"
  | "raw"
  | "raw-cleared"
  | "raw-released"
  | "driver"
  | "context";
const params = new URLSearchParams(location.search);
const mode = (params.get("mode") ?? "context") as Mode;
const interrupted = params.has("interrupted");
const scene = document.querySelector<HTMLElement>("#scene")!;
const nodes: WeakRef<Node>[] = [];
const pages: WeakRef<HTMLElement>[] = [];
const animations: WeakRef<globalThis.Animation>[] = [];
let serial = 0;
let interruptions = 0;

// Weakly observe every native animation, including ones created by presets.
// DOM wrapper collection alone does not prove that the native effect released
// its target: WebKit can recreate a wrapper through animation.effect.target.
const animate = Element.prototype.animate;
Element.prototype.animate = function (...args) {
  const animation = animate.apply(this, args);
  animations.push(new WeakRef(animation));
  return animation;
};

const frames = async (count = 3) => {
  for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};

function makePage() {
  const page = document.createElement("article");
  page.setAttribute("data-ssgoi-transition", `/page-${serial++}`);
  // 257 nodes per page. Only WeakRefs to departing pages survive this task.
  for (let i = 0; i < 128; i++) {
    const child = document.createElement("span");
    child.textContent = `Item ${i}`;
    page.append(child);
  }
  return page;
}

function track(page: HTMLElement) {
  pages.push(new WeakRef(page));
  nodes.push(new WeakRef(page));
  const walker = document.createTreeWalker(page, NodeFilter.SHOW_ALL);
  while (walker.nextNode()) nodes.push(new WeakRef(walker.currentNode));
}

const integrator: Integrator = {
  step(state, target, dt) {
    const position = Math.min(target, state.position + dt * 10);
    return { position, velocity: position === target ? 0 : 10 };
  },
  isSettled: (state, target) => state.position === target,
};

// This path isolates the browser from SSGOI. The handler captures its target,
// just as WebAnimation's handler captures the driver containing its element.
async function raw(page: HTMLElement) {
  const animation = page.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 100,
    fill: "both",
  });
  animation.onfinish = () => {
    if (mode !== "raw") animation.onfinish = null;
    page.style.opacity = "0";
    animation.cancel();
    if (mode === "raw-released") animation.effect = null;
  };
  if (interrupted) {
    await frames(2);
    if (mode !== "raw") animation.onfinish = null;
    animation.cancel();
    if (mode === "raw-released") animation.effect = null;
  } else {
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  page.remove();
}

async function driver(page: HTMLElement) {
  const animation = new WebAnimation({
    element: page,
    integrator,
    style: (t) => ({ opacity: 1 - t }),
  });
  animation.play();
  if (interrupted) {
    await frames(2);
    animation.cancel({ reason: "disposed", owns: () => true });
  } else {
    while (animation.isAnimating) await frames(1);
  }
  page.remove();
}

const host = new HostAnimation();
host.playbackRate = 4;
const context =
  mode === "context"
    ? createSggoiTransitionContext(
        { transitions: [{ on: "/**", transition: fade() }] },
        { host },
      )
    : null;
let current = makePage();
scene.append(current);
context?.register(current.getAttribute("data-ssgoi-transition")!, current);
await frames(12);

function navigate() {
  track(current);
  current.remove();
  current = makePage();
  scene.append(current);
  context!.register(current.getAttribute("data-ssgoi-transition")!, current);
}

async function cycle() {
  if (context) {
    navigate();
    await frames(3);
    if (interrupted) {
      if (!host.activeChild)
        throw new Error("Expected an in-flight transition");
      interruptions++;
      navigate();
      await frames(3);
    }
    while (host.activeChild || host.retiringCount) await frames(1);
  } else {
    const page = current;
    track(page);
    if (mode === "raw" || mode === "raw-cleared" || mode === "raw-released")
      await raw(page);
    else if (mode === "driver") await driver(page);
    else page.remove();
    current = makePage();
    scene.append(current);
  }
  await frames(3);
}

function measure() {
  let detached = 0;
  for (const ref of nodes) {
    const node = ref.deref();
    if (node && !node.isConnected) detached++;
  }
  return {
    tracked: nodes.length,
    detached,
    retainedPages: pages.flatMap((ref, index) => {
      const page = ref.deref();
      return page && !page.isConnected ? [index] : [];
    }),
    departedPages: pages.length,
    interruptions,
    liveAnimations: animations.filter((ref) => ref.deref()).length,
    detachedEffectTargets: animations.filter((ref) => {
      const effect = ref.deref()?.effect as KeyframeEffect | null | undefined;
      return effect?.target && !effect.target.isConnected;
    }).length,
    attachedPages: scene.children.length,
    activeAnimations: scene.getAnimations({ subtree: true }).length,
  };
}

const harness = { cycle, measure };
declare global {
  interface Window {
    animationRetention: typeof harness;
  }
}
window.animationRetention = harness;
document.title = "Animation retention — ready";
