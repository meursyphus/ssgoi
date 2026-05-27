import { createAction } from "@/lib/utils";
import { photo } from "@/demo/google-photos/api/photo";
import { data } from "../data";
import type { CollectionSimple } from "../types";

const COVER_LIMIT = 4;

async function _findAll(): Promise<CollectionSimple[]> {
  const metas = data.all();

  // For each collection, hit the photo api to fill cover thumbs + count.
  // findAll's pagination limit (30) is large enough that one page is enough.
  const results = await Promise.all(
    metas.map(async (m) => {
      const page = await photo.findAll({ collectionId: m.id });
      return {
        id: m.id,
        name: m.name,
        kind: m.kind,
        coverThumbs: page.items.slice(0, COVER_LIMIT).map((p) => p.thumbSrc),
        count: page.total,
      } satisfies CollectionSimple;
    }),
  );

  return results;
}

export const findAll = createAction(_findAll);
