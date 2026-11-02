import {
  createMemo,
  Show,
  splitProps,
  type Accessor,
  type JSX,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  SsgoiLayoutDepthProvider,
  useLayoutDepth,
  useSsgoiLayout,
} from "./context";

export type SsgoiLayoutBoundaryProps = JSX.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
};

/** Shared rendering; remounts its element whenever `state().key` changes. */
export function RouteBoundary(
  props: SsgoiLayoutBoundaryProps & {
    state: Accessor<{ id: string; key: string | number }>;
  },
) {
  const [local, rest] = splitProps(props, ["children", "as", "state"]);
  // Show uses truthiness. A token also supports valid keys such as 0 and "".
  const lifetime = createMemo<{ key: string | number }>((previous) => {
    const key = local.state().key;
    return previous?.key === key ? previous : { key };
  });

  return (
    <Show when={lifetime()} keyed>
      {(_lifetime) => (
        <Dynamic
          component={local.as ?? "div"}
          {...rest}
          data-ssgoi-transition={local.state().id}
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
  const layout = useSsgoiLayout();
  if (!layout?.()) throwMissingFramework();
  const depth = useLayoutDepth();
  const [local, rest] = splitProps(props, ["children"]);
  // The config's layout scope at this depth keeps the DOM; past the declared
  // scopes every route path remounts.
  const state = createMemo(() => {
    const { routePath, chain } = layout() ?? throwMissingFramework();
    return { id: routePath, key: chain[depth] ?? routePath };
  });

  return (
    <RouteBoundary {...rest} state={state}>
      <SsgoiLayoutDepthProvider value={depth + 1}>
        {local.children}
      </SsgoiLayoutDepthProvider>
    </RouteBoundary>
  );
}
