"use client";

import type { PhotoDetail } from "@/demo/airbnb-photo-tour/state/photo";

export function PhotoCanvas({ photo }: { photo: PhotoDetail }) {
  // Sized to roughly match the gallery's hero tile (~860×570) so the hero
  // morph between gallery and detail covers very little distance/scale.
  return (
    <section className="flex h-full w-full items-center justify-center bg-white px-12 pb-12 pt-20">
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="block max-h-[min(70vh,640px)] w-auto max-w-[min(900px,calc(100vw-96px))] rounded-xl object-contain"
        data-hero-enter-key={photo.id}
      />
    </section>
  );
}
