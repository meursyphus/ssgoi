import { action, OnError } from "comwit";
import { toast } from "sonner";
import { wishlist as wishlistAPI } from "@/demo/air-bnb/api/wishlist";
import { wishlist } from "../model";
import type { WishlistActions } from "../types";

export const toggleActions = action<Pick<WishlistActions, "toggle">>(
  ({ state }) => {
    class ToggleActions {
      private model = state(wishlist);

      @OnError((e: unknown) => {
        toast.error(
          e instanceof Error ? e.message : "Couldn't update wishlist",
        );
      })
      async toggle(listingId: string) {
        // Optimistic: flip the heart before the API answers.
        const ids = this.model.overview.data.savedIds;
        this.model.overview.data.savedIds = ids.includes(listingId)
          ? ids.filter((id) => id !== listingId)
          : [listingId, ...ids];
        const result = await wishlistAPI.toggle(listingId);
        toast(result.message);
        await Promise.all([
          this.model.overview.refetch(),
          this.model.saved.refetch(),
        ]);
      }
    }
    return new ToggleActions();
  },
);
