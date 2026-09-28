"use client";

import { useEffect } from "react";
import {
  useListing,
  type ListingCollection,
} from "@/demo/air-bnb/state/listing";
import { useWishlist } from "@/demo/air-bnb/state/wishlist";
import { routes } from "@/demo/air-bnb/page/shared/routes";
import { CollectionView } from "./collection-view";

/** Server-rendered list (Explore rows, search destinations). */
export function CollectionPage({
  initialData,
}: {
  initialData: ListingCollection;
}) {
  const listing = useListing((state) => ({
    collections: state.collections,
    actions: state.actions,
  }));
  listing.actions.initCollection(initialData);
  const collection = listing.collections[initialData.key] ?? initialData;
  return <CollectionView collection={collection} fallback={routes.explore} />;
}

/** The saved wishlist — client state, so hearts show up here immediately. */
export function SavedCollectionPage() {
  const wishlist = useWishlist((state) => ({
    saved: state.saved,
    actions: state.actions,
  }));
  useEffect(() => {
    wishlist.actions.loadSaved();
  }, [wishlist.actions]);
  return (
    <CollectionView
      collection={wishlist.saved.data}
      loading={wishlist.saved.isLoading && !wishlist.saved.data.title}
      fallback={routes.wishlists}
    />
  );
}
