import PostDetail from "../components/posts/detail";
import type { Route } from "./+types/posts.$postId";

export default function PostDetailRoute({ params }: Route.ComponentProps) {
  return <PostDetail postId={params.postId} />;
}
