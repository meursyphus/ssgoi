import ProfileGridPage from "@/demo/instagram/page/profile-grid";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileGridPage id={id} />;
}
