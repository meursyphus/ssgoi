import { createFileRoute } from "@tanstack/react-router";
import PinterestDetail from "~/components/pinterest/detail";

export const Route = createFileRoute("/pinterest/$pinId")({
  component: PinterestDetailComponent,
});

function PinterestDetailComponent() {
  const { pinId } = Route.useParams();
  return <PinterestDetail pinId={pinId} />;
}
