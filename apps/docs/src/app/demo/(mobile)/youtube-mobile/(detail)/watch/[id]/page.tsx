import { notFound } from "next/navigation";
import {
  findVideo,
  upNext,
  watchParent,
} from "@/demo/youtube-mobile/mock-data";
import WatchPage from "@/demo/youtube-mobile/page/watch";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = findVideo(id);
  if (!video) notFound();
  return (
    <WatchPage video={video} upNext={upNext(id)} parent={watchParent(id)} />
  );
}
