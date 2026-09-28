"use client";

import { useEffect } from "react";
import { useWishlist } from "@/demo/air-bnb/state/wishlist";
import { WishlistCard } from "./wishlist-card";

export default function WishlistsPage() {
  const wishlist = useWishlist((state) => ({
    overview: state.overview,
    actions: state.actions,
  }));
  useEffect(() => {
    wishlist.actions.load();
  }, [wishlist.actions]);
  const lists = wishlist.overview.data.lists;

  return (
    <div className="flex-1 bg-white px-5 pb-10 pt-8">
      <h1 className="text-[30px] font-bold text-neutral-900">Wishlists</h1>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 pt-6">
        {wishlist.overview.isLoading && lists.length === 0
          ? Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square animate-pulse rounded-2xl bg-neutral-100"
              />
            ))
          : lists.map((summary) => (
              <WishlistCard key={summary.key} summary={summary} />
            ))}
      </div>
    </div>
  );
}
