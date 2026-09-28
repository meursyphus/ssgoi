import { pin } from "@/demo/pinterest/api/pin";
import SearchResultPage from "@/demo/pinterest/page/search-result";

export default async function Page({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  const { query: raw } = await params;
  const query = decodeURIComponent(raw);
  // Each results page owns its own pins, so a result → result drill never
  // swaps the outgoing page's grid mid-slide.
  const [results, guides] = await Promise.all([
    pin.search(query),
    pin.findGuides(query),
  ]);
  return <SearchResultPage query={query} results={results} guides={guides} />;
}
