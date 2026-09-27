import { story } from "@/demo/voyage/api/story";
import SavedPage from "@/demo/voyage/page/saved";

export default async function Page() {
  const stories = await story.findSaved();
  return <SavedPage initialStories={stories} />;
}
