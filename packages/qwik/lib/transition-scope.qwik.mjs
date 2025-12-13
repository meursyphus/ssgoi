import { jsx } from "@builder.io/qwik/jsx-runtime";
import { component$, useSignal, useVisibleTask$, Slot } from "@builder.io/qwik";
import { createTransitionScope } from "@ssgoi/core";
const TransitionScope = component$(() => {
  const elementRef = useSignal();
  useVisibleTask$(() => {
    const element = elementRef.value;
    if (element) {
      createTransitionScope()(element);
    }
  });
  return /* @__PURE__ */ jsx("div", {
    ref: elementRef,
    style: {
      display: "contents"
    },
    children: /* @__PURE__ */ jsx(Slot, {})
  });
});
export {
  TransitionScope
};
