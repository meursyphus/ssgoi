import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  beforeLoad: () => {
    throw redirect({ to: "/products/all" });
  },
});
