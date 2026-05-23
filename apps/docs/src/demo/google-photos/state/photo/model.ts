import { model, query, keepPreviousData } from "comwit";
import { photo as photoAPI } from "@/demo/google-photos/api/photo";
import type { PhotoState } from "./types";

export const photo = model<PhotoState>({
  photos: query<PhotoState["photos"]["data"], void>({
    initialData: { items: [], total: 0, page: 1, limit: 30, totalPages: 0 },
    queryFn: () => photoAPI.findAll(),
    placeholderData: keepPreviousData,
  }),
  currentPhoto: null,
});
