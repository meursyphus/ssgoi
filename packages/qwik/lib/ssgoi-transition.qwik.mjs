import { jsx } from "@builder.io/qwik/jsx-runtime";
import { component$, Slot } from "@builder.io/qwik";
import { useSsgoi } from "./context.qwik.mjs";
import { TransitionInternal } from "./transition-component.qwik.mjs";
const SsgoiTransition = component$(({ id, class: className }) => {
  const contextSignal = useSsgoi();
  return /* @__PURE__ */ jsx(TransitionInternal, {
    transitionKey: id,
    contextSignal,
    pageId: id,
    class: className,
    children: /* @__PURE__ */ jsx(Slot, {})
  });
});
export {
  SsgoiTransition
};
