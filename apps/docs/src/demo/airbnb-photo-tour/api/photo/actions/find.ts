"use server";

import { ActionError, createAction } from "@/lib/utils";
import { data } from "../data";
import type { PhotoDetail } from "../types";

async function _find(id: string): Promise<PhotoDetail> {
  await new Promise((r) => setTimeout(r, 120));
  const category = data.findPhotoCategory(id);
  if (!category) throw new ActionError("사진을 찾을 수 없습니다");

  const photos = category.photos;
  const idx = photos.findIndex((p) => p.id === id);
  const raw = photos[idx];
  const prev = photos[(idx - 1 + photos.length) % photos.length];
  const next = photos[(idx + 1) % photos.length];

  return {
    id: raw.id,
    src: raw.src,
    alt: raw.alt,
    aspectRatio: `${raw.width}/${raw.height}`,
    categoryLabel: category.label,
    indexInCategory: idx + 1,
    categoryTotal: photos.length,
    prevId: prev.id,
    nextId: next.id,
  };
}

export const find = createAction(_find);
