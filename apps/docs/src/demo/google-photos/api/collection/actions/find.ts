"use server";

import { createAction, ActionError } from "@/lib/utils";
import { photo } from "@/demo/google-photos/api/photo";
import { data } from "../data";
import type { CollectionDetail } from "../types";

const COVER_LIMIT = 4;

async function _find(id: string): Promise<CollectionDetail> {
  await new Promise((r) => setTimeout(r, 200));
  const meta = data.byId(id);
  if (!meta) throw new ActionError("Collection not found");

  const page = await photo.findAll({ collectionId: id });

  return {
    id: meta.id,
    name: meta.name,
    kind: meta.kind,
    coverThumbs: page.items.slice(0, COVER_LIMIT).map((p) => p.thumbSrc),
    count: page.total,
    photos: page.items,
  };
}

export const find = createAction(_find);
