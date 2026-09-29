import { notFound } from "next/navigation";
import { profile as profileAPI } from "@/demo/instagram/api/profile";
import FollowsPage from "@/demo/instagram/page/follows";

const TABS = ["followers", "following"] as const;

export default async function Page({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const { tab } = await params;
  const initialTab = TABS.find((t) => t === tab);
  if (!initialTab) notFound();
  const [me, follows] = await Promise.all([
    profileAPI.getMe(),
    profileAPI.findFollows(),
  ]);
  return <FollowsPage initialTab={initialTab} me={me} initialData={follows} />;
}
