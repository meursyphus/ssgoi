import { post as postAPI } from "@/demo/instagram/api/post";
import CommentsSheetPage from "@/demo/instagram/page/comments-sheet";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [initialData, comments] = await Promise.all([
    postAPI.find(id),
    postAPI.findComments(id),
  ]);
  return <CommentsSheetPage initialData={initialData} comments={comments} />;
}
