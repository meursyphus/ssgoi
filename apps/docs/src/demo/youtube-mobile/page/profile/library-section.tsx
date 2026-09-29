"use client";

import { Download, Play } from "lucide-react";
import { Link } from "@/lib/link";
import { BASE, LIBRARY_FILTERS, libraryFor } from "../../mock-data";
import { MoreButton } from "../shared/action-sheet";
import { ChipRow } from "../shared/chip-row";
import { useRememberedState } from "../shared/remembered-state";

/** "Your library": chips re-filter in place; ▶ rows play on the watch page. */
export function LibrarySection() {
  const [filter, setFilter] = useRememberedState("library-filter", "Recent");
  const items = libraryFor(filter);

  return (
    <section className="border-t border-neutral-200 px-4 pt-6">
      <h2 className="text-[22px] font-bold">Your library</h2>
      <ChipRow
        items={LIBRARY_FILTERS}
        value={filter}
        onChange={setFilter}
        className="-mx-4 mt-4 px-4"
      />

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <article key={item.id} className="flex gap-3">
            <Link
              href={`${BASE}/watch/${item.video.id}`}
              scroll={false}
              className="flex min-w-0 flex-1 gap-3"
            >
              <span className="relative block aspect-video w-[145px] shrink-0 self-start overflow-hidden rounded-xl bg-neutral-200">
                <img
                  src={item.video.image}
                  alt=""
                  width={1100}
                  height={620}
                  data-zoom-exit-key={item.video.id}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white">
                  {item.kind === "download" ? (
                    <Download className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" fill="currentColor" />
                  )}
                </span>
              </span>
              <span className="min-w-0 flex-1 py-1">
                <span className="line-clamp-2 text-[15px] font-semibold">
                  {item.title}
                </span>
                <span className="mt-2 block text-[12px] text-neutral-500">
                  {item.subtitle}
                </span>
              </span>
            </Link>
            <MoreButton
              menu={item.kind === "download" ? "video" : "playlist"}
              className="-mr-1 h-8 w-8 shrink-0"
            />
          </article>
        ))}
        {items.length === 0 && (
          <p className="py-8 text-center text-[14px] text-neutral-500">
            Nothing in {filter} yet.
          </p>
        )}
      </div>
    </section>
  );
}
