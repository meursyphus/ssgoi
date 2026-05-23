import type { Query } from "comwit";
import type {
  Pageable,
  PhotoSimple,
  PhotoDetail,
} from "@/demo/google-photos/api/photo";

export type PhotoState = {
  photos: Query<Pageable<PhotoSimple>, void>;
  currentPhoto: PhotoDetail | null;
};

export type PhotoActions = {
  init(detail: PhotoDetail): void;
  loadAll(): Promise<void>;
};

export type { PhotoSimple, PhotoDetail, Pageable };
