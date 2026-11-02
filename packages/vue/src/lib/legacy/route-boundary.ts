// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import { defineComponent, type PropType } from "vue";
import { setupRouteBoundary } from "../layout-boundary";
import type { SsgoiFramework } from "../types";

/** @deprecated Will be removed in 8.0.0. Declare layout scopes in `config.layouts` and use `SsgoiLayoutBoundary` from "@ssgoi/vue" instead. */
export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

/** @deprecated Will be removed in 8.0.0. Declare layout scopes in `config.layouts` and use `SsgoiLayoutBoundary` from "@ssgoi/vue" instead. */
export interface SsgoiRouteBoundaryProps {
  as?: keyof HTMLElementTagNameMap;
  routeKey?: string | number;
  resolve?: (location: { pathname: string }) => RouteBoundaryState;
}

/**
 * Legacy subpath boundary; each subpath builds its framework from its own
 * router hook instead of reading `<Ssgoi :framework>`.
 * @deprecated Will be removed in 8.0.0. Use `SsgoiLayoutBoundary` from "@ssgoi/vue" instead.
 */
export const createSubpathRouteBoundary = (
  useFramework: () => SsgoiFramework,
) =>
  defineComponent({
    name: "SsgoiRouteBoundary",
    inheritAttrs: false,
    props: {
      as: {
        type: String as PropType<keyof HTMLElementTagNameMap>,
        default: "div",
      },
      routeKey: { type: [String, Number], default: undefined },
      resolve: {
        type: Function as PropType<SsgoiRouteBoundaryProps["resolve"]>,
        default: undefined,
      },
    },
    setup(props, context) {
      const framework = useFramework();
      // Observe the committed router path before routed content is patched.
      // Nuxt's delayed useRoute updates after page content and is too late for OUT.
      return setupRouteBoundary(
        () => {
          const route = framework.getRoute();
          const state = props.resolve?.(route) ?? { id: route.pathname };
          return {
            id: state.id,
            key: props.routeKey ?? state.key ?? state.id,
          };
        },
        () => props.as,
        context,
      );
    },
  });
