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
  /**
   * `false` keeps the collection out of the Collections card grid. Videos and
   * Archive are reached from the utility pills above the grid instead.
   */
  inGrid?: boolean;
};

const meta: CollectionMeta[] = [
  {
    id: "col-screenshot",
    name: "Screenshots & Recordings",
    kind: "screenshot",
  },
  { id: "col-people", name: "People & Pets", kind: "people" },
  { id: "col-document", name: "Documents", kind: "document" },
  { id: "col-place", name: "Places", kind: "place" },
  { id: "col-favorite", name: "Favorites", kind: "favorite" },
  { id: "col-trash", name: "Trash", kind: "trash" },
  { id: "col-video", name: "Videos", kind: "video", inGrid: false },
  { id: "col-archive", name: "Archive", kind: "archive", inGrid: false },
];

export const data = {
  all: () => meta.map((m) => ({ ...m })),
  /** Collections shown as cards on the Collections tab */
  listed: () => meta.filter((m) => m.inGrid !== false).map((m) => ({ ...m })),
  byId: (id: string) => {
    const found = meta.find((m) => m.id === id);
    return found ? { ...found } : null;
  },
};
