import { chat } from "@/demo/kakao-talk/api/chat";
import { friend } from "@/demo/kakao-talk/api/friend";
import ProfileDetailPage from "@/demo/kakao-talk/page/profile-detail";

const one = (v: string | string[] | undefined) =>
  typeof v === "string" ? v : undefined;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    room?: string | string[];
    via?: string | string[];
  }>;
}) {
  const { id } = await params;
  const { room, via } = await searchParams;
  const [data, dmThreadId] = await Promise.all([
    friend.find(id),
    chat.findDmThreadId(id),
  ]);
  return (
    <ProfileDetailPage
      initialData={data}
      dmThreadId={dmThreadId}
      openedFromRoomId={one(room)}
      openedVia={one(via)}
    />
  );
}
