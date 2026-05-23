import { create } from "comwit";
import { listing } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import type { ListingState, ListingActions } from "./types";

export * from "./types";

export const useListing = create<ListingState, ListingActions>(listing, {
  actions: [initActions, loadActions],
});
