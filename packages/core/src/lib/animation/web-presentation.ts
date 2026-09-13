import type { StyleObject } from "../runtime/motion-state";
import type { MotionChannel } from "../runtime/motion-matching";

export interface PresentationCodec {
  readonly frame?: { left: number; top: number; width: number; height: number };
  /** Codecs must use stable schemas and physical units across effects. */
  read(style: StyleObject): Record<string, MotionChannel>;
  write(channels: Readonly<Record<string, MotionChannel>>): StyleObject;
}

type Matrix = [number, number, number, number, number, number];
const identity: Matrix = [1, 0, 0, 1, 0, 0];
const mul = (a: Matrix, b: Matrix): Matrix => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
];
function inverse(a: Matrix): Matrix | null {
  const det = a[0] * a[3] - a[1] * a[2];
  if (Math.abs(det) < 1e-10) return null;
  return [
    a[3] / det,
    -a[1] / det,
    -a[2] / det,
    a[0] / det,
    (a[2] * a[5] - a[3] * a[4]) / det,
    (a[1] * a[4] - a[0] * a[5]) / det,
  ];
}
const translate = (x: number, y: number): Matrix => [1, 0, 0, 1, x, y];
const scale = (x: number, y: number): Matrix => [x, 0, 0, y, 0, 0];

