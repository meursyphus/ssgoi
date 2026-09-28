import { createAction, ActionError } from "@/lib/utils";
import { COLLECTION_PHOTO_IDS, data } from "../data";
import type { PhotoDetail } from "../types";

async function _find(id: string): Promise<PhotoDetail> {
  const photo = data.byId(id);
  if (!photo) throw new ActionError("Photo not found");
  return {
    ...photo,
    favorite: COLLECTION_PHOTO_IDS["col-favorite"]?.includes(id) ?? false,
  };
}

export const find = createAction(_find);
