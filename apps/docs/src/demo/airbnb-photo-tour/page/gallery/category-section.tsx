"use client";

import { Link } from "@/lib/link";
import type { PhotoCategory } from "@/demo/airbnb-photo-tour/state/photo";

export function CategorySection({
  category,
  registerRef,
}: {
  category: PhotoCategory;
  registerRef: (id: string, el: HTMLElement | null) => void;
}) {
  const [hero, ...rest] = category.photos;
  return (
    <section
      ref={(el) => registerRef(category.id, el)}
      className="grid scroll-mt-[180px] grid-cols-1 gap-x-12 gap-y-4 px-8 py-10 md:grid-cols-[minmax(220px,1fr)_minmax(0,2.5fr)]"
    >
      <h2 className="text-[28px] font-semibold leading-tight text-neutral-900 md:pt-2">
        {category.label}
      </h2>

      <div className="flex flex-col gap-2">
        <PhotoTile photo={hero} sizeClass="aspect-[3/2]" />
        {rest.length > 0 && (
          <div
            className={`grid gap-2 ${
              rest.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {rest.map((p) => (
              <PhotoTile key={p.id} photo={p} sizeClass="aspect-[4/3]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PhotoTile({
  photo,
  sizeClass,
}: {
  photo: PhotoCategory["photos"][number];
  sizeClass: string;
}) {
  return (
    <Link
      href={`/demo/airbnb-photo-tour/photos/${photo.id}`}
      scroll={false}
      className={`relative block ${sizeClass} overflow-hidden rounded-xl bg-neutral-100`}
      data-hero-exit-key={photo.id}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="h-full w-full object-cover"
      />
    </Link>
  );
}
