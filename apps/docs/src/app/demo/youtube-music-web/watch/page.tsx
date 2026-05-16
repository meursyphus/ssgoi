import { song } from "@/demo/youtube-music-web/api/song";
import WatchPage from "@/demo/youtube-music-web/page/watch";

const DEFAULT_VIDEO_ID = "wggigwtz4dQ";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const id = v && v.length > 0 ? v : DEFAULT_VIDEO_ID;
  const data = await song.find(id);
  return <WatchPage initialData={data} />;
}
