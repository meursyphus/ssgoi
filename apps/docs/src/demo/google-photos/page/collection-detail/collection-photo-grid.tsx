"use client";

import Link from "next/link";
import type { PhotoSimple } from "@/demo/google-photos/state/photo";

/**
 * Photos inside a collection rendered as a 3-column square grid.
 * No hero pair is wired at this stage — the c/* ↔ p/* hero gets enabled in
 * layout/client.tsx's TODO once the "fade" hero variant is publicly exposed.
 */
export function CollectionPhotoGrid({ photos }: { photos: PhotoSimple[] }) {
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
          />
        </Link>
      ))}
    </div>
  );
}
