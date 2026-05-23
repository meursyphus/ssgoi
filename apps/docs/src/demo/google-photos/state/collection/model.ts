import { model, query, keepPreviousData } from "comwit";
import { collection as collectionAPI } from "@/demo/google-photos/api/collection";
import type { CollectionState } from "./types";

export const collection = model<CollectionState>({
  collections: query<CollectionState["collections"]["data"], void>({
    initialData: [],
    queryFn: () => collectionAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
  currentCollection: null,
});
