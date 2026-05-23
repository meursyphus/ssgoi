import type { PhotoDetail } from "./types";

/**
 * Internal seed shape — same as PhotoDetail but without `aspectRatio`, which
 * is derived at the data-read boundary so we don't restate `${width}/${height}`
 * on every entry.
 */
type RawPhoto = Omit<PhotoDetail, "aspectRatio">;

function withAspectRatio(p: RawPhoto): PhotoDetail {
  return { ...p, aspectRatio: `${p.width}/${p.height}` };
}

/**
 * Seed data — 24 photos. Uses unsplash images; each entry has a slightly
 * different width/height so the aspect ratio varies a bit. (The grid itself
 * crops to a 3-column aspect-square, but the fullscreen detail view preserves
 * the original ratio.)
 *
 * unsplash gives noticeably better image quality than picsum.photos seeds —
 * keeps the grid feeling alive.
 */
const seed: RawPhoto[] = [
  {
    id: "ph-001",
    src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.05.20",
    description: "Sunset from the peak",
    location: "Seoraksan, Gangwon",
    fileSize: "3.4 MB",
    storage: "iPhone (this device)",
    device: "iPhone 15 Pro · 24mm · ƒ/1.78",
  },
  {
    id: "ph-002",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=1800&fit=crop&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=70",
    width: 1200,
    height: 1800,
    takenAt: "2026.05.20",
    description: "Misty forest",
    location: "Gangwon",
    fileSize: "5.1 MB",
    storage: "Google Drive",
    device: "Sony α7 IV · 35mm · ƒ/2.8",
  },
  {
    id: "ph-003",
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.05.18",
    description: "Clouds drifting over the lake",
    location: "Switzerland",
    fileSize: "4.8 MB",
    storage: "iCloud Photos",
    device: "iPhone 15 Pro · 24mm · ƒ/1.78",
  },
  {
    id: "ph-004",
    src: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.05.18",
    description: "City at dusk",
    location: "Seoul",
    fileSize: "2.6 MB",
    storage: "iPhone (this device)",
  },
  {
    id: "ph-005",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=70",
    width: 1600,
    height: 1063,
    takenAt: "2026.05.16",
    description: "Mountain range",
    location: "Canada",
    fileSize: "5.8 MB",
    storage: "Google Drive",
    device: "Sony α7 IV · 24mm · ƒ/4.0",
  },
  {
    id: "ph-006",
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.05.16",
    description: "Forest trail",
    fileSize: "3.9 MB",
    storage: "iCloud Photos",
  },
  {
    id: "ph-007",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70",
    width: 1600,
    height: 1066,
    takenAt: "2026.05.15",
    description: "Golden fields",
    fileSize: "4.2 MB",
    storage: "iPhone (this device)",
    device: "iPhone 15 Pro · 24mm · ƒ/1.78",
  },
  {
    id: "ph-008",
    src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=1800&fit=crop&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=70",
    width: 1200,
    height: 1800,
    takenAt: "2026.05.15",
    description: "Ocean view",
    location: "Portugal",
    fileSize: "3.1 MB",
    storage: "Google Drive",
  },
  {
    id: "ph-009",
    src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=1800&fit=crop&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=70",
    width: 1200,
    height: 1800,
    takenAt: "2026.05.14",
    description: "Travel suitcase",
    fileSize: "2.1 MB",
    storage: "iPhone (this device)",
  },
  {
    id: "ph-010",
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600&q=80&hash=10",
    thumbSrc:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.05.14",
    description: "Maple tree",
    fileSize: "3.6 MB",
    storage: "iCloud Photos",
    device: "Galaxy S24 Ultra · 24mm · ƒ/1.7",
  },
  {
    id: "ph-011",
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.05.12",
    description: "Desk setup",
    fileSize: "2.4 MB",
    storage: "iPhone (this device)",
  },
  {
    id: "ph-012",
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70",
    width: 1600,
    height: 900,
    takenAt: "2026.05.12",
    description: "Autumn walk",
    fileSize: "4.7 MB",
    storage: "Google Drive",
    device: "Sony α7 IV · 50mm · ƒ/1.8",
  },
  {
    id: "ph-013",
    src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.05.10",
    description: "Cat in the sun",
    fileSize: "2.9 MB",
    storage: "iPhone (this device)",
    device: "iPhone 15 Pro · 24mm · ƒ/1.78",
  },
  {
    id: "ph-014",
    src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=70",
    width: 1600,
    height: 2133,
    takenAt: "2026.05.10",
    description: "Dog on a walk",
    fileSize: "3.3 MB",
    storage: "iCloud Photos",
  },
  {
    id: "ph-015",
    src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=70",
    width: 1600,
    height: 1600,
    takenAt: "2026.05.08",
    description: "Alley cat",
    fileSize: "2.8 MB",
    storage: "Google Drive",
    device: "Galaxy S24 Ultra · 24mm · ƒ/1.7",
  },
  {
    id: "ph-016",
    src: "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=1200&h=1800&fit=crop&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&q=70",
    width: 1200,
    height: 1800,
    takenAt: "2026.05.07",
    description: "Fluffy cat",
    fileSize: "3.0 MB",
    storage: "iPhone (this device)",
  },
  {
    id: "ph-017",
    src: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=70",
    width: 1600,
    height: 1068,
    takenAt: "2026.05.06",
    description: "Burger",
    fileSize: "2.2 MB",
    storage: "iCloud Photos",
  },
  {
    id: "ph-018",
    src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=70",
    width: 1600,
    height: 1068,
    takenAt: "2026.05.06",
    description: "Fresh salad",
    fileSize: "2.5 MB",
    storage: "iPhone (this device)",
    device: "iPhone 15 Pro · 24mm · ƒ/1.78",
  },
  {
    id: "ph-019",
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.05.04",
    description: "Steak dinner",
    fileSize: "3.8 MB",
    storage: "Google Drive",
  },
  {
    id: "ph-020",
    src: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400&q=70",
    width: 1600,
    height: 1060,
    takenAt: "2026.05.04",
    description: "Wine glass",
    fileSize: "2.7 MB",
    storage: "iPhone (this device)",
    device: "iPhone 15 Pro · 24mm · ƒ/1.78",
  },
  {
    id: "ph-021",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=1800&fit=crop&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70",
    width: 1200,
    height: 1800,
    takenAt: "2026.05.02",
    description: "Stars over the mountain",
    location: "Iceland",
    fileSize: "6.4 MB",
    storage: "Google Drive",
    device: "Sony α7 IV · 14mm · ƒ/2.8",
  },
  {
    id: "ph-022",
    src: "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=400&q=70",
    width: 1600,
    height: 1066,
    takenAt: "2026.05.02",
    description: "Moonlit landscape",
    fileSize: "4.0 MB",
    storage: "iCloud Photos",
  },
  {
    id: "ph-023",
    src: "https://images.unsplash.com/photo-1429087969512-1e85aab2683d?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1429087969512-1e85aab2683d?w=400&q=70",
    width: 1600,
    height: 2400,
    takenAt: "2026.04.30",
    description: "Rocky cliffs",
    location: "Ireland",
    fileSize: "5.3 MB",
    storage: "Google Drive",
    device: "Sony α7 IV · 24mm · ƒ/8.0",
  },
  {
    id: "ph-024",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
    thumbSrc:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=70",
    width: 1600,
    height: 1067,
    takenAt: "2026.04.28",
    description: "Forest path",
    fileSize: "3.5 MB",
    storage: "iPhone (this device)",
  },
];

