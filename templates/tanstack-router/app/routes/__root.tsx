import { createRootRoute, Outlet } from "@tanstack/react-router";
import DemoWrapper from "~/components/demo-wrapper";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <DemoWrapper>
      <Outlet />
    </DemoWrapper>
  );
}
