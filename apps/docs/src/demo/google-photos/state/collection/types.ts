import type { Query } from "comwit";
import type {
  CollectionSimple,
  CollectionDetail,
} from "@/demo/google-photos/api/collection";

export type CollectionState = {
  collections: Query<CollectionSimple[], void>;
  currentCollection: CollectionDetail | null;
};

export type CollectionActions = {
  init(detail: CollectionDetail): void;
  loadAll(): Promise<void>;
};

export type { CollectionSimple, CollectionDetail };
