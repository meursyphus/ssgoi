"use client";

import { Link } from "@/lib/link";
import { useCategory } from "@/demo/pinterest/state/category";

/** Typeahead panel: popular searches as image tiles. */
export function Suggestions() {
  const cat = useCategory((state) => ({ categories: state.categories }));
  return (
    <section className="px-4 pt-2" aria-label="인기 검색어">
      <h2 className="mb-3 text-[16px] font-bold text-black">
        Pinterest 인기 검색어
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {cat.categories.data.map((category) => (
          <Link
            key={category.label}
            href={`/demo/pinterest/search/${encodeURIComponent(category.label)}`}
            scroll={false}
            className="relative block h-24 overflow-hidden rounded-2xl bg-neutral-200"
          >
            <img
              src={category.thumbnails[0]}
              alt=""
              width={200}
              height={267}
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 grid place-items-center bg-black/35 px-2 text-center text-[16px] font-bold text-white">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
