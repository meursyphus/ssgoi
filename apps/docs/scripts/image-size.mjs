/*
 * Intrinsic image size from the file's header bytes (PNG, GIF, WebP, JPEG,
 * SVG), so the blog generator can write width/height onto every <img> and
 * the browser reserves each image's box before the file arrives.
 */

const JPEG_SOF = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

// CSS px per SVG length unit; em, ex and % have no intrinsic size.
const SVG_UNITS = {
  "": 1,
  px: 1,
  pt: 4 / 3,
  pc: 16,
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
};

const ascii = (bytes, start, end) => bytes.toString("latin1", start, end);

function pngSize(b) {
  if (ascii(b, 12, 16) !== "IHDR") return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function gifSize(b) {
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function webpSize(b) {
  switch (ascii(b, 12, 16)) {
    case "VP8 ":
      if (b[23] !== 0x9d || b[24] !== 0x01 || b[25] !== 0x2a) return null;
      return {
        width: b.readUInt16LE(26) & 0x3fff,
        height: b.readUInt16LE(28) & 0x3fff,
      };
    case "VP8L": {
      if (b[20] !== 0x2f) return null;
      const bits = b.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }
    case "VP8X":
      return {
        width: b.readUIntLE(24, 3) + 1,
        height: b.readUIntLE(27, 3) + 1,
      };
    default:
      return null;
  }
}

/** EXIF orientation tag from an APP1 segment's payload, or 0. */
function exifOrientation(segment) {
  try {
    if (ascii(segment, 0, 6) !== "Exif\0\0") return 0;
    const tiff = segment.subarray(6);
    const le = ascii(tiff, 0, 2) === "II";
    const u16 = (at) => (le ? tiff.readUInt16LE(at) : tiff.readUInt16BE(at));
    const ifd = le ? tiff.readUInt32LE(4) : tiff.readUInt32BE(4);
    for (let n = u16(ifd), entry = ifd + 2; n > 0; n--, entry += 12)
      if (u16(entry) === 0x0112) return u16(entry + 8);
  } catch {
    // Truncated or malformed EXIF: treat as unrotated.
  }
  return 0;
}

function jpegSize(b) {
  let rotated = false;
  for (let i = 2; i + 9 <= b.length; ) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    if (marker === 0xff) {
      i += 1; // fill byte
    } else if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      i += 2; // standalone marker, no length
    } else if (JPEG_SOF.has(marker)) {
      const height = b.readUInt16BE(i + 5);
      const width = b.readUInt16BE(i + 7);
      // Browsers apply EXIF orientation, so 5–8 swap the displayed axes.
      return rotated ? { width: height, height: width } : { width, height };
    } else {
      const length = b.readUInt16BE(i + 2);
      if (marker === 0xe1)
        rotated ||= exifOrientation(b.subarray(i + 4, i + 2 + length)) >= 5;
      i += 2 + length;
    }
  }
  return null;
}

function svgLength(value) {
  const match = /^\s*([\d.]+(?:e[+-]?\d+)?)\s*([a-z]*)\s*$/i.exec(value ?? "");
  const unit = match && SVG_UNITS[match[2].toLowerCase()];
  return unit ? Number(match[1]) * unit : undefined;
}

function svgSize(b) {
  const root = /<svg\b[^>]*>/i.exec(b.toString("utf8"))?.[0];
  if (!root) return null;
  const attr = (name) =>
    new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, "i").exec(root)?.[2];
  const width = svgLength(attr("width"));
  const height = svgLength(attr("height"));
  const box = attr("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  const ratio = box?.[2] > 0 && box?.[3] > 0 ? box[2] / box[3] : 0;
  const size =
    width && height
      ? { width, height }
      : !ratio
        ? null
        : width
          ? { width, height: width / ratio }
          : height
            ? { width: height * ratio, height }
            : { width: box[2], height: box[3] };
  return (
    size && { width: Math.round(size.width), height: Math.round(size.height) }
  );
}

/**
 * `{ width, height }` in CSS px, or null when the bytes are not (yet) enough
 * to tell: an unsupported format, or a prefix that stops before the size.
 */
export function imageSize(bytes) {
  const b = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  try {
    if (b.readUInt32BE(0) === 0x89504e47) return pngSize(b);
    if (/^GIF8[79]a/.test(ascii(b, 0, 6))) return gifSize(b);
    if (ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP")
      return webpSize(b);
    if (b[0] === 0xff && b[1] === 0xd8) return jpegSize(b);
    if (/^(﻿)?\s*</.test(b.toString("utf8", 0, 64))) return svgSize(b);
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
  }
  return null;
}

/**
 * Streams `url` only until its header gives the size (at most `maxBytes`),
 * then drops the connection. Rejects on HTTP errors and after `timeout` ms.
 */
export async function fetchImageSize(
  url,
  { timeout = 5000, maxBytes = 1 << 20 } = {},
) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  if (!response.ok || !response.body)
    throw new Error(`HTTP ${response.status}`);
  const chunks = [];
  let received = 0;
  for await (const chunk of response.body) {
    chunks.push(chunk);
    received += chunk.length;
    const size = imageSize(Buffer.concat(chunks, received));
    if (size || received >= maxBytes) return size;
  }
  return null;
}
