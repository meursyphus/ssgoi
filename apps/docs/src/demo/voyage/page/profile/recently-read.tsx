"use client";

import { Link } from "@/lib/link";
import type { StorySimple } from "@/demo/voyage/state/story";
import { BASE } from "../shared/routes";

export function RecentlyRead({ stories }: { stories: StorySimple[] }) {
  return (
    <section className="px-5 pt-8" aria-label="Recently read">
      <h2 className="text-[15px] font-bold tracking-tight text-neutral-900">
        Recently read
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-5">
        {stories.map((s) => (
          <Link
            key={s.id}
            href={`${BASE}/story/${s.id}`}
            scroll={false}
            className="flex flex-col"
          >
            <div className="overflow-hidden rounded-2xl bg-neutral-100">
              <img
                src={s.cover}
                alt={s.location}
                width={660}
                height={825}
                loading="lazy"
                data-zoom-exit-key={s.id}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <span className="mt-2 line-clamp-2 text-[14px] font-semibold leading-snug text-neutral-900">
              {s.title}
            </span>
            <span className="mt-0.5 text-[12.5px] text-neutral-500">
              {s.author}
              <span className="px-1 text-neutral-300">·</span>
              {s.readMinutes} min read
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
