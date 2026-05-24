import { model, query } from "comwit";
import { photo as photoAPI } from "@/demo/airbnb-photo-tour/api/photo";
import type { PhotoState } from "./types";

export const photo = model<PhotoState>({
  tour: query<PhotoState["tour"]["data"], void>({
    initialData: { title: "사진 투어", totalLabel: "", categories: [] },
    queryFn: () => photoAPI.getTour(),
  }),
  currentPhoto: null,
});
