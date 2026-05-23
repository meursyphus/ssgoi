"use client";

import type { PhotoDetail } from "@/demo/google-photos/state/photo";

/**
 * White canvas sized to the showcase scroll container (not the page
 * viewport — `h-full` here, not `h-screen`, because the demo lives inside
 * a mobile-frame). The <img> spans the canvas (`h-full w-full`) so the
 * hero target rect is predictable; `object-contain` letterboxes the actual
 * pixels while preserving aspect ratio. This <img> is the destination side
 * of the hero pair (carries `data-hero-enter-key` = photo id).
 */
export function PhotoCanvas({ photo }: { photo: PhotoDetail }) {
  return (
    <section className="h-full w-full bg-white py-4">
      <img
        src={photo.src}
        alt={photo.description ?? photo.takenAt}
        className="block h-full w-full object-contain"
        data-hero-enter-key={photo.id}
      />
    </section>
  );
}
