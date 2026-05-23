"use client";

import Link from "next/link";
import type { PhotoSimple } from "@/demo/google-photos/state/photo";

/**
 * 3-column square grid. Each cell links to the photo detail, and the <img>
 * carries `data-hero-exit-key` so it plays the source side of the hero pair.
 */
export function PhotoGrid({ photos }: { photos: PhotoSimple[] }) {
  return (
    <div className="grid grid-cols-3 gap-[2px] bg-white">
      {photos.map((p) => (
        <Link
          key={p.id}
          href={`/demo/google-photos/p/${p.id}`}
          scroll={false}
          className="relative block aspect-square overflow-hidden bg-neutral-100"
        >
          <img
            src={p.thumbSrc}
            alt={p.takenAt}
            className="h-full w-full object-cover"
            data-hero-exit-key={p.id}
          />
        </Link>
      ))}
    </div>
  );
}
