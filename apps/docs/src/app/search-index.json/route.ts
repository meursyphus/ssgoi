import { buildSearchIndex } from "@/lib/search/build-index";
import type { SearchIndex } from "@/lib/search/types";

// No segment config on purpose: `dynamic = "force-static"` breaks under
// cacheComponents (see blog/rss.xml). The index is built from in-bundle data,
// so it is computed once per isolate and served from memory after that.
let body: string | undefined;

export function GET() {
  body ??= JSON.stringify({
    v: 1,
    docs: buildSearchIndex(),
  } satisfies SearchIndex);

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
