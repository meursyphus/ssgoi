"use client";

import type { PhotoCategory } from "@/demo/airbnb-photo-tour/state/photo";

export function CategoryStrip({
  categories,
  activeId,
  onSelect,
}: {
  categories: PhotoCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="bg-white">
      <ul className="flex gap-1 overflow-x-auto px-8 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const isActive = c.id === activeId;
          return (
            <li key={c.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className="group flex w-[140px] flex-col items-center gap-2 text-center"
              >
                <span className="block h-[100px] w-[140px] overflow-hidden rounded-lg">
                  <img
                    src={c.coverSrc}
                    alt={c.label}
                    className={`h-full w-full object-cover transition ${
                      isActive ? "" : "opacity-50 group-hover:opacity-75"
                    }`}
                  />
                </span>
                <span
                  className={`block text-[13px] ${
                    isActive
                      ? "font-semibold text-neutral-900"
                      : "font-normal text-neutral-500"
                  }`}
                >
                  {c.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
