import { friend } from "@/demo/kakao-talk/api/friend";
import ProfileDetailPage from "@/demo/kakao-talk/page/profile-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await friend.find(id);
  return <ProfileDetailPage initialData={data} />;
}
