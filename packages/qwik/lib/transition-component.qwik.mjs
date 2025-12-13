import { jsx } from "@builder.io/qwik/jsx-runtime";
import { component$, useSignal, useVisibleTask$, Slot } from "@builder.io/qwik";
import { transition } from "@ssgoi/core";
const Transition = component$(({ transitionKey, scope, in$, out$, inFn, outFn, class: className }) => {
  const elementRef = useSignal();
  useVisibleTask$(async ({ cleanup, track }) => {
    const element = elementRef.value;
    track(elementRef);
    if (!element) return;
    const resolvedIn = in$ ? await in$.resolve() : inFn;
    const resolvedOut = out$ ? await out$.resolve() : outFn;
    if (!resolvedIn && !resolvedOut) return;
    const callback = transition({
      key: transitionKey,
      scope,
      in: resolvedIn,
      out: resolvedOut
    });
    const cleanupFn = callback(element);
    cleanup(() => {
      cleanupFn?.();
    });
  }, {
    strategy: "document-ready"
  });
  return /* @__PURE__ */ jsx("div", {
    ref: elementRef,
    class: className,
    children: /* @__PURE__ */ jsx(Slot, {})
  });
});
export {
  Transition
};
