import { story } from "@/demo/voyage/api/story";
import FeedPage from "@/demo/voyage/page/feed";

export default async function Page() {
  // Server data so the feed (and its zoom cards) exists on first paint.
  const stories = await story.findAll();
  return <FeedPage initialStories={stories} />;
}
