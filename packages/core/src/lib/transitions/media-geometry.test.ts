import { describe, expect, it } from "vitest";
import {
  createMediaGeometry,
  findMediaElement,
  normalizeMediaGeometryPair,
  projectedWindowRect,
  resolveElementMediaGeometry,
  type ElementMediaGeometryOptions,
  type MediaRect,
} from "./media-geometry";

function rect(left: number, top: number, width: number, height: number) {
  return { left, top, width, height };
}

function element({
  attributes = {},
  children = [],
  objectFit = "",
  objectPosition = "",
  overflow = "visible",
  radius = "0px",
  tagName = "IMG",
  naturalWidth = 0,
  naturalHeight = 0,
}: {
  attributes?: Record<string, string>;
  children?: HTMLElement[];
  objectFit?: string;
  objectPosition?: string;
  overflow?: string;
  radius?: string;
  tagName?: string;
  naturalWidth?: number;
  naturalHeight?: number;
} = {}): HTMLElement {
  return {
    tagName,
    naturalWidth,
    naturalHeight,
    children,
    style: {
      objectFit,
      objectPosition,
      overflowX: overflow,
      overflowY: overflow,
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
    },
    getAttribute(name: string) {
      return attributes[name] ?? null;
    },
  } as unknown as HTMLElement;
}

const options: ElementMediaGeometryOptions = {
  fallbackFit: "contain",
  legacyAspectRatioAttribute: "data-test-aspect-ratio",
  legacyRadiusAttribute: "data-test-radius",
};

function resolve(
  keyedEl: HTMLElement,
  keyedBox: MediaRect,
  mediaBoxes = new Map<HTMLElement, MediaRect>(),
  overrides: Partial<ElementMediaGeometryOptions> = {},
) {
  return resolveElementMediaGeometry(
    keyedEl,
    keyedBox,
    (mediaEl) => mediaBoxes.get(mediaEl) ?? keyedBox,
    { ...options, ...overrides },
  );
}

