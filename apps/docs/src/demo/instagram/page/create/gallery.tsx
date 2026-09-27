"use client";

import { ChevronDown } from "lucide-react";
import type { PostSimple } from "@/demo/instagram/state/post";

export function CreateGallery({
  posts,
  loading,
  selectedId,
  onSelect,
}: {
  posts: PostSimple[];
  loading: boolean;
  selectedId?: string;
  onSelect: (post: PostSimple) => void;
}) {
  return (
    <div className="pb-24">
      <div className="flex items-center gap-1 px-4 py-3 text-[16px] font-semibold">
        최근 항목
        <ChevronDown className="h-4 w-4" strokeWidth={2.4} />
      </div>
      <div className="grid grid-cols-4 gap-[1px]">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse bg-neutral-800"
              />
            ))
          : posts.map((p) => {
              const selected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-label="사진 선택"
                  aria-pressed={selected}
                  onClick={() => onSelect(p)}
                  className="relative aspect-square overflow-hidden"
                >
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute inset-0 bg-white transition-opacity duration-150 ${
                      selected ? "opacity-40" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
      </div>
    </div>
  );
}
