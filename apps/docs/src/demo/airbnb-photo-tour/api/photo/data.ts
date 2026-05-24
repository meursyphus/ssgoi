import type { PhotoCategory, PhotoSimple } from "./types";

type RawPhoto = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

type RawCategory = {
  id: string;
  label: string;
  coverIdx: number;
  photos: RawPhoto[];
};

// picsum.photos w/ deterministic seeds — every URL resolves and stays stable
// across reloads. Real Airbnb photos would need their CDN; we just need
// guaranteed images to demonstrate the hero transition.
function pic(seed: string, w = 1600, h = 1067): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const raw: RawCategory[] = [
  {
    id: "kitchen",
    label: "주방",
    coverIdx: 0,
    photos: [
      {
        id: "kitchen-1",
        src: pic("airbnb-kitchen-1"),
        alt: "주방 1",
        width: 1600,
        height: 1067,
      },
      {
        id: "kitchen-2",
        src: pic("airbnb-kitchen-2"),
        alt: "주방 2",
        width: 1600,
        height: 1067,
      },
      {
        id: "kitchen-3",
        src: pic("airbnb-kitchen-3"),
        alt: "주방 3",
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: "dining",
    label: "식사 공간",
    coverIdx: 0,
    photos: [
      {
        id: "dining-1",
        src: pic("airbnb-dining-1"),
        alt: "식사 공간 1",
        width: 1600,
        height: 1067,
      },
      {
        id: "dining-2",
        src: pic("airbnb-dining-2"),
        alt: "식사 공간 2",
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: "bedroom-1",
    label: "침실 1",
    coverIdx: 0,
    photos: [
      {
        id: "bedroom1-1",
        src: pic("airbnb-bedroom1-1"),
        alt: "침실 1-1",
        width: 1600,
        height: 1067,
      },
      {
        id: "bedroom1-2",
        src: pic("airbnb-bedroom1-2"),
        alt: "침실 1-2",
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: "bedroom-2",
    label: "침실 2",
    coverIdx: 0,
    photos: [
      {
        id: "bedroom2-1",
        src: pic("airbnb-bedroom2-1"),
        alt: "침실 2-1",
        width: 1600,
        height: 1067,
      },
      {
        id: "bedroom2-2",
        src: pic("airbnb-bedroom2-2"),
        alt: "침실 2-2",
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: "bath",
    label: "욕실",
    coverIdx: 0,
    photos: [
      {
        id: "bath-1",
        src: pic("airbnb-bath-1"),
        alt: "욕실 1",
        width: 1600,
        height: 1067,
      },
      {
        id: "bath-2",
        src: pic("airbnb-bath-2"),
        alt: "욕실 2",
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: "extra",
    label: "추가 사진",
    coverIdx: 0,
    photos: [
      {
        id: "extra-1",
        src: pic("airbnb-extra-1"),
        alt: "추가 사진 1",
        width: 1600,
        height: 1067,
      },
      {
        id: "extra-2",
        src: pic("airbnb-extra-2"),
        alt: "추가 사진 2",
        width: 1600,
        height: 1067,
      },
    ],
  },
];

function toSimple(p: RawPhoto): PhotoSimple {
  return {
    id: p.id,
    src: p.src,
    alt: p.alt,
    aspectRatio: `${p.width}/${p.height}`,
  };
}

function buildCategory(c: RawCategory): PhotoCategory {
  return {
    id: c.id,
    label: c.label,
    coverSrc: c.photos[c.coverIdx].src,
    photos: c.photos.map(toSimple),
  };
}

function totalCount(): number {
  return raw.reduce((sum, c) => sum + c.photos.length, 0);
}

function findCategoryByPhotoId(id: string): RawCategory | null {
  return raw.find((c) => c.photos.some((p) => p.id === id)) ?? null;
}

export const data = {
  allCategories(): PhotoCategory[] {
    return raw.map(buildCategory);
  },
  totalLabel(): string {
    return `사진 ${totalCount()}장`;
  },
  findPhotoCategory(id: string) {
    return findCategoryByPhotoId(id);
  },
  findPhotoRaw(id: string): RawPhoto | null {
    for (const c of raw) {
      const p = c.photos.find((x) => x.id === id);
      if (p) return p;
    }
    return null;
  },
};

export type { RawPhoto, RawCategory };
