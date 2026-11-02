import {
  computed,
  defineComponent,
  h,
  type PropType,
  type SetupContext,
} from "vue";
import { useLayoutDepth, useSsgoiLayout } from "./context";

export interface SsgoiLayoutBoundaryProps {
  as?: keyof HTMLElementTagNameMap;
}

/** Shared setup; renders an element keyed by `state().key`. */
export function setupRouteBoundary(
  state: () => { id: string; key: string | number },
  as: () => keyof HTMLElementTagNameMap,
  { attrs, slots }: Pick<SetupContext, "attrs" | "slots">,
) {
  const boundary = computed(state);

  return () =>
    h(
      as(),
      {
        ...attrs,
        key: boundary.value.key,
        "data-ssgoi-transition": boundary.value.id,
      },
      slots.default?.(),
    );
}

function throwMissingFramework(): never {
  throw new Error(
    'SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi :framework="{ getRoute }">.',
  );
}

export const SsgoiLayoutBoundary = defineComponent({
  name: "SsgoiLayoutBoundary",
  inheritAttrs: false,
  props: {
    as: {
      type: String as PropType<keyof HTMLElementTagNameMap>,
      default: "div",
    },
  },
  setup(props, context) {
    const layout = useSsgoiLayout();
    if (!layout?.value) throwMissingFramework();
    const depth = useLayoutDepth();
    // The config's layout scope at this depth keeps the DOM; past the declared
    // scopes every route path remounts.
    return setupRouteBoundary(
      () => {
        const { routePath, chain } = layout.value ?? throwMissingFramework();
        return { id: routePath, key: chain[depth] ?? routePath };
      },
      () => props.as,
      context,
    );
  },
});
