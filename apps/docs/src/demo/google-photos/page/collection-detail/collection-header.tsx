"use client";

import { ArrowLeft } from "lucide-react";
import type { CollectionDetail } from "@/demo/google-photos/state/collection";
import { BASE } from "@/demo/google-photos/page/shared/paths";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { CollectionMenu } from "./collection-menu";

export function CollectionHeader({
  collection,
}: {
  collection: CollectionDetail;
}) {
  return (
    <header className="sticky top-0 z-10 bg-white">
      <div className="flex h-14 items-center px-2">
        {/* Opened from Collections, Search or Notifications — back to it. */}
        <DemoBackLink
          fallback={`${BASE}/collections`}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 active:bg-black/[0.05]"
        >
          <ArrowLeft className="h-5 w-5" />
        </DemoBackLink>
        <div className="ml-auto">
          <CollectionMenu firstPhotoId={collection.photos[0]?.id} />
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
