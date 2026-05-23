"use client";

import { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { Loader2 } from "lucide-react";
import { useCollection } from "@/demo/google-photos/state/collection";
import { UtilityRow } from "./utility-row";
import { CollectionGrid } from "./collection-grid";

export default function CollectionsPage() {
  const collection = useCollection((state) => ({
    collections: state.collections,
    actions: state.actions,
  }));

  useEffect(() => {
    collection.actions.loadAll();
  }, [collection.actions]);

  return (
    <SsgoiTransition
      id="/demo/google-photos/collections"
      className="block min-h-full bg-white"
    >
      <div className="px-4 pt-4">
        <UtilityRow />
      </div>
      {collection.collections.isLoading &&
      collection.collections.data.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <CollectionGrid collections={collection.collections.data} />
      )}
    </SsgoiTransition>
  );
}
