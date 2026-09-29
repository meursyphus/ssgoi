import type { CollectionKind } from "@/demo/google-photos/api/collection";

/**
 * Search landing seed. Faces and places point at photos by id; the explore
 * action resolves thumbnails through the photo api.
 */
const faces = [
  { id: "face-mochi", name: "Mochi", photoId: "ph-013" },
  { id: "face-bori", name: "Bori", photoId: "ph-014" },
  { id: "face-nabi", name: "Nabi", photoId: "ph-015" },
  { id: "face-dubu", name: "Dubu", photoId: "ph-016" },
];

const places = [
  { id: "place-seoraksan", name: "Seoraksan", photoId: "ph-001" },
  { id: "place-switzerland", name: "Switzerland", photoId: "ph-003" },
  { id: "place-seoul", name: "Seoul", photoId: "ph-004" },
  { id: "place-iceland", name: "Iceland", photoId: "ph-021" },
  { id: "place-portugal", name: "Portugal", photoId: "ph-008" },
  { id: "place-ireland", name: "Ireland", photoId: "ph-023" },
];

const categories: { id: string; label: string; kind: CollectionKind }[] = [
  { id: "col-favorite", label: "Favorites", kind: "favorite" },
  { id: "col-video", label: "Videos", kind: "video" },
  { id: "col-screenshot", label: "Screenshots", kind: "screenshot" },
  { id: "col-document", label: "Documents", kind: "document" },
];

export const data = {
  faces: () => faces.map((f) => ({ ...f })),
  places: () => places.map((p) => ({ ...p })),
  categories: () => categories.map((c) => ({ ...c })),
  /** Every face and place opens this collection */
  facesCollectionId: () => "col-people",
  placesCollectionId: () => "col-place",
};
