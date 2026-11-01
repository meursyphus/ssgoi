import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_top-level/products/")({
  beforeLoad: () => {
    throw redirect({ to: "/products/all" });
  },
});
