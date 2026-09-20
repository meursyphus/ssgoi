import { createSggoiTransitionContext } from "../src/lib/ssgoi-transition/create-ssgoi-transition-context";
import { isScrollLocked } from "../src/lib/utils/scroll-lock";
import { HostAnimation } from "../src/lib/animation/host-animation";
import { fade } from "../src/lib/transitions/fade/transition";

const params = new URLSearchParams(location.search);
const scene = document.querySelector<HTMLElement>("#scene")!;
const custom = params.has("custom");
const hidden = params.has("hidden");
if (custom) scene.classList.add("custom");
const scroller = custom ? scene : document.documentElement;
const host = new HostAnimation();
host.pause();
const context = createSggoiTransitionContext(
  {
    scrollLock: !params.has("unlocked"),
    transitions: [
      {
        on: "/**",
        transition: fade(),
        preserveScroll: { from: true, to: true },
      },
    ],
  },
  { host },
);
const frames = async (count = 15) => {
  for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};
const makePage = (name: string) => {
  const page = document.createElement("article");
  page.className = `page ${name}`;
  page.setAttribute("data-ssgoi-transition", `/${name}`);
  page.innerHTML = `<h1>${name} page</h1><p>Transition scroll regression fixture</p>`;
  return page;
};
let current = makePage("long");
scene.append(current);
context.register("/long", current);
let cached: HTMLElement | undefined;
if (hidden) {
  cached = makePage("short");
  cached.style.setProperty("display", "none", "important");
  scene.append(cached);
  context.register("/short", cached);
}
async function navigate() {
  const name = current.classList.contains("long") ? "short" : "long";
  const next = cached ?? makePage(name);
  if (hidden) {
    current.style.setProperty("display", "none", "important");
    next.style.removeProperty("display");
    cached = current;
  } else {
    current.remove();
    scene.append(next);
    context.register(`/${name}`, next);
  }
  current = next;
  await frames();
  return state();
}
function state() {
  return {
    x: scroller.scrollLeft,
    y: scroller.scrollTop,
    height: scroller.scrollHeight,
    viewport: scroller.clientHeight,
    locked: isScrollLocked(scroller),
    scrollStyles: [scroller, document.documentElement, document.body].map(
      (element) => ({
        inline: element.style.cssText,
        overflow: getComputedStyle(element).overflow,
        gutter: getComputedStyle(element).scrollbarGutter,
        scrollbarWidth: getComputedStyle(element).scrollbarWidth,
      }),
    ),
    active: !!host.activeChild,
    pages: scene.querySelectorAll(".page").length,
    width: current.getBoundingClientRect().width,
    current: current.className,
  };
}
async function finish() {
  host.complete();
  await frames();
  return state();
}
const harness = { navigate, finish, state, frames, host, context, scroller };
declare global {
  interface Window {
    harness: typeof harness;
  }
}
window.harness = harness;
document.querySelector("#go")!.addEventListener("click", navigate);
document.querySelector("#finish")!.addEventListener("click", finish);
document
  .querySelector("#disconnect")!
  .addEventListener("click", () => context.disconnect?.());
await frames();
scroller.scrollTo({ top: 600, behavior: "instant" });
await frames(2);
document.title = "SSGOI scroll lock regression — ready";
