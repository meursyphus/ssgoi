import { useParams } from "@solidjs/router";
import { PinterestDetailPage } from "../../components/pinterest";

export default function PinterestDetailRoute() {
  const params = useParams();
  return <PinterestDetailPage pinId={params.pinId!} />;
}
