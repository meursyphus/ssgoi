import type { PhotoSimple } from "@/demo/google-photos/api/photo";
import type { CollectionKind } from "@/demo/google-photos/api/collection";

export interface SearchAPI {
  /** Search landing — faces, places, category shortcuts and recent photos */
  explore: () => Promise<SearchExplore>;
}

export type SearchFace = {
  id: string;
  name: string;
  thumbSrc: string;
  /** Collection the face opens */
  collectionId: string;
};

export type SearchPlace = {
  id: string;
  name: string;
  thumbSrc: string;
  collectionId: string;
};

export type SearchCategory = {
  /** Collection id — also the key */
  id: string;
  label: string;
  kind: CollectionKind;
};

/** Photo plus the text fields the search box matches against */
export type SearchablePhoto = PhotoSimple & {
  description?: string;
  location?: string;
};

export type SearchExplore = {
  faces: SearchFace[];
  places: SearchPlace[];
  categories: SearchCategory[];
  /** Newest first — the page shows the first row(s) and filters all of it */
  photos: SearchablePhoto[];
};
