import type { PhotoSimple } from "@/demo/google-photos/api/photo";

export interface CollectionAPI {
  /** Collections grid — metadata + cover thumbnails */
  findAll: () => Promise<CollectionSimple[]>;
  /**
   * Collection detail — metadata + the list of photos inside.
   *
   * Bundles the inner PhotoSimple list so the detail page can hydrate
   * both domains in one round trip.
   */
  find: (id: string) => Promise<CollectionDetail>;
}

export type CollectionKind =
  | "screenshot"
  | "people"
  | "document"
  | "place"
  | "favorite"
  | "trash";

export type CollectionSimple = {
  id: string;
  name: string;
  kind: CollectionKind;
  /** Pre-cropped thumbnail URLs for the 2x2 mini-grid (or single image) */
  coverThumbs: string[];
  /** Photo count inside the collection — used in the card label */
  count: number;
};

export type CollectionDetail = CollectionSimple & {
  /** Photos inside the collection — rendered as a grid on the detail page */
  photos: PhotoSimple[];
};
