"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import type { RecommendedCategory } from "@/demo/pinterest/state/category";

export function CategoryCard({ category }: { category: RecommendedCategory }) {
  const href = `/demo/pinterest/search/${encodeURIComponent(category.label)}`;
  return (
    <div className="px-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-neutral-400">
            {category.badge}
          </p>
          <h3 className="text-[18px] font-bold text-white">{category.label}</h3>
        </div>
        <Link
          href={href}
          aria-label={`${category.label} 검색`}
          className="grid h-9 w-9 place-items-center rounded-full bg-neutral-800 text-white"
        >
          <Search className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </div>
      <Link href={href} className="block">
        <div className="grid grid-cols-4 gap-1.5">
          {category.thumbnails.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-md bg-neutral-900"
            >
              <img
                src={src}
                alt=""
                className="aspect-square w-full object-cover"
              />
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
