import { createFileRoute } from "@tanstack/react-router";
import PostDetail from "~/components/posts/detail";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetailComponent,
});

function PostDetailComponent() {
  const { postId } = Route.useParams();
  return <PostDetail postId={postId} />;
}
