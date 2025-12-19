import FeedDetail from "../components/profile/feed-detail";
import type { Route } from "./+types/profile.$postId";

export default function ProfileDetailRoute({ params }: Route.ComponentProps) {
  return <FeedDetail postId={params.postId} />;
}
