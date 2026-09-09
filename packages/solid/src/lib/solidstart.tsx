import { useLocation } from "@solidjs/router";
import { createMemo, Show, splitProps, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

export interface RouteBoundaryState {
  id: string;
  key?: string | number;
}

export type SsgoiRouteBoundaryProps = JSX.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  routeKey?: string | number;
  resolve?: (location: { pathname: string }) => RouteBoundaryState;
};

/** Solid Router boundary, including SolidStart. */
export function SsgoiRouteBoundary(props: SsgoiRouteBoundaryProps) {
  const location = useLocation();
  const [local, rest] = splitProps(props, [
    "children",
    "as",
    "resolve",
    "routeKey",
  ]);
  const boundary = createMemo(
    () =>
      local.resolve?.({ pathname: location.pathname }) ?? {
        id: location.pathname,
      },
  );
  // Show uses truthiness. A token also supports valid keys such as 0 and "".
  const lifetime = createMemo<{ key: string | number }>((previous) => {
    const current = boundary();
    const key = local.routeKey ?? current.key ?? current.id;
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
