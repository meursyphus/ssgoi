import { createAction } from "@/lib/utils";
import { photo } from "@/demo/google-photos/api/photo";
import { collection } from "@/demo/google-photos/api/collection";
import { data } from "../data";
import type { NotificationItem } from "../types";

async function _findAll(): Promise<NotificationItem[]> {
  return Promise.all(
    data.all().map(async (n) => {
      // Photo rows show that photo; collection rows show their cover.
      const { coverPhotoId, ...item } = n;
      const cover =
        n.target.type === "photo"
          ? await photo.find(n.target.photoId)
          : coverPhotoId
            ? await photo.find(coverPhotoId)
            : (await collection.find(n.target.collectionId)).photos[0];
      return {
        ...item,
        thumbSrc: cover?.thumbSrc ?? "",
        width: cover?.width ?? 1,
        height: cover?.height ?? 1,
      } satisfies NotificationItem;
    }),
  );
}

export const findAll = createAction(_findAll);
