"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { useRouter } from "next/navigation";
import { Search, Circle, Maximize2 } from "lucide-react";
import type { PhotoSimple } from "@/demo/google-photos/state/photo";

const SECTION_LABELS = ["Today", "Yesterday", "Thursday"] as const;

/**
 * Split the photo list into 3 day-buckets purely for layout — the screen is a
 * sheet effect showcase, so we don't bother with real grouping by `takenAt`.
 */
function bucket(photos: PhotoSimple[], perSection = 6): PhotoSimple[][] {
  return SECTION_LABELS.map((_, i) =>
    photos.slice(i * perSection, (i + 1) * perSection),
  );
}

export default function CollagePage({ photos }: { photos: PhotoSimple[] }) {
  const router = useRouter();
  const sections = bucket(photos);

  return (
    <SsgoiTransition
      id="/demo/google-photos/collage"
      className="relative flex min-h-full flex-col bg-white"
    >
      <header className="sticky top-0 z-30 bg-white pt-3 pb-2">
        <p className="text-center text-[13px] text-neutral-500">
          Select 1–6 photos
        </p>
        <div className="mt-2 flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => router.push("/demo/google-photos/create")}
            className="text-[15px] font-medium text-neutral-700 active:opacity-60"
          >
            Cancel
          </button>
          <h1 className="text-[16px] font-semibold text-neutral-900">
            New collage
          </h1>
          <button
            type="button"
            className="text-[15px] font-medium text-neutral-400"
          >
            Create
          </button>
        </div>
        <div className="px-4 pt-3">
          <div className="flex h-11 items-center gap-2 rounded-full bg-neutral-100 px-4">
            <Search className="h-4 w-4 text-neutral-500" />
            <span className="text-[14px] text-neutral-500">
              Search your photos
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 pb-24">
        {sections.map((items, i) => (
          <section key={SECTION_LABELS[i]} className="mt-5">
            <div className="flex items-center gap-3 px-4 pb-3">
              <Circle
                className="h-5 w-5 text-neutral-300"
                strokeWidth={1.75}
              />
              <h2 className="text-[18px] font-semibold text-neutral-900">
                {SECTION_LABELS[i]}
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-[2px] bg-white">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="relative aspect-square bg-neutral-100"
                >
                  <img
                    src={p.thumbSrc}
                    alt={p.takenAt}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white/90 bg-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button
        type="button"
        aria-label="Resize"
        className="absolute bottom-6 right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-700 shadow-[0_4px_12px_rgba(0,0,0,0.18)] active:bg-neutral-100"
      >
        <Maximize2 className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </SsgoiTransition>
  );
}
