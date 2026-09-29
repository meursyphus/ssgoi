"use client";

import { Link } from "@/lib/link";
import type { StorySimple } from "@/demo/voyage/state/story";
import { BASE } from "../shared/routes";

/** Related stories. Exit-marked only: the page's one enter key is the hero. */
export function MoreStories({ stories }: { stories: StorySimple[] }) {
  if (stories.length === 0) return null;
  return (
    <section className="px-5 pt-7 pb-10" aria-label="More stories">
      <h2 className="text-[17px] font-bold tracking-tight text-neutral-900">
        More stories
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {stories.map((s) => (
          <Link
            key={s.id}
            href={`${BASE}/story/${s.id}`}
            scroll={false}
            className="group flex flex-col"
          >
            <div className="overflow-hidden rounded-2xl bg-neutral-100">
              <img
                src={s.cover}
                alt={s.location}
                width={440}
                height={550}
                loading="lazy"
                data-zoom-exit-key={s.id}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <span className="mt-2 line-clamp-2 text-[12.5px] font-semibold leading-snug text-neutral-900">
              {s.title}
            </span>
            <span className="mt-0.5 truncate text-[11.5px] text-neutral-500">
              {s.location}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
