import { createFileRoute } from "@tanstack/react-router";
import ProfileDemo from "~/components/profile";

export const Route = createFileRoute("/_top-level/profile")({
  component: ProfileComponent,
});

function ProfileComponent() {
  return <ProfileDemo />;
}
