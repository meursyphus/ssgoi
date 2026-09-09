import { useRouter } from "vue-router";
import { createRouteBoundary } from "./route-boundary";

export type {
  RouteBoundaryState,
  SsgoiRouteBoundaryProps,
} from "./route-boundary";

export const SsgoiRouteBoundary = createRouteBoundary(() => {
  const router = useRouter();
  return () => router.currentRoute.value.path;
});