/**
 * collection → photo id mapping. Paired with the collection domain's data —
 * the photo domain owns the single source of truth so both domains can share
 * the same in-memory facts (the collection domain's data only carries
 * collection metadata).
 */
export const COLLECTION_PHOTO_IDS: Record<string, string[]> = {
  "col-screenshot": [
    "ph-011",
    "ph-012",
    "ph-013",
    "ph-014",
    "ph-015",
    "ph-016",
    "ph-017",
    "ph-018",
  ],
  "col-people": [
    "ph-013",
    "ph-014",
    "ph-015",
    "ph-016",
    "ph-017",
    "ph-018",
    "ph-019",
    "ph-020",
  ],
  "col-document": ["ph-017", "ph-018", "ph-019", "ph-020"],
  "col-place": [
    "ph-001",
    "ph-002",
    "ph-003",
    "ph-004",
    "ph-005",
    "ph-006",
    "ph-007",
    "ph-008",
    "ph-021",
    "ph-022",
    "ph-023",
    "ph-024",
  ],
  "col-favorite": ["ph-001", "ph-004", "ph-006", "ph-013", "ph-021"],
  "col-trash": ["ph-009", "ph-010"],
};

const PAGE_LIMIT = 30;

export const data = {
  all: (): PhotoDetail[] => seed.map(withAspectRatio),
  /** find by id — detail response (includes location/description) */
  byId: (id: string): PhotoDetail | null => {
    const found = seed.find((p) => p.id === id);
    return found ? withAspectRatio(found) : null;
  },
  /** Photos for a given collection (preserves the id order) */
  byCollection: (collectionId: string): PhotoDetail[] => {
    const ids = COLLECTION_PHOTO_IDS[collectionId];
    if (!ids) return [];
    const result: PhotoDetail[] = [];
    for (const id of ids) {
      const found = seed.find((p) => p.id === id);
      if (found) result.push(withAspectRatio(found));
    }
    return result;
  },
  /** Pagination default */
  pageLimit: () => PAGE_LIMIT,
};
