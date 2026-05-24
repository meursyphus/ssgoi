"use client";

import { ArrowLeft, Heart, Upload } from "lucide-react";

export function GalleryHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4">
      <button
        type="button"
        aria-label="뒤로"
        className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"
      >
        <ArrowLeft className="h-4 w-4 text-neutral-900" />
      </button>
      <h1 className="text-[15px] font-medium text-neutral-900">{title}</h1>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="공유"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"
        >
          <Upload className="h-4 w-4 text-neutral-900" />
        </button>
        <button
          type="button"
          aria-label="저장"
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100"
        >
          <Heart className="h-4 w-4 text-neutral-900" />
        </button>
      </div>
    </header>
  );
}
