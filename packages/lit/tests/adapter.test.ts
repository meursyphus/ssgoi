import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { LitElement, html, nothing, render } from "lit";
import { ref } from "lit/directives/ref.js";
import { keyed } from "lit/directives/keyed.js";
import { Animation, HostAnimation } from "@ssgoi/core/internal";
import type { SsgoiConfig } from "@ssgoi/core";
import { SsgoiController, animate } from "../src/index";

class HeldAnimation extends Animation {
  private done = false;
  play = vi.fn();
  pause(): void {}
  reverse(): void {}
  complete(): void {
    this.done = true;
    this.onComplete?.();
  }
  getPose() {
    return [];
  }
  getTimeline() {
    return [];
  }
  matchInto(): void {}
  get isAnimating() {
    return !this.done;
  }
  get isPaused() {
    return false;
  }
  get isComplete() {
    return this.done;
  }
  get isReversing() {
    return false;
  }
  get progress() {
    return 0;
  }
  findTimeForProgress() {
    return null;
  }
}

const runs: HeldAnimation[] = [];
const config: SsgoiConfig = {
  transitions: [
    {
      on: "/**",
      transition: {
        animation: () => {
          const run = new HeldAnimation();
          runs.push(run);
          return run;
        },
      },
    },
  ],
};

class TestApp extends LitElement {
  static properties = { page: { state: true } };
  declare page: string;
  playback = new HostAnimation();
  ssgoi = new SsgoiController(this, config, { host: this.playback });
  constructor() {
    super();
    this.page = "/one";
    this.playback.pause();
  }
  override createRenderRoot() {
    return this;
  }
  override render() {
    return html`<main style="position:relative" ${ref(this.ssgoi.ref)}>
      <output>${this.ssgoi.state.status}</output>
      ${keyed(
        this.page,
        html`<article data-ssgoi-transition=${this.page}>
          ${this.page}
        </article>`,
      )}
    </main>`;
  }
}
customElements.define("ssgoi-lit-test", TestApp);
let app: TestApp;
const settle = async () => {
  for (let i = 0; i < 30; i++) await Promise.resolve();
  await app.updateComplete;
};
beforeEach(async () => {
  Element.prototype.scrollTo ??= () => {};
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  runs.length = 0;
  app = document.createElement("ssgoi-lit-test") as TestApp;
  document.body.append(app);
  await settle();
});
afterEach(() => {
  app.remove();
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

it("pairs keyed route removal and insertion and reacts through completion", async () => {
  expect(app.ssgoi.state.status).toBe("idle");
  const outgoing = app.querySelector("article")!;
  app.page = "/two";
  await settle();
  expect(outgoing.isConnected).toBe(true);
  expect(outgoing.textContent?.trim()).toBe("/one");
  expect(runs).toHaveLength(1);
  expect(app.ssgoi.state).toMatchObject({
    status: "transitioning",
    from: "/one",
    to: "/two",
  });
  expect(app.querySelector("output")?.textContent).toBe("transitioning");
  app.playback.complete();
  await settle();
  expect(app.querySelector("output")?.textContent).toBe("idle");
  expect(outgoing.isConnected).toBe(false);
  app.page = "/three";
  await settle();
  expect(runs).toHaveLength(2);
  expect(app.ssgoi.state).toMatchObject({ from: "/two", to: "/three" });
  app.playback.complete();
  await settle();
  expect(app.querySelectorAll("article")).toHaveLength(1);
  expect(app.querySelector("article")?.textContent?.trim()).toBe("/three");
});

it("disconnects active work and reconnects without duplicate navigation", async () => {
  app.page = "/two";
  await settle();
  app.remove();
  await settle();
  expect(app.ssgoi.state.status).toBe("idle");
  document.body.append(app);
  await settle();
  app.page = "/three";
  await settle();
  expect(runs).toHaveLength(2);
  expect(app.ssgoi.state).toMatchObject({ from: "/two", to: "/three" });
});

it("replaces config on the same root and releases the previous run", async () => {
  app.page = "/two";
  await settle();
  const root = app.querySelector("main");
  app.ssgoi.setConfig({ transitions: [] });
  await settle();
  expect(app.ssgoi.state.status).toBe("idle");
  app.page = "/three";
  await settle();
  expect(app.querySelector("main")).toBe(root);
  expect(runs).toHaveLength(1);
  expect(app.ssgoi.state.status).toBe("idle");
});

it("rejects shadow-root page boundaries with an actionable error", () => {
  const owner = {
    addController: vi.fn(),
    requestUpdate: vi.fn(),
    updateComplete: Promise.resolve(true),
  };
  const controller = new SsgoiController(owner, config);
  const host = document.createElement("div");
  const root = document.createElement("main");
  host.attachShadow({ mode: "open" }).append(root);
  document.body.append(host);
  controller.ref(root);
  controller.hostConnected();
  expect(() => controller.hostUpdated()).toThrow("light-DOM root");
  controller.hostDisconnected();
});

it("defers element playback until commit, cleans up, and restarts after reconnection", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const made: HeldAnimation[] = [];
  const factory = vi.fn((element: HTMLElement) => {
    expect(element.isConnected).toBe(true);
    expect(element.textContent).toBe("Ready");
    const run = new HeldAnimation();
    vi.spyOn(run, "cancel");
    made.push(run);
    return run;
  });
  const part = render(html`<p ${animate(factory)}>Ready</p>`, container);
  expect(factory).not.toHaveBeenCalled();
  await Promise.resolve();
  expect(made[0].play).toHaveBeenCalledOnce();
  part.setConnected(false);
  expect(made[0].cancel).toHaveBeenCalledOnce();
  part.setConnected(true);
  await Promise.resolve();
  expect(made).toHaveLength(2);
  render(nothing, container);
  expect(made[1].cancel).toHaveBeenCalledOnce();
});

it("does not create an animation if removed before deferred playback", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const factory = vi.fn(() => new HeldAnimation());
  render(html`<p ${animate(factory)}>Ready</p>`, container);
  render(nothing, container);
  await Promise.resolve();
  expect(factory).not.toHaveBeenCalled();
});

it("replaces element factories and cancels the previous animation once", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const first = new HeldAnimation();
  const second = new HeldAnimation();
  const cancel = vi.spyOn(first, "cancel");
  const firstFactory = () => first;
  const secondFactory = () => second;
  const view = (factory: () => HeldAnimation) =>
    html`<p ${animate(factory)}>Ready</p>`;
  render(view(firstFactory), container);
  await Promise.resolve();
  render(view(firstFactory), container);
  await Promise.resolve();
  expect(first.play).toHaveBeenCalledOnce();
  render(view(secondFactory), container);
  await Promise.resolve();
  expect(cancel).toHaveBeenCalledOnce();
  expect(second.play).toHaveBeenCalledOnce();
  render(nothing, container);
});
