import { notFound } from "next/navigation";
import { findShort } from "@/demo/youtube-mobile/mock-data";
import ShortDetailPage from "@/demo/youtube-mobile/page/short-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const short = findShort(id);
  if (!short) notFound();
  return <ShortDetailPage short={short} />;
}
