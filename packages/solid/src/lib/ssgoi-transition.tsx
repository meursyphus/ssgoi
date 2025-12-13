import { splitProps, type JSX, type ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { transition } from "./transition";
import { useSsgoi } from "./context";

type SsgoiTransitionProps<T extends ValidComponent = "div"> = {
  children: JSX.Element;
  id: string;
  as?: T;
  class?: string;
};

export const SsgoiTransition = <T extends ValidComponent = "div">(
  props: SsgoiTransitionProps<T>,
) => {
  const [local, rest] = splitProps(props, ["children", "id", "as", "class"]);
  const getTransition = useSsgoi();
  const component = (local.as || "div") as ValidComponent;

  return (
    <Dynamic
      component={component}
      ref={transition(getTransition(local.id))}
      data-ssgoi-transition={local.id}
      class={local.class}
      {...(rest as object)}
    >
      {local.children}
    </Dynamic>
  );
};
