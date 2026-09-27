import { ArrowUpLeft, History } from "lucide-react";
import { RECENT_SEARCHES } from "../../mock-data";

/** Recent queries: the row runs the search, the arrow fills the box. */
export function RecentSearches({
  onPick,
}: {
  onPick: (query: string) => void;
}) {
  return (
    <ul className="pt-1">
      {RECENT_SEARCHES.map((query) => (
        <li key={query} className="flex items-center">
          <button
            type="button"
            onClick={() => onPick(query)}
            className="flex h-12 min-w-0 flex-1 items-center gap-4 pl-4 text-left text-[15px] active:bg-neutral-100"
          >
            <History className="h-5 w-5 shrink-0 text-neutral-700" />
            <span className="truncate">{query}</span>
          </button>
          <button
            type="button"
            onClick={() => onPick(`${query} `)}
            aria-label={`Edit "${query}"`}
            className="flex h-12 w-12 shrink-0 items-center justify-center active:bg-neutral-100"
          >
            <ArrowUpLeft className="h-5 w-5 text-neutral-700" />
          </button>
        </li>
      ))}
    </ul>
  );
}
