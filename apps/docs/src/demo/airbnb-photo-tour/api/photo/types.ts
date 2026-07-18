export interface PhotoAPI {
  /** Get the full photo tour — categories with their photos. */
  getTour: () => Promise<PhotoTour>;
  /** Get a single photo (with neighbors for prev/next). */
  find: (id: string) => Promise<PhotoDetail>;
}

export type PhotoTour = {
  /** Tour title, e.g. "사진 투어" */
  title: string;
  /** Total photo count across all categories — pre-formatted in API */
  totalLabel: string;
  categories: PhotoCategory[];
};

export type PhotoCategory = {
  id: string;
  /** Display label, e.g. "주방" */
  label: string;
  /** Cover image (square thumbnail for the top scroller) */
  coverSrc: string;
  /** Photos belonging to this category */
  photos: PhotoSimple[];
};

export type PhotoSimple = {
  id: string;
  /** Full-resolution src */
  src: string;
  /** Display label or alt text */
  alt: string;
  /** Native image dimensions double as early intrinsic-ratio hints. */
  width: number;
  height: number;
};

export type PhotoDetail = PhotoSimple & {
  /** Category this photo lives in, for the detail header */
  categoryLabel: string;
  /** 1-based index within the category */
  indexInCategory: number;
  /** Total count within the category */
  categoryTotal: number;
  /** Previous photo id within the category (wraps around) */
  prevId: string;
  /** Next photo id within the category (wraps around) */
  nextId: string;
};
