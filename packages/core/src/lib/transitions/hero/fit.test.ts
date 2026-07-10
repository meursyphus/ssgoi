import { describe, expect, it } from "vitest";
import { createMediaGeometry } from "../media-geometry";
import { fallbackHeroFit, type HeroEndpoint } from "./fit";
import {
  normalizeHeroGeometryPair,
  resolveNewStylePairs,
  shouldResetHeroCloneRadius,
} from "./transition";

function element(attributes: Record<string, string>): HTMLElement {
  return {
    getAttribute(name: string) {
      return attributes[name] ?? null;
    },
  } as HTMLElement;
}

function page(elements: HTMLElement[]): HTMLElement {
  return {
    querySelectorAll(selector: string) {
      const attribute = selector.slice(1, -1);
      return elements.filter((el) => el.getAttribute(attribute) !== null);
    },
  } as unknown as HTMLElement;
}

describe("hero fit inference", () => {
  it.each<[HeroEndpoint, "contain" | "cover"]>([
    ["enter", "contain"],
    ["exit", "cover"],
    ["legacy", "contain"],
  ])("infers %s endpoints as %s", (endpoint, expected) => {
    expect(fallbackHeroFit(endpoint)).toBe(expected);
  });

  it("preserves semantic defaults for a forward exit-to-enter pair", () => {
    const exitEl = element({ "data-hero-exit-key": "photo" });
    const enterEl = element({ "data-hero-enter-key": "photo" });

    expect(resolveNewStylePairs(page([exitEl]), page([enterEl]))).toEqual([
      {
        key: "photo",
        fromEl: exitEl,
        toEl: enterEl,
        fromFit: "cover",
        toFit: "contain",
      },
    ]);
  });

  it("preserves semantic fit defaults for a reverse enter-to-exit pair", () => {
    const enterEl = element({ "data-hero-enter-key": "photo" });
    const exitEl = element({ "data-hero-exit-key": "photo" });

    expect(resolveNewStylePairs(page([enterEl]), page([exitEl]))).toEqual([
      {
        key: "photo",
        fromEl: enterEl,
        toEl: exitEl,
        fromFit: "contain",
        toFit: "cover",
      },
    ]);
  });

  it("falls back both endpoints when only one resolves media geometry", () => {
    const bbox = { left: 0, top: 0, width: 100, height: 100 };
    const media = createMediaGeometry(bbox, 2, "cover");
    const visual = element({});
    media.mediaElement = visual;
    media.radius = 12;
    media.radiusSource = "computed";
    media.bboxRadius = 0;
    media.bboxRadiusSource = "none";
    const unresolved = createMediaGeometry(bbox, null, null);
    const [from, to] = normalizeHeroGeometryPair(media, unresolved);

    expect(from.content).toBe(from.bbox);
    expect(to.content).toBe(to.bbox);
    expect(from.contentAware).toBe(false);
    expect(to.contentAware).toBe(false);
    expect(from.mediaElement).toBeNull();
    expect(from.radius).toBe(0);
  });

  it("falls back both endpoints when intrinsic ratios differ", () => {
    const bbox = { left: 0, top: 0, width: 100, height: 100 };
    const [from, to] = normalizeHeroGeometryPair(
      createMediaGeometry(bbox, 2, "cover"),
      createMediaGeometry(bbox, 1, "contain"),
    );

    expect(from.content).toBe(from.bbox);
    expect(to.content).toBe(to.bbox);
  });

  it("strips native image radius when the clone is resized to contained content", () => {
    const bbox = { left: 0, top: 0, width: 100, height: 100 };
    const from = createMediaGeometry(bbox, 2, "contain");
    const to = createMediaGeometry(bbox, 2, "contain");
    from.mediaElement = element({});
    to.mediaElement = element({});
    from.bboxRadius = 12;
    to.bboxRadius = 12;
    from.bboxRadiusSource = "computed";
    to.bboxRadiusSource = "computed";

    expect(shouldResetHeroCloneRadius(from, to)).toBe(true);
  });

  it("preserves native CSS radius for unsupported bbox fallback", () => {
    const bbox = { left: 0, top: 0, width: 100, height: 100 };
    const from = createMediaGeometry(bbox, null, null);
    const to = createMediaGeometry(bbox, null, null);
    from.radiusSource = "unsupported";

    expect(shouldResetHeroCloneRadius(from, to)).toBe(false);
  });
});
