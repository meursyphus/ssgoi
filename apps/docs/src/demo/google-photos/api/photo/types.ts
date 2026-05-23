export interface PhotoAPI {
  /** Photo list — supports collection filter + pagination */
  findAll: (filter?: FindAllFilter) => Promise<Pageable<PhotoSimple>>;
  /** Photo detail */
  find: (id: string) => Promise<PhotoDetail>;
}

export type FindAllFilter = {
  /** Filter inside a collection */
  collectionId?: string;
  /** 1-based */
  page?: number;
};

export type Pageable<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PhotoSimple = {
  id: string;
  /** Full-resolution src */
  src: string;
  /** Small grid-cell image */
  thumbSrc: string;
  width: number;
  height: number;
  /** Pre-formatted W/H string ("1600/1067") for the `data-hero-aspect-ratio`
   *  attribute. Derived from width/height in the API layer so consumers don't
   *  re-compute on every render. */
  aspectRatio: string;
  /** Pre-formatted label like "2026.05.16" */
  takenAt: string;
};

export type PhotoDetail = PhotoSimple & {
  /** User-facing description, e.g. "Sunset from the peak" */
  description?: string;
  /** Location label, e.g. "Seoul, Seongsu-dong" */
  location?: string;
  /** Pre-formatted, e.g. "3.4 MB" */
  fileSize: string;
  /** Pre-formatted, e.g. "iPhone (this device)" or "Google Drive" */
  storage: string;
  /** Optional camera/device label, e.g. "iPhone 15 Pro · 24mm · ƒ/1.78" */
  device?: string;
};
