// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import { useRouter } from "nuxt/app";
import { createSubpathRouteBoundary } from "./route-boundary";

export type {
  RouteBoundaryState,
  SsgoiRouteBoundaryProps,
} from "./route-boundary";

/**
 * @experimental nuxt integration. The API may change.
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/vue" with `<Ssgoi :framework="{ getRoute: () => ({ pathname: router.currentRoute.value.path }) }">` (`useRouter` from "nuxt/app") instead.
 */
export const SsgoiRouteBoundary = createSubpathRouteBoundary(() => {
  const router = useRouter();
  return { getRoute: () => ({ pathname: router.currentRoute.value.path }) };
});
