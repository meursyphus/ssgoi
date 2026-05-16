import SearchResultPage from "@/demo/pinterest/page/search-result";

export default async function Page({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  const { query } = await params;
  return <SearchResultPage query={decodeURIComponent(query)} />;
}
