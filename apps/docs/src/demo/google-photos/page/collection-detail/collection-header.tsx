"use client";

import { Link } from "@/lib/link";
import { ArrowLeft, MoreVertical } from "lucide-react";
import type { CollectionDetail } from "@/demo/google-photos/state/collection";

export function CollectionHeader({
  collection,
}: {
  collection: CollectionDetail;
}) {
  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="flex h-14 items-center px-2">
        <Link
          href="/demo/google-photos/collections"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 active:bg-black/[0.05]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="ml-auto">
          <button
            type="button"
            aria-label="More"
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 active:bg-black/[0.05]"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="px-5 pb-4">
        <h1 className="text-[28px] font-medium leading-tight text-neutral-900">
          {collection.name}
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          {collection.count.toLocaleString()} items
        </p>
      </div>
    </header>
  );
}
