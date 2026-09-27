import type { NotificationTarget } from "./types";

type NotificationSeed = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  target: NotificationTarget;
  /** Thumbnail for collection rows (defaults to the collection's first photo) */
  coverPhotoId?: string;
};

/** Every target id exists in the photo / collection seeds. */
const seed: NotificationSeed[] = [
  {
    id: "nt-001",
    title: "Rediscover this day",
    body: "Sunset from the peak · Seoraksan, Gangwon",
    time: "2h",
    unread: true,
    target: { type: "photo", photoId: "ph-001" },
  },
  {
    id: "nt-002",
    title: "Added to Favorites",
    body: "Stars over the mountain is now in your Favorites",
    time: "5h",
    unread: true,
    target: { type: "photo", photoId: "ph-021" },
  },
  {
    id: "nt-003",
    title: "12 photos in Places",
    body: "Seoraksan, Switzerland and 5 more places",
    time: "Yesterday",
    unread: false,
    target: { type: "collection", collectionId: "col-place" },
    coverPhotoId: "ph-003",
  },
  {
    id: "nt-004",
    title: "Your pets, all in one place",
    body: "Mochi, Bori and 2 more are in People & Pets",
    time: "2d",
    unread: false,
    target: { type: "collection", collectionId: "col-people" },
  },
  {
    id: "nt-005",
    title: "Trash will be emptied soon",
    body: "2 items will be permanently deleted in 7 days",
    time: "3d",
    unread: false,
    target: { type: "collection", collectionId: "col-trash" },
  },
];

export const data = {
  all: () => seed.map((n) => ({ ...n })),
};
