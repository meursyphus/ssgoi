"use client";

import type { PhotoDetail } from "@/demo/google-photos/state/photo";

/**
 * The <img> spans the canvas (`h-full w-full`) with `object-contain` so the
 * full photo is visible inside a tall mobile-frame regardless of aspect.
 * Hero reads the native dimensions and computed object-contain style, so the
 * morph anchors on visible pixels rather than the surrounding letterbox.
 */
export function PhotoCanvas({ photo }: { photo: PhotoDetail }) {
  return (
    <section className="h-full w-full bg-white py-4">
      <img
        src={photo.src}
        alt={photo.description ?? photo.takenAt}
        width={photo.width}
        height={photo.height}
        className="block h-full w-full object-contain"
        data-hero-enter-key={photo.id}
      />
    </section>
  );
}
