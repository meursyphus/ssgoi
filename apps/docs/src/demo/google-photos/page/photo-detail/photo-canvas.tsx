"use client";

import type { PhotoDetail } from "@/demo/google-photos/state/photo";

/**
 * Full-viewport white canvas. The <img> is centered and aspect-preserved —
 * the image's own container constrains it. This <img> is the destination side
 * of the hero pair (carries `data-hero-enter-key` = photo id).
 */
export function PhotoCanvas({ photo }: { photo: PhotoDetail }) {
  return (
    <section className="flex h-screen w-full items-center justify-center bg-white px-4">
      <img
        src={photo.src}
        alt={photo.description ?? photo.takenAt}
        className="block max-h-full max-w-full object-contain"
        data-hero-enter-key={photo.id}
      />
    </section>
  );
}
