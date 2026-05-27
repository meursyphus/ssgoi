import { createAction } from "@/lib/utils";
import { data } from "../data";
import type {
  FindAllFilter,
  Pageable,
  PhotoDetail,
  PhotoSimple,
} from "../types";

function toSimple(detail: PhotoDetail): PhotoSimple {
  return {
    id: detail.id,
    src: detail.src,
    thumbSrc: detail.thumbSrc,
    width: detail.width,
    height: detail.height,
    aspectRatio: detail.aspectRatio,
    takenAt: detail.takenAt,
  };
}

async function _findAll(
  filter: FindAllFilter = {},
): Promise<Pageable<PhotoSimple>> {
  const limit = data.pageLimit();
  const page = filter.page && filter.page > 0 ? filter.page : 1;

  const source = filter.collectionId
    ? data.byCollection(filter.collectionId)
    : data.all();

  const start = (page - 1) * limit;
  const items = source.slice(start, start + limit).map(toSimple);
  const total = source.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { items, total, page, limit, totalPages };
}

export const findAll = createAction(_findAll);
