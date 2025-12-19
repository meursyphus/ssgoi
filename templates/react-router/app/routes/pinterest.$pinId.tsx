import PinterestDetail from "../components/pinterest/detail";
import type { Route } from "./+types/pinterest.$pinId";

export default function PinterestDetailRoute({ params }: Route.ComponentProps) {
  return <PinterestDetail pinId={params.pinId} />;
}
