// TODO(8.0.0): remove this entry (deprecated in 7.5.0).
import { splitProps, type JSX, type ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useSsgoi } from "../context";

/** @deprecated Will be removed in 8.0.0. */
type SsgoiTransitionProps<T extends ValidComponent = "div"> = {
  children: JSX.Element;
  id: string;
  as?: T;
  class?: string;
};

/** @deprecated Will be removed in 8.0.0. */
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
