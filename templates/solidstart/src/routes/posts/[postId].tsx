import { useParams } from "@solidjs/router";
import { PostDetailPage } from "../../components/posts";

export default function PostDetailRoute() {
  const params = useParams();
  return <PostDetailPage postId={params.postId!} />;
}
