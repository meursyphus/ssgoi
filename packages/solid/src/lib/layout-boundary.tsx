import {
  createMemo,
  Show,
  splitProps,
  type Accessor,
  type JSX,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { useSsgoiFramework } from "./context";
import type { SsgoiFramework } from "./types";

type Route = ReturnType<SsgoiFramework["getRoute"]>;
type BoundaryResult = { id?: string; key?: string | number };
type BoundaryInput =
  | string
  | BoundaryResult
  | ((route: Route) => string | BoundaryResult);

export type SsgoiLayoutBoundaryProps = JSX.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  /**
   * A string is a fixed lifetime key; an object fixes `id` and/or `key`; a
   * function computes either from the framework route. Defaults: `id` is the
   * pathname, `key` is the `id`.
   */
  boundary?: BoundaryInput;
};

/** Shared rendering; callers supply the framework the boundary reads. */
export function RouteBoundary(
  props: SsgoiLayoutBoundaryProps & { framework: Accessor<SsgoiFramework> },
) {
  const [local, rest] = splitProps(props, [
    "children",
    "as",
    "boundary",
    "framework",
  ]);
  const resolver = createMemo(() => {
    const input = local.boundary;
    return typeof input === "function" ? input : () => input;
  });
  const boundary = createMemo(() => {
    const route = local.framework().getRoute();
    const result = resolver()(route);
    const normalized =
      typeof result === "string" ? { key: result } : (result ?? {});
    const id = normalized.id ?? route.pathname;
    return { id, key: normalized.key ?? id };
  });
  // Show uses truthiness. A token also supports valid keys such as 0 and "".
  const lifetime = createMemo<{ key: string | number }>((previous) => {
    const key = boundary().key;
    return previous?.key === key ? previous : { key };
  });

  return (
    <Show when={lifetime()} keyed>
      {(_lifetime) => (
        <Dynamic
          component={local.as ?? "div"}
          {...rest}
          data-ssgoi-transition={boundary().id}
        >
          {local.children}
        </Dynamic>
      )}
    </Show>
  );
}

function throwMissingFramework(): never {
  throw new Error(
    "SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ getRoute }}>.",
  );
}

export function SsgoiLayoutBoundary(props: SsgoiLayoutBoundaryProps) {
  const framework = useSsgoiFramework();
  if (!framework?.()) throwMissingFramework();
  // Read the framework inside the accessor so a replaced object is tracked too.
  return (
    <RouteBoundary
      {...props}
      framework={() => framework() ?? throwMissingFramework()}
    />
  );
}
