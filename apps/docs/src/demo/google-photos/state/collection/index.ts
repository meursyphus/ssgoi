import { create } from "comwit";
import { collection } from "./model";
import { initActions } from "./actions/init";
import { loadActions } from "./actions/load";
import type { CollectionState, CollectionActions } from "./types";

export * from "./types";

export const useCollection = create<CollectionState, CollectionActions>(
  collection,
  {
    actions: [initActions, loadActions],
  },
);