describe("media geometry", () => {
  it("auto-resolves intrinsic cover geometry and a simple CSS radius", () => {
    const geometry = resolve(
      element({
        naturalWidth: 1600,
        naturalHeight: 800,
        objectFit: "cover",
        radius: "12px",
      }),
      rect(0, 0, 100, 100),
    );

    expect(geometry.content).toEqual(rect(-50, 0, 200, 100));
    expect(geometry.window).toEqual(rect(0, 0, 100, 100));
    expect(geometry.clipInset).toEqual({
      top: 0,
      right: 50,
      bottom: 0,
      left: 50,
    });
    expect(geometry.radius).toBe(12);
  });

  it("does not apply border-box radius to inner contained pixels", () => {
    const geometry = resolve(
      element({
        naturalWidth: 1600,
        naturalHeight: 800,
        objectFit: "contain",
        radius: "12px",
      }),
      rect(0, 0, 100, 100),
    );

    expect(geometry.content).toEqual(rect(0, 25, 100, 50));
    expect(geometry.window).toEqual(geometry.content);
    expect(geometry.radius).toBe(0);
  });

  it("preserves bbox geometry when CSS object-fit is not recognized", () => {
    const bbox = rect(0, 0, 100, 100);
    const geometry = resolve(
      element({ naturalWidth: 1600, naturalHeight: 800 }),
      bbox,
    );

    expect(geometry.fit).toBeNull();
    expect(geometry.content).toBe(bbox);
  });

  it("preserves bbox geometry when intrinsic dimensions are unavailable", () => {
    const bbox = rect(0, 0, 100, 100);
    const geometry = resolve(element({ objectFit: "cover" }), bbox);

    expect(geometry.aspectRatio).toBeNull();
    expect(geometry.content).toBe(bbox);
    expect(geometry.window).toBe(bbox);
  });

  it("uses native width and height hints before an image has loaded", () => {
    const geometry = resolve(
      element({
        objectFit: "contain",
        attributes: { width: "1600", height: "800" },
      }),
      rect(0, 0, 100, 100),
    );

    expect(geometry.aspectRatio).toBe(2);
    expect(geometry.content).toEqual(rect(0, 25, 100, 50));
  });

  it("falls back to bbox for custom object-position", () => {
    const bbox = rect(0, 0, 100, 100);
    const geometry = resolve(
      element({
        naturalWidth: 1600,
        naturalHeight: 800,
        objectFit: "cover",
        objectPosition: "left top",
      }),
      bbox,
    );

    expect(geometry.fit).toBeNull();
    expect(geometry.content).toBe(bbox);
  });

  it("uses one direct image child with its clipping wrapper window and radius", () => {
    const media = element({
      naturalWidth: 1600,
      naturalHeight: 800,
      objectFit: "cover",
    });
    const overlay = element({ tagName: "SPAN" });
    const wrapper = element({
      tagName: "DIV",
      children: [media, overlay],
      overflow: "hidden",
      radius: "16px",
    });
    const box = rect(0, 0, 100, 100);
    const mediaBox = rect(-50, 0, 200, 100);

    expect(findMediaElement(wrapper)).toBe(media);
    const geometry = resolve(wrapper, box, new Map([[media, mediaBox]]));
    expect(geometry.content).toEqual(rect(-50, 0, 200, 100));
    expect(geometry.window).toEqual(box);
    expect(geometry.radius).toBe(16);
    expect(geometry.mediaElement).toBe(media);
  });

  it("does not infer through picture or video elements", () => {
    const media = element({ tagName: "IMG" });
    const source = element({ tagName: "SOURCE" });
    const picture = element({ tagName: "PICTURE", children: [source, media] });
    const wrapper = element({ tagName: "DIV", children: [picture] });

    expect(findMediaElement(wrapper)).toBeNull();
    expect(findMediaElement(picture)).toBeNull();
    expect(findMediaElement(element({ tagName: "VIDEO" }))).toBeNull();
  });

  it("rejects ambiguous wrappers with multiple direct media children", () => {
    const wrapper = element({
      tagName: "DIV",
      children: [element(), element()],
    });
    const bbox = rect(0, 0, 100, 100);

    expect(findMediaElement(wrapper)).toBeNull();
    expect(resolve(wrapper, bbox).content).toBe(bbox);
  });

  it("retains deprecated aspect and radius overrides for compatibility", () => {
    const geometry = resolve(
      element({
        tagName: "DIV",
        attributes: {
          "data-test-aspect-ratio": "2/1",
          "data-test-radius": "10",
        },
      }),
      rect(0, 0, 100, 100),
    );

    expect(geometry.content).toEqual(rect(0, 25, 100, 50));
    expect(geometry.radius).toBe(10);
    expect(geometry.radiusSource).toBe("legacy");
  });

  it("treats a deprecated zero radius as an explicit override", () => {
    const geometry = resolve(
      element({
        naturalWidth: 100,
        naturalHeight: 100,
        objectFit: "cover",
        radius: "12px",
        attributes: { "data-test-radius": "0" },
      }),
      rect(0, 0, 100, 100),
    );

    expect(geometry.radius).toBe(0);
    expect(geometry.radiusSource).toBe("legacy");
  });

  it("retains the legacy radius parser for px-suffixed values", () => {
    const geometry = resolve(
      element({ attributes: { "data-test-radius": "12px" } }),
      rect(0, 0, 100, 100),
    );

    expect(geometry.radius).toBe(12);
    expect(geometry.radiusSource).toBe("legacy");
  });

  it("uses an image radius when the visible image is smaller than its wrapper", () => {
    const media = element({
      naturalWidth: 100,
      naturalHeight: 100,
      objectFit: "cover",
      radius: "12px",
    });
    const wrapper = element({
      tagName: "DIV",
      children: [media],
      overflow: "hidden",
      radius: "8px",
    });
    const geometry = resolve(
      wrapper,
      rect(0, 0, 120, 120),
      new Map([[media, rect(10, 10, 100, 100)]]),
    );

    expect(geometry.window).toEqual(rect(10, 10, 100, 100));
    expect(geometry.radius).toBe(12);
    expect(geometry.bboxRadius).toBe(8);

    const [, unresolved] = normalizeMediaGeometryPair(
      createMediaGeometry(rect(0, 0, 120, 120), null, null),
      geometry,
    );
    expect(unresolved.radius).toBe(8);
  });

  it("uses the larger effective radius when wrapper and image share a box", () => {
    const media = element({
      naturalWidth: 100,
      naturalHeight: 100,
      objectFit: "cover",
      radius: "16px",
    });
    const wrapper = element({
      tagName: "DIV",
      children: [media],
      overflow: "hidden",
      radius: "12px",
    });
    const box = rect(0, 0, 100, 100);

    expect(resolve(wrapper, box, new Map([[media, box]])).radius).toBe(16);
  });

  it("falls back to the keyed bbox when image and clipping wrapper do not overlap", () => {
    const media = element({
      naturalWidth: 100,
      naturalHeight: 100,
      objectFit: "cover",
    });
    const wrapper = element({
      tagName: "DIV",
      children: [media],
      overflow: "hidden",
      radius: "12px",
    });
    const bbox = rect(0, 0, 100, 100);
    const geometry = resolve(
      wrapper,
      bbox,
      new Map([[media, rect(200, 200, 100, 100)]]),
    );

    expect(geometry.content).toEqual(bbox);
    expect(geometry.contentAware).toBe(false);
    expect(geometry.mediaElement).toBeNull();
    expect(geometry.radius).toBe(12);
  });

  it("retains a clipping keyed element radius without a direct image", () => {
    const bbox = rect(0, 0, 100, 100);
    const geometry = resolve(
      element({
        tagName: "DIV",
        overflow: "hidden",
        radius: "12px",
      }),
      bbox,
    );

    expect(geometry.content).toEqual(bbox);
    expect(geometry.radius).toBe(12);
    expect(geometry.bboxRadius).toBe(12);
    expect(geometry.radiusSource).toBe("computed");
  });

  it("falls back to bbox for complex radii and non-content-box images", () => {
    const bbox = rect(0, 0, 100, 100);
    const complexRadius = resolve(
      element({
        naturalWidth: 100,
        naturalHeight: 100,
        objectFit: "cover",
        radius: "50%",
      }),
      bbox,
    );
    const paddedImage = element({
      naturalWidth: 100,
      naturalHeight: 100,
      objectFit: "cover",
    });
    (paddedImage.style as CSSStyleDeclaration).paddingLeft = "1px";
    const padded = resolve(paddedImage, bbox);

    expect(complexRadius.contentAware).toBe(false);
    expect(complexRadius.radiusSource).toBe("unsupported");
    expect(padded.contentAware).toBe(false);
  });

  it("atomically clears child-only radius and media references on pair fallback", () => {
    const bbox = rect(0, 0, 100, 100);
    const media = element();
    const resolved = createMediaGeometry(bbox, 1, "cover");
    resolved.radius = 12;
    resolved.radiusSource = "computed";
    resolved.bboxRadius = 0;
    resolved.bboxRadiusSource = "none";
    resolved.mediaElement = media;
    const unresolved = createMediaGeometry(bbox, null, null);

    const [from, to] = normalizeMediaGeometryPair(resolved, unresolved);

    expect(from.contentAware).toBe(false);
    expect(from.mediaElement).toBeNull();
    expect(from.radius).toBe(0);
    expect(to.contentAware).toBe(false);
  });

  it("inverse-projects a cropped target window into base content", () => {
    const enter = createMediaGeometry(rect(0, 100, 400, 400), 2, "contain");
    const exit = createMediaGeometry(rect(20, 30, 100, 100), 2, "cover");

    expect(
      projectedWindowRect(enter.content, exit.content, exit.window, 0.5, 0.5),
    ).toEqual(rect(100, 200, 200, 200));
  });
});
