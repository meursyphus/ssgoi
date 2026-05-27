import { splitProps, type JSX, type ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useSsgoi } from "./context";

type SsgoiTransitionProps<T extends ValidComponent = "div"> = {
  children: JSX.Element;
  id: string;
  as?: T;
  class?: string;
};

/**
 * @deprecated Set `data-ssgoi-transition` directly on the page boundary
 * element inside `<Ssgoi>` instead.
 */
export const SsgoiTransition = <T extends ValidComponent = "div">(
  props: SsgoiTransitionProps<T>,
) => {
  const [local, rest] = splitProps(props, ["children", "id", "as", "class"]);
  const ssgoi = useSsgoi();
  const component = (local.as || "div") as ValidComponent;

  return (
    <Dynamic
      component={component}
      ref={ssgoi.refFor(local.id)}
      data-ssgoi-transition={local.id}
      class={local.class}
      {...(rest as object)}
    >
      {local.children}
    </Dynamic>
  );
};
