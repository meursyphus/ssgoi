import ProfileRemixPage from "@/demo/instagram/page/profile-remix";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileRemixPage id={id} />;
}
