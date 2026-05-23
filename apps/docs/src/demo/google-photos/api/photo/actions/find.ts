"use server";

import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";
import type { PhotoDetail } from "../types";

async function _find(id: string): Promise<PhotoDetail> {
  await new Promise((r) => setTimeout(r, 180));
  const photo = data.byId(id);
  if (!photo) throw new ActionError("Photo not found");
  return photo;
}

export const find = createAction(_find);
