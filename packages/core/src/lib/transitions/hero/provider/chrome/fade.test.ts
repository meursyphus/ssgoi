import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFadeChromeStrategy } from "./fade";
import type { HeroContributeCtx } from "../../types";

vi.mock("../../../../animation", () => ({
  IntegratorProvider: { from: () => ({}) },
  WebAnimation: class {
    constructor(public options: unknown) {}
  },
}));

class Element {
  style = { opacity: "", willChange: "", backgroundColor: "" };
  computedBackground = "rgba(0, 0, 0, 0)";
  computedOpacity = "1";
  parentElement: Element | null = null;
  constructor(
    public tagName = "DIV",
    public children: Element[] = [],
  ) {
    for (const child of children) child.parentElement = this;
  }
}

function run(from: Element, to: Element, visuals: Element[]) {
  const cleanup: (() => void)[] = [];
  const groups = createFadeChromeStrategy().contribute!({
    from,
    to,
    resolved: { pairs: visuals.map((toEl) => ({ toEl })) },
    physics: { spring: { stiffness: 300, damping: 30 } },
    onComplete: (fn: () => void) => cleanup.push(fn),
  } as unknown as HeroContributeCtx);
  const tracks = (name: "in" | "out") =>
    (groups[name] ?? []).map(
      (animation) =>
        (
          animation as unknown as {
            options: {
              element: Element;
              style: (
                t: number,
                u: number,
              ) => { opacity?: number; backgroundColor?: string };
            };
          }
        ).options,
    );
  return {
    incoming: tracks("in"),
    outgoing: tracks("out"),
    cleanup: () => cleanup.forEach((fn) => fn()),
  };
}

