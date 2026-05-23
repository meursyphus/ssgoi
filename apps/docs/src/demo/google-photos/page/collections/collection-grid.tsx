"use client";

import type { CollectionSimple } from "@/demo/google-photos/state/collection";
import { CollectionCard } from "./collection-card";

export function CollectionGrid({
  collections,
}: {
  collections: CollectionSimple[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-4">
      {collections.map((c) => (
        <CollectionCard key={c.id} collection={c} />
      ))}
    </div>
  );
}
