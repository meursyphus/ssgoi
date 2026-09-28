import { prepareDoc, type PreparedDoc } from "./match";
import type { SearchIndex } from "./types";

let pending: Promise<PreparedDoc[]> | null = null;
let ready: PreparedDoc[] | null = null;

/** Fetches /search-index.json once and prepares it for matching. */
export function loadSearchIndex(): Promise<PreparedDoc[]> {
  pending ??= fetch("/search-index.json")
    .then((res) => {
      if (!res.ok) throw new Error(`search index: HTTP ${res.status}`);
      return res.json() as Promise<SearchIndex>;
    })
    .then((index) => {
      ready = index.docs.map((doc, i) => prepareDoc(doc, i));
      return ready;
    })
    .catch((error: unknown) => {
      pending = null;
      throw error;
    });
  return pending;
}

/** The prepared index if it already arrived, so a reopen renders at once. */
export function peekSearchIndex(): PreparedDoc[] | null {
  return ready;
}
