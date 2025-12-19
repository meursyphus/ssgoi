import { jsx } from "@builder.io/qwik/jsx-runtime";
import { component$, useSignal, useContextProvider, useTask$, noSerialize, Slot } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { SsgoiContextId } from "./context.qwik.mjs";
import { createSggoiTransitionContext } from "@ssgoi/core";
const Ssgoi = component$(({ config }) => {
  const contextValue = useSignal(null);
  useContextProvider(SsgoiContextId, contextValue);
  useTask$(({ track }) => {
    track(() => config);
    if (isServer) return;
    if (config) {
      contextValue.value = noSerialize(createSggoiTransitionContext(config, {
        outFirst: true
      }));
    }
  });
  return /* @__PURE__ */ jsx(Slot, {});
});
export {
  Ssgoi
};
