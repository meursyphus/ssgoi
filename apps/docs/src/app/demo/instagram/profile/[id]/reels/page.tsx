import ProfileReelsPage from "@/demo/instagram/page/profile-reels";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileReelsPage id={id} />;
}
