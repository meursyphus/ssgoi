import { story } from "@/demo/voyage/api/story";
import ProfilePage from "@/demo/voyage/page/profile";

export default async function Page() {
  const profile = await story.findProfile();
  return <ProfilePage profile={profile} />;
}
