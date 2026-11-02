import { createFileRoute } from "@tanstack/react-router";
import PostsDemo from "~/components/posts";

export const Route = createFileRoute("/_top-level/posts")({
  component: PostsComponent,
});

function PostsComponent() {
  return <PostsDemo />;
}
