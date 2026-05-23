"use client";

import type { PhotoDetail } from "@/demo/google-photos/state/photo";

/**
 * The <img> spans the canvas (`h-full w-full`) with `object-contain` so the
 * full photo is visible inside a tall mobile-frame regardless of aspect.
 * `data-hero-aspect-ratio` tells hero what sub-rect of the element actually
 * holds pixels, so the morph anchors on the visible image rather than the
 * full bbox (otherwise the thumb→detail morph aims at the letterbox area).
 */
export function PhotoCanvas({ photo }: { photo: PhotoDetail }) {
  return (
    <section className="h-full w-full bg-white py-4">
      <img
        src={photo.src}
        alt={photo.description ?? photo.takenAt}
        className="block h-full w-full object-contain"
        data-hero-aspect-ratio={photo.aspectRatio}
        data-hero-enter-key={photo.id}
      />
    </section>
  );
}
