import { createFileRoute } from "@tanstack/react-router";
import ProfileDemo from "~/components/profile";

export const Route = createFileRoute("/profile/")({
  component: ProfileComponent,
});

function ProfileComponent() {
  return <ProfileDemo />;
}
