import { createFileRoute } from "@tanstack/react-router";
import FeedDetail from "~/components/profile/feed-detail";

export const Route = createFileRoute("/profile/$postId")({
  component: ProfileDetailComponent,
});

function ProfileDetailComponent() {
  const { postId } = Route.useParams();
  return <FeedDetail postId={postId} />;
}
