import { createAction } from "@/lib/utils";
import { photo } from "@/demo/google-photos/api/photo";
import { data } from "../data";
import type { SearchExplore, SearchablePhoto } from "../types";

async function _explore(): Promise<SearchExplore> {
  const { items } = await photo.findAll();
  // The detail response carries description/location — what the box matches.
  const photos: SearchablePhoto[] = await Promise.all(
    items.map(async (p) => {
      const detail = await photo.find(p.id);
      return {
        ...p,
        description: detail.description,
        location: detail.location,
      };
    }),
  );
  const thumbOf = (id: string) =>
    photos.find((p) => p.id === id)?.thumbSrc ?? "";

  return {
    faces: data.faces().map((f) => ({
      id: f.id,
      name: f.name,
      thumbSrc: thumbOf(f.photoId),
      collectionId: data.facesCollectionId(),
    })),
    places: data.places().map((p) => ({
      id: p.id,
      name: p.name,
      thumbSrc: thumbOf(p.photoId),
      collectionId: data.placesCollectionId(),
    })),
    categories: data.categories(),
    photos,
  };
}

export const explore = createAction(_explore);