/** Normalize the 2D transform vocabulary used by page/shared-media effects. */
export function readTransform(
  value: string,
  width: number,
  height: number,
): Matrix | null {
  if (!value || value === "none") return [...identity];
  let result: Matrix = [...identity];
  const pattern = /([a-zA-Z][a-zA-Z0-9]*)\(([^()]*)\)/g;
  let consumed = "";
  for (const match of value.matchAll(pattern)) {
    consumed += match[0];
    const name = match[1]!.toLowerCase();
    const args = match[2]!.trim().split(/\s*,\s*|\s+/);
    // Relative font/viewport units need a layout-aware codec, not parseFloat.
    if (
      args.some(
        (value) =>
          !/^[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?(?:px|%|deg|rad|turn)?$/i.test(
            value,
          ),
      )
    )
      return null;
    const n = args.map(Number.parseFloat);
    if (n.some((x) => !Number.isFinite(x))) return null;
    const length = (i: number, size: number) =>
      n[i]! * (args[i]?.endsWith("%") ? size / 100 : 1);
    const angle = (i: number) =>
      n[i]! *
      (args[i]?.endsWith("rad")
        ? 1
        : args[i]?.endsWith("turn")
          ? 2 * Math.PI
          : Math.PI / 180);
    let m: Matrix;
    if (name === "matrix" && n.length === 6) m = n as Matrix;
    else if (name === "translate" || name === "translate3d") {
      if (name === "translate3d" && n[2] !== 0) return null;
      m = translate(length(0, width), args[1] ? length(1, height) : 0);
    } else if (name === "translatex") m = translate(length(0, width), 0);
    else if (name === "translatey") m = translate(0, length(0, height));
    else if (name === "translatez" && n[0] === 0) m = [...identity];
    else if (name === "scale") m = scale(n[0]!, n[1] ?? n[0]!);
    else if (name === "scalex") m = scale(n[0]!, 1);
    else if (name === "scaley") m = scale(1, n[0]!);
    else if (name === "rotate" || name === "rotatez") {
      const a = angle(0);
      m = [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0];
    } else return null;
    result = mul(result, m);
  }
  return consumed.replace(/\s/g, "") === value.replace(/\s/g, "")
    ? result
    : null;
}

function channel(schema: string, value: number[]): MotionChannel {
  return { schema, value, velocity: value.map(() => 0) };
}
const numberPattern = /[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi;

type Plane = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
const plane = (m: Matrix): Plane => [
  m[0],
  m[2],
  m[4],
  m[1],
  m[3],
  m[5],
  0,
  0,
  1,
];
function multiply(a: Plane, b: Plane): Plane {
  return Array.from({ length: 9 }, (_, i) => {
    const row = Math.floor(i / 3),
      col = i % 3;
    return (
      a[row * 3]! * b[col]! +
      a[row * 3 + 1]! * b[col + 3]! +
      a[row * 3 + 2]! * b[col + 6]!
    );
  }) as Plane;
}
function normalize(m: Plane): Plane | null {
  if (Math.abs(m[8]) < 1e-8 || !m.every(Number.isFinite)) return null;
  return m.map((v) => v / m[8]) as Plane;
}
function readPlane(text: string, width: number, height: number): Plane | null {
  const affine = readTransform(text, width, height);
  if (affine) return plane(affine);
  if (typeof DOMMatrix === "undefined") return null;
  // DOMMatrix accepts absolute lengths only. Resolve percentages against the
  // element's own border box, exactly as CSS translate does.
  const resolved = text.replace(
    /(translate(?:3d|X|Y)?)\(([^()]*)\)/gi,
    (_all, name: string, args: string) => {
      const values = args.split(/\s*,\s*|\s+/).map((value, index) => {
        if (!value.endsWith("%")) return value;
        const size =
          name.toLowerCase() === "translatey" || index === 1 ? height : width;
        return `${(Number.parseFloat(value) * size) / 100}px`;
      });
      return `${name}(${values.join(",")})`;
    },
  );
  try {
    const m = new DOMMatrix(resolved);
    return normalize([
      m.m11,
      m.m21,
      m.m41,
      m.m12,
      m.m22,
      m.m42,
      m.m14,
      m.m24,
      m.m44,
    ]);
  } catch {
    return null;
  }
}
const PLANE_SCHEMA = "viewport-plane-v1";

/**
 * A planar homography maps a normalized element box into viewport coordinates.
 * Affine translation/rotation/scale/shear and perspective are separate channels:
 * this preserves rotation instead of linearly collapsing a rotation matrix.
 * 3D surfaces are supported as projected planes, not arbitrary 3D scenes.
 */
export function createWebPresentationCodec(
  element: HTMLElement,
): PresentationCodec {
  const width = element.offsetWidth || 1;
  const height = element.offsetHeight || 1;
  const computed =
    typeof getComputedStyle === "function" ? getComputedStyle(element) : null;
  const origin = (
    computed?.transformOrigin || `${width / 2}px ${height / 2}px`
  ).split(" ");
  const ox = Number.parseFloat(origin[0]!) || 0;
  const oy = Number.parseFloat(origin[1]!) || 0;
  let supportedFrame = true;
  if (typeof getComputedStyle === "function") {
    for (
      let parent = element.parentElement;
      parent;
      parent = parent.parentElement
    ) {
      const style = getComputedStyle(parent);
      if (
        (style.transform && style.transform !== "none") ||
        (style.perspective && style.perspective !== "none")
      ) {
        supportedFrame = false;
        break;
      }
    }
  }
  const rect = element.getBoundingClientRect?.();
  const current =
    readPlane(computed?.transform || "", width, height) ?? plane(identity);
  const aroundOrigin = multiply(
    multiply(plane(translate(ox, oy)), current),
    plane(translate(-ox, -oy)),
  );
  const corners = [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ].map(([x, y]) => {
    const w = aroundOrigin[6] * x! + aroundOrigin[7] * y! + aroundOrigin[8];
    return [
      (aroundOrigin[0] * x! + aroundOrigin[1] * y! + aroundOrigin[2]) / w,
      (aroundOrigin[3] * x! + aroundOrigin[4] * y! + aroundOrigin[5]) / w,
    ];
  });
  const left = (rect?.left ?? 0) - Math.min(...corners.map((p) => p[0]!));
  const top = (rect?.top ?? 0) - Math.min(...corners.map((p) => p[1]!));
  const before = translate(left + ox, top + oy);
  const after = mul(translate(-ox, -oy), scale(width, height));
  const beforeInverse = plane(inverse(before)!);
  const afterInverse = plane(inverse(after)!);
  return {
    frame: supportedFrame ? { left, top, width, height } : undefined,
    read(style) {
      const channels: Record<string, MotionChannel> = {};
      for (const [property, raw] of Object.entries(style)) {
        const text = String(raw);
        if (property === "transform") {
          if (!supportedFrame) continue;
          const m = readPlane(text, width, height);
          const world =
            m && normalize(multiply(multiply(plane(before), m), plane(after)));
          if (world) {
            const [a0, c0, x, b0, d0, y, p, q] = world;
            const a = a0 - x * p,
              b = b0 - y * p,
              c = c0 - x * q,
              d = d0 - y * q;
            const sx = Math.hypot(a, b);
            if (sx > 1e-8) {
              channels[property] = channel(PLANE_SCHEMA, [
                x,
                y,
                Math.atan2(b, a),
                sx,
                (a * d - b * c) / sx,
                (a * c + b * d) / sx,
                p,
                q,
              ]);
              continue;
            }
          }
        }
        const values = [...text.matchAll(numberPattern)].map((m) =>
          Number(m[0]),
        );
        if (values.length && values.every(Number.isFinite))
          channels[property] = channel(
            `css:${text.replace(numberPattern, "#")}`,
            values,
          );
      }
      return channels;
    },
    write(channels) {
      const style: StyleObject = {};
      for (const [property, c] of Object.entries(channels)) {
        if (property === "transform" && c.schema === PLANE_SCHEMA) {
          const [x, y, r, sx, sy, k, p, q] = c.value as [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
          ];
          const cos = Math.cos(r),
            sin = Math.sin(r);
          const world: Plane = [
            cos * sx + x * p,
            cos * k - sin * sy + x * q,
            x,
            sin * sx + y * p,
            sin * k + cos * sy + y * q,
            y,
            p,
            q,
            1,
          ];
          const local = multiply(multiply(beforeInverse, world), afterInverse);
          if (
            Math.abs(local[6]) + Math.abs(local[7]) < 1e-10 &&
            Math.abs(local[8] - 1) < 1e-10
          )
            style[property] =
              `matrix(${[local[0], local[3], local[1], local[4], local[2], local[5]].join(",")})`;
          else
            style[property] =
              `matrix3d(${[local[0], local[3], 0, local[6], local[1], local[4], 0, local[7], 0, 0, 1, 0, local[2], local[5], 0, local[8]].join(",")})`;
        } else if (c.schema.startsWith("css:")) {
          let i = 0;
          style[property] = c.schema
            .slice(4)
            .replace(/#/g, () => String(c.value[i++]));
        }
      }
      return style;
    },
  };
}
