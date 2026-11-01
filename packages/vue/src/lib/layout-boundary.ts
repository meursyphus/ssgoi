import {
  computed,
  defineComponent,
  h,
  type PropType,
  type SetupContext,
} from "vue";
import { useSsgoiFramework } from "./context";
import type { SsgoiFramework } from "./types";

type Route = ReturnType<SsgoiFramework["getRoute"]>;
type BoundaryResult = { id?: string; key?: string | number };
type BoundaryInput =
  | string
  | BoundaryResult
  | ((route: Route) => string | BoundaryResult);

export interface SsgoiLayoutBoundaryProps {
  as?: keyof HTMLElementTagNameMap;
  /**
   * A string is a fixed lifetime key; an object fixes `id` and/or `key`; a
   * function computes either from the framework route. Defaults: `id` is the
   * pathname, `key` is the `id`.
   */
  boundary?: BoundaryInput;
}

/** Shared setup; returns the render function of a keyed boundary element. */
export function setupRouteBoundary(
  framework: () => SsgoiFramework,
  input: () => BoundaryInput | undefined,
  as: () => keyof HTMLElementTagNameMap,
  { attrs, slots }: Pick<SetupContext, "attrs" | "slots">,
) {
  const resolver = computed(() => {
    const current = input();
    return typeof current === "function" ? current : () => current;
  });
  // Observe the committed router path before routed content is patched.
  // Nuxt's delayed useRoute updates after page content and is too late for OUT.
  const boundary = computed(() => {
    const route = framework().getRoute();
    const result = resolver.value(route);
    const normalized =
      typeof result === "string" ? { key: result } : (result ?? {});
    const id = normalized.id ?? route.pathname;
    return { id, key: normalized.key ?? id };
  });

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
    boundary: {
      type: [String, Object, Function] as PropType<BoundaryInput>,
      default: undefined,
    },
  },
  setup(props, context) {
    const framework = useSsgoiFramework();
    if (!framework?.value) throwMissingFramework();
    return setupRouteBoundary(
      // Read the framework inside the getter so a replaced object is tracked too.
      () => framework.value ?? throwMissingFramework(),
      () => props.boundary,
      () => props.as,
      context,
    );
  },
});
