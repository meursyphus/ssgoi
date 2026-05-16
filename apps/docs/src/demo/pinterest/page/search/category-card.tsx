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
          <p className="text-[12px] font-medium text-neutral-500">
            {category.badge}
          </p>
          <h3 className="text-[22px] font-bold leading-tight text-black">
            {category.label}
          </h3>
        </div>
        <Link
          href={href}
          aria-label={`${category.label} 검색`}
          className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-black"
        >
          <Search className="h-4 w-4" strokeWidth={2.6} />
        </Link>
      </div>
      <Link href={href} className="block">
        <div className="flex gap-1.5 overflow-hidden rounded-2xl">
          {category.thumbnails.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="aspect-[3/4] w-1/4 object-cover"
            />
          ))}
        </div>
      </Link>
    </div>
  );
}
