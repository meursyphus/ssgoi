import type { Query } from "comwit";
import type {
  PhotoCategory,
  PhotoDetail,
  PhotoSimple,
  PhotoTour,
} from "@/demo/airbnb-photo-tour/api/photo";

export type PhotoState = {
  tour: Query<PhotoTour, void>;
  currentPhoto: PhotoDetail | null;
};

export type PhotoActions = {
  initTour(tour: PhotoTour): void;
  initDetail(detail: PhotoDetail): void;
  loadTour(): Promise<void>;
};

export type { PhotoSimple, PhotoDetail, PhotoTour, PhotoCategory };
