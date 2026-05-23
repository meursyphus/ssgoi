"use client";

import Link from "next/link";
import type { CollectionSimple } from "@/demo/google-photos/state/collection";

/**
 * One card: 2x2 mini-grid (or single cover) on top, label + count below.
 * Falls back to a single-image cover when fewer than 4 thumbs are available.
 */
export function CollectionCard({
  collection,
}: {
  collection: CollectionSimple;
}) {
  const covers = collection.coverThumbs;
  const showGrid = covers.length >= 2;

  return (
    <Link
      href={`/demo/google-photos/c/${collection.id}`}
      scroll={false}
      className="flex flex-col gap-2 active:opacity-80"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
        {showGrid ? (
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]">
            {covers.slice(0, 4).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
            ))}
            {covers.length < 4 &&
              Array.from({ length: 4 - covers.length }).map((_, i) => (
                <div key={`pad-${i}`} className="bg-neutral-200" />
              ))}
          </div>
        ) : covers.length === 1 ? (
          <img
            src={covers[0]}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
      </div>
      <div className="px-1">
        <p className="truncate text-[13px] font-medium text-neutral-900">
          {collection.name}
        </p>
        <p className="text-[12px] text-neutral-500">
          {collection.count.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
