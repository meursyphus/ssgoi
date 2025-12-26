import { createFileRoute } from "@tanstack/react-router";
import PinterestDemo from "~/components/pinterest";

export const Route = createFileRoute("/pinterest/")({
  component: PinterestComponent,
});

function PinterestComponent() {
  return <PinterestDemo />;
}
