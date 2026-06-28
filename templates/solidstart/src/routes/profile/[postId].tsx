import { useParams } from "@solidjs/router";
import { ProfileDetailPage } from "../../components/profile";

export default function ProfileDetailRoute() {
  const params = useParams();
  return <ProfileDetailPage postId={params.postId!} />;
}
