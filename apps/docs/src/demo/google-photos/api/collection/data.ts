import type { CollectionKind } from "./types";

/**
 * Collection metadata — the actual photo-to-collection mapping lives in
 * COLLECTION_PHOTO_IDS in the photo domain's data.ts (single source of truth).
 * This file only carries labels / kinds / order.
 */
type CollectionMeta = {
  id: string;
  name: string;
  kind: CollectionKind;
};

const meta: CollectionMeta[] = [
  { id: "col-screenshot", name: "Screenshots & Recordings", kind: "screenshot" },
  { id: "col-people", name: "People & Pets", kind: "people" },
  { id: "col-document", name: "Documents", kind: "document" },
  { id: "col-place", name: "Places", kind: "place" },
  { id: "col-favorite", name: "Favorites", kind: "favorite" },
  { id: "col-trash", name: "Trash", kind: "trash" },
];

export const data = {
  all: () => meta.map((m) => ({ ...m })),
  byId: (id: string) => {
    const found = meta.find((m) => m.id === id);
    return found ? { ...found } : null;
  },
};
