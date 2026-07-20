import { useLocation } from "@solidjs/router";
import { Show, splitProps, type JSX } from "solid-js";

type Props = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: JSX.Element;
  getId?: (pathname: string) => string;
};

const pathnameId = (pathname: string) => pathname;

export function SsgoiTransitionBoundary(props: Props) {
  const location = useLocation();
  const [local, rest] = splitProps(props, ["children", "getId"]);
  const transitionId = () => (local.getId ?? pathnameId)(location.pathname);

  return (
    <Show when={transitionId()} keyed>
      {(id) => (
        <div {...rest} data-ssgoi-transition={id}>
          {local.children}
        </div>
      )}
    </Show>
  );
}
