import { jsx } from "@builder.io/qwik/jsx-runtime";
import { component$, useComputed$, noSerialize, Slot } from "@builder.io/qwik";
import { useSsgoi } from "./context.qwik.mjs";
import { Transition } from "./transition-component.qwik.mjs";
const SsgoiTransition = component$(({ id, class: className }) => {
  const contextSignal = useSsgoi();
  const transitionFns = useComputed$(() => {
    const context = contextSignal.value;
    if (!context) return {
      inFn: void 0,
      outFn: void 0
    };
    const options = context(id);
    return {
      inFn: options.in ? noSerialize(options.in) : void 0,
      outFn: options.out ? noSerialize(options.out) : void 0
    };
  });
  return /* @__PURE__ */ jsx(Transition, {
    transitionKey: id,
    inFn: transitionFns.value.inFn,
    outFn: transitionFns.value.outFn,
    class: className,
    children: /* @__PURE__ */ jsx(Slot, {})
  });
});
export {
  SsgoiTransition
};