beforeEach(() => {
  vi.stubGlobal("HTMLElement", Element);
  vi.stubGlobal("getComputedStyle", (el: Element) => ({
    opacity: el.computedOpacity,
    backgroundColor: el.computedBackground,
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe("hero fade incoming content", () => {
  it("fades the whole destination if geometry filtering leaves no animated visual", () => {
    const to = new Element("MAIN", [new Element("IMG")]);
    const result = run(new Element(), to, []);
    expect(result.incoming.map((track) => track.element)).toEqual([to]);
    expect(to.style.opacity).toBe("0");
    expect(result.incoming[0]!.style(0.5, 0.5)).toEqual({ opacity: 0.5 });
    result.cleanup();
    expect(to.style.opacity).toBe("");
  });

  it("fades ancestor surface colors without applying opacity to the image's page", () => {
    const image = new Element("IMG");
    const gallery = new Element("DIV", [image]);
    gallery.computedBackground = "rgb(200, 210, 220)";
    const body = new Element("ARTICLE");
    const to = new Element("MAIN", [gallery, body]);
    to.computedBackground = "rgb(255, 255, 255)";
    const result = run(new Element(), to, [gallery]);

    expect([
      to.style.opacity,
      gallery.style.opacity,
      image.style.opacity,
    ]).toEqual(["", "", ""]);
    expect([to.style.backgroundColor, gallery.style.backgroundColor]).toEqual([
      "transparent",
      "transparent",
    ]);
    expect(result.incoming.map((track) => track.style(0.5, 0.5))).toEqual([
      { opacity: 0.5 },
      {
        backgroundColor:
          "color-mix(in srgb, rgb(200, 210, 220) 50%, transparent)",
      },
      {
        backgroundColor:
          "color-mix(in srgb, rgb(255, 255, 255) 50%, transparent)",
      },
    ]);
    result.cleanup();
    expect([to.style.backgroundColor, gallery.style.backgroundColor]).toEqual([
      "",
      "",
    ]);
  });

  it("fades gallery controls and nested content while excluding the shared image and ancestors", () => {
    const image = new Element("IMG");
    const control = new Element("BUTTON");
    const gallery = new Element("DIV", [image, control]);
    const body = new Element("ARTICLE", [new Element("H1")]);
    const content = new Element("DIV", [gallery, body]);
    const header = new Element("HEADER");
    const from = new Element();
    const to = new Element("MAIN", [header, content]);
    const result = run(from, to, [gallery]);

    expect(result.incoming.map((track) => track.element)).toEqual([
      header,
      control,
      body,
    ]);
    expect([
      header.style.opacity,
      control.style.opacity,
      body.style.opacity,
    ]).toEqual(["0", "0", "0"]);
    expect([
      image.style.opacity,
      gallery.style.opacity,
      content.style.opacity,
    ]).toEqual(["", "", ""]);
    expect(
      result.incoming.map((track) => track.style(0.5, 0.5).opacity),
    ).toEqual([0.5, 0.5, 0.5]);
    expect(result.outgoing[0]!.style(0.5, 0.5).opacity).toBe(0.5);
    result.cleanup();
    expect([
      to.style.opacity,
      body.style.opacity,
      body.style.willChange,
    ]).toEqual(["", "", ""]);
  });

  it("excludes all shared visuals without fading nested content twice", () => {
    const first = new Element("IMG");
    const second = new Element("IMG");
    const caption = new Element("P");
    const secondCard = new Element("DIV", [second, caption]);
    const sharedRow = new Element("DIV", [first, secondCard]);
    const body = new Element("ARTICLE", [new Element("P")]);
    const to = new Element("MAIN", [sharedRow, body]);
    const result = run(new Element(), to, [first, second]);

    expect(result.incoming.map((track) => track.element)).toEqual([
      caption,
      body,
    ]);
    expect([
      first.style.opacity,
      second.style.opacity,
      sharedRow.style.opacity,
      secondCard.style.opacity,
    ]).toEqual(["", "", "", ""]);
  });

  it("preserves CSS opacity and restores inline styles after completion", () => {
    const image = new Element("IMG");
    const caption = new Element("P");
    caption.style = {
      opacity: "0.6",
      willChange: "transform",
      backgroundColor: "",
    };
    caption.computedOpacity = "0.6";
    const hidden = new Element("DIV");
    hidden.computedOpacity = "0";
    const to = new Element("MAIN", [image, caption, hidden]);
    to.style = { opacity: "0.9", willChange: "contents", backgroundColor: "" };
    const from = new Element();
    from.style = {
      opacity: "0.8",
      willChange: "transform",
      backgroundColor: "",
    };
    const result = run(from, to, [image]);

    expect(result.incoming[0]!.style(0.5, 0.5).opacity).toBe(0.3);
    expect(result.incoming[0]!.style(1.05, -0.05).opacity).toBe(0.6);
    expect(result.incoming[0]!.style(-0.05, 1.05).opacity).toBe(0);
    expect(result.incoming[1]!.style(1, 0).opacity).toBe(0);
    result.cleanup();
    expect(caption.style).toEqual({
      opacity: "0.6",
      willChange: "transform",
      backgroundColor: "",
    });
    expect(from.style).toEqual({
      opacity: "0.8",
      willChange: "transform",
      backgroundColor: "",
    });
    expect(to.style).toEqual({
      opacity: "0.9",
      willChange: "contents",
      backgroundColor: "",
    });
    expect(hidden.style.opacity).toBe("");
  });

  it("fades the incoming list on back navigation, including its other cards", () => {
    const detailImage = new Element("IMG");
    const detailBody = new Element("ARTICLE");
    const detail = new Element("MAIN", [detailImage, detailBody]);
    const listImage = new Element("IMG");
    const otherCard = new Element("A", [new Element("IMG")]);
    const list = new Element("MAIN", [listImage, otherCard]);
    const result = run(detail, list, [listImage]);

    expect(result.incoming.map((track) => track.element)).toEqual([otherCard]);
    expect(otherCard.style.opacity).toBe("0");
    expect(detailBody.style.opacity).toBe("");
    expect(listImage.style.opacity).toBe("");
  });

  it("keeps an entire non-image shared element out of the content fade", () => {
    const sharedCard = new Element("SECTION", [
      new Element("H2"),
      new Element("P"),
    ]);
    const body = new Element("ARTICLE");
    const to = new Element("MAIN", [sharedCard, body]);
    const result = run(new Element(), to, [sharedCard]);

    expect(result.incoming.map((track) => track.element)).toEqual([body]);
    expect(sharedCard.children.map((child) => child.style.opacity)).toEqual([
      "",
      "",
    ]);
  });
});
