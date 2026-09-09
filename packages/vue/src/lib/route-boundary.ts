import { computed, defineComponent, h, type PropType } from "vue";

export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

export interface SsgoiRouteBoundaryProps {
  as?: keyof HTMLElementTagNameMap;
  routeKey?: string | number;
  resolve?: (location: { pathname: string }) => RouteBoundaryState;
}

/** Shared rendering only; each subpath supplies its own router hook. */
export function createRouteBoundary(usePathname: () => () => string) {
  return defineComponent({
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
    setup(props, { attrs, slots }) {
      const pathname = usePathname();
      // Observe the committed router path before routed content is patched.
      // Nuxt's delayed useRoute updates after page content and is too late for OUT.
      const boundary = computed(() => {
        const path = pathname();
        return props.resolve?.({ pathname: path }) ?? { id: path };
      });

      return () =>
        h(
          props.as,
          {
            ...attrs,
            key: props.routeKey ?? boundary.value.key ?? boundary.value.id,
            "data-ssgoi-transition": boundary.value.id,
          },
          slots.default?.(),
        );
    },
  });
}
