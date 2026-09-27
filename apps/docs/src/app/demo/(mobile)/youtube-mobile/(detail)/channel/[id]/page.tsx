import { notFound } from "next/navigation";
import { findChannel, videosByChannel } from "@/demo/youtube-mobile/mock-data";
import ChannelPage from "@/demo/youtube-mobile/page/channel";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const channel = findChannel(id);
  if (!channel) notFound();
  return <ChannelPage channel={channel} videos={videosByChannel(id)} />;
}
