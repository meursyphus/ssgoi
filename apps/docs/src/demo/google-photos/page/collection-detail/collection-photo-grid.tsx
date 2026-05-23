"use client";

import Link from "next/link";
import type { PhotoSimple } from "@/demo/google-photos/state/photo";

export function CollectionPhotoGrid({ photos }: { photos: PhotoSimple[] }) {
  return (
    <div className="grid grid-cols-3 gap-[2px] bg-white">
      {photos.map((p) => (
        <Link
          key={p.id}
          href={`/demo/google-photos/p/${p.id}`}
          scroll={false}
          className="relative block aspect-square bg-neutral-100"
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
