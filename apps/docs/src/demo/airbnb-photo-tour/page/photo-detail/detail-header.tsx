"use client";

import { Link } from "@/lib/link";
import { LayoutGrid, X } from "lucide-react";

export function DetailHeader({
  categoryLabel,
  indexInCategory,
  categoryTotal,
}: {
  categoryLabel: string;
  indexInCategory: number;
  categoryTotal: number;
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-white px-6 py-4 text-neutral-900">
      <Link
        href="/demo/airbnb-photo-tour"
        scroll={false}
        aria-label="썸네일 보기"
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"
      >
        <LayoutGrid className="h-5 w-5" />
      </Link>
      <div className="text-center text-[14px]">
        <span className="font-medium">{categoryLabel}</span>
        <span className="ml-2 text-neutral-500">
          전체 {categoryTotal}개 중 {indexInCategory}번째
        </span>
      </div>
      <Link
        href="/demo/airbnb-photo-tour"
        scroll={false}
        aria-label="닫기"
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"
      >
        <X className="h-5 w-5" />
      </Link>
    </header>
  );
}
