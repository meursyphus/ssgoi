import { search } from "@/demo/google-photos/api/search";
import SearchPage from "@/demo/google-photos/page/search";

export default async function Page() {
  const explore = await search.explore();
  return <SearchPage explore={explore} />;
}
