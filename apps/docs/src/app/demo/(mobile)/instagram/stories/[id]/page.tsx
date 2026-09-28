import { profile as profileAPI } from "@/demo/instagram/api/profile";
import StoryViewerPage from "@/demo/instagram/page/story-viewer";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialData = await profileAPI.findStory(decodeURIComponent(id));
  return <StoryViewerPage initialData={initialData} />;
}
