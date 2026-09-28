import { story } from "@/demo/voyage/api/story";
import ActivityPage from "@/demo/voyage/page/activity";

export default async function Page() {
  const sections = await story.findActivity();
  return <ActivityPage sections={sections} />;
}
