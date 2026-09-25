import { createSggoiTransitionContext } from "../src/lib/ssgoi-transition/create-ssgoi-transition-context";
import { HostAnimation } from "../src/lib/animation/host-animation";
import { fade } from "../src/lib/transitions/fade/transition";
import { jaemin } from "../src/lib/transitions/jaemin/transition";

// ?wrapped   give the inner boundary its own positioned parent (the workaround)
// ?hidden    Activity-style display toggles instead of unmount/mount
// ?jaemin    an effect whose prepare pins the incoming page position:fixed
const params = new URLSearchParams(location.search);
const hidden = params.has("hidden");
const content = document.querySelector<HTMLElement>("#content")!;
if (params.has("wrapped")) content.classList.add("wrapped");
// Without the wrapper the pages sit directly in the flex column, like the
// issue's `<div key={tab}>` between the app bar and the bottom nav.
const slot = params.has("wrapped") ? content : content.parentElement!;
const anchor = params.has("wrapped") ? null : content;

const host = new HostAnimation();
host.pause();
const context = createSggoiTransitionContext(
  {
    transitions: [
      {
        on: "/**",
        transition: params.has("jaemin") ? jaemin() : fade(),
        preserveScroll: { from: true, to: false },
      },
    ],
  },
  { host },
);
const frames = async (count = 15) => {
  for (let i = 0; i < count; i++) await new Promise(requestAnimationFrame);
};
const makePage = (name: string) => {
  const page = document.createElement("section");
  page.className = `page ${name}`;
  page.setAttribute("data-ssgoi-transition", `/${name}`);
  page.innerHTML = `<h1>${name} page</h1>`;
  return page;
};
let current = makePage("a");
slot.insertBefore(current, anchor);
context.register("/a", current);
let cached: HTMLElement | undefined;
if (hidden) {
  cached = makePage("b");
  cached.style.setProperty("display", "none", "important");
  slot.insertBefore(cached, anchor);
  context.register("/b", cached);
}

const top = (element: Element) => element.getBoundingClientRect().top;

/** Navigates and reports where both pages sit while the transition holds. */
async function navigate() {
  const outgoing = current;
  const before = top(outgoing);
  const name = outgoing.classList.contains("a") ? "b" : "a";
  const next = cached ?? makePage(name);
  if (hidden) {
    outgoing.style.setProperty("display", "none", "important");
    next.style.removeProperty("display");
    cached = outgoing;
  } else {
    // A keyed swap: the new page is inserted where the old one was.
    slot.insertBefore(next, outgoing);
    outgoing.remove();
    context.register(`/${name}`, next);
  }
  current = next;
  await frames();
  return {
    active: !!host.activeChild,
    scrollY: document.documentElement.scrollTop,
    barBottom: document.querySelector("#bar")!.getBoundingClientRect().bottom,
    outgoing: {
      before,
      during: top(outgoing),
      position: getComputedStyle(outgoing).position,
      connected: outgoing.isConnected,
    },
    incoming: { top: next.style.position === "fixed" ? null : top(next) },
  };
}
async function finish() {
  host.complete();
  await frames();
}
async function scrollTo(y: number) {
  document.documentElement.scrollTo({ top: y, behavior: "instant" });
  await frames(2);
  return document.documentElement.scrollTop;
}

const harness = { navigate, finish, scrollTo, frames, host };
declare global {
  interface Window {
    harness: typeof harness;
  }
}
window.harness = harness;
await frames();
document.title = "SSGOI nested boundary placement — ready";
