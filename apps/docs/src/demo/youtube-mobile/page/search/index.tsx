"use client";

import { searchVideos } from "../../mock-data";
import {
  forgetRememberedState,
  useRememberedState,
} from "../shared/remembered-state";
import { WideVideoCard } from "../shared/video-card";
import { RecentSearches } from "./recent-searches";
import { SearchHeader } from "./search-header";

const QUERY_KEY = "search-query";

/**
 * /search fades in over the current tab. The query is remembered, so coming
 * back from a result renders the same list (and its zoom exit key) at once;
 * leaving with the back arrow forgets it, so the next search starts empty.
 */
export default function SearchPage() {
  const [query, setQuery] = useRememberedState(QUERY_KEY, "");
  const results = searchVideos(query);
  const typed = query.trim().length > 0;

  return (
    <main className="min-h-full grow bg-white pb-6 text-neutral-950">
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        onLeave={() => forgetRememberedState(QUERY_KEY)}
      />

      {!typed && <RecentSearches onPick={setQuery} />}

      {typed && results.length > 0 && (
        <section className="pt-2">
          {results.map((video) => (
            <WideVideoCard key={video.id} video={video} />
          ))}
        </section>
      )}

      {typed && results.length === 0 && (
        <p className="px-10 pt-16 text-center text-[14px] leading-5 text-neutral-500">
          No results for &ldquo;{query.trim()}&rdquo;. Try a different keyword,
          like &ldquo;jazz&rdquo; or &ldquo;sourdough&rdquo;.
        </p>
      )}
    </main>
  );
}
