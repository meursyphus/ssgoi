import { create } from "comwit";
import { wishlist } from "./model";
import { loadActions } from "./actions/load";
import { toggleActions } from "./actions/toggle";
import type { WishlistState, WishlistActions } from "./types";

export * from "./types";

export const useWishlist = create<WishlistState, WishlistActions>(wishlist, {
  actions: [loadActions, toggleActions],
});
