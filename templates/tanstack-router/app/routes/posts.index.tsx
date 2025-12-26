import { createFileRoute } from "@tanstack/react-router";
import PostsDemo from "~/components/posts";

export const Route = createFileRoute("/posts/")({
  component: PostsComponent,
});

function PostsComponent() {
  return <PostsDemo />;
}
