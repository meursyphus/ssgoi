import { jsx } from "@builder.io/qwik/jsx-runtime";
import { component$, useSignal, useContextProvider, useVisibleTask$, noSerialize, Slot } from "@builder.io/qwik";
import { SsgoiContextId } from "./context.qwik.mjs";
import { createSggoiTransitionContext } from "@ssgoi/core";
const Ssgoi = component$(({ config }) => {
  const contextValue = useSignal(null);
  useContextProvider(SsgoiContextId, contextValue);
  useVisibleTask$(() => {
    if (config) {
      contextValue.value = noSerialize(createSggoiTransitionContext(config, {
        outFirst: false
      }));
    }
  }, {
    strategy: "document-ready"
  });
  return /* @__PURE__ */ jsx(Slot, {});
});
export {
  Ssgoi
};
