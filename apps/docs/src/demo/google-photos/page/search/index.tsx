"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import type {
  SearchExplore,
  SearchablePhoto,
} from "@/demo/google-photos/api/search";
import { PhotoGridLink } from "@/demo/google-photos/page/shared/photo-grid-link";
import { SearchHeader } from "./search-header";
import {
  CategoryGrid,
  FaceRow,
  PlaceRow,
  SectionTitle,
} from "./explore-sections";

const RECENT_COUNT = 9;

function matches(photo: SearchablePhoto, q: string) {
  return [photo.description, photo.location, photo.takenAt].some((field) =>
    field?.toLowerCase().includes(q),
  );
}

function PhotoGrid({ photos }: { photos: SearchablePhoto[] }) {
  return (
    <div className="grid grid-cols-3 gap-[2px] bg-white">
      {photos.map((p) => (
        <PhotoGridLink key={p.id} photo={p} />
      ))}
    </div>
  );
}

/**
 * Full-screen search. The explore sections only link to collections; the
 * photo grids (recent or results) are the only hero sources on the page, so
 * each photo id carries one exit key.
 *
 * The query lives in `?q=` (history.replaceState, no refetch) so coming back
 * from a result renders the same results on the first frame and the photo
 * can shrink back into its cell.
 */
export default function SearchPage({ explore }: { explore: SearchExplore }) {
  const params = useSearchParams();
  const [query, setQueryState] = useState(() => params.get("q") ?? "");
  const setQuery = (value: string) => {
    setQueryState(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  };
  const q = query.trim().toLowerCase();
  const results = q ? explore.photos.filter((p) => matches(p, q)) : [];

  return (
    <div className="block min-h-full bg-white pb-10">
      <SearchHeader query={query} onQueryChange={setQuery} />
      {q ? (
        results.length > 0 ? (
          <section className="pt-3">
            <p className="px-4 pb-3 text-[13px] text-neutral-500">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            <PhotoGrid photos={results} />
          </section>
        ) : (
          <div className="flex flex-col items-center px-8 pt-20 text-center">
            <SearchX className="h-10 w-10 text-neutral-300" />
            <p className="mt-4 text-[15px] font-medium text-neutral-800">
              No results for “{query.trim()}”
            </p>
            <p className="mt-1 text-[13px] text-neutral-500">
              Try a place, like Seoul, or a thing, like cat
            </p>
          </div>
        )
      ) : (
        <>
          <FaceRow faces={explore.faces} />
          <PlaceRow places={explore.places} />
          <CategoryGrid categories={explore.categories} />
          <section className="pt-7">
            <SectionTitle>Recently added</SectionTitle>
            <PhotoGrid photos={explore.photos.slice(0, RECENT_COUNT)} />
          </section>
        </>
      )}
    </div>
  );
}
