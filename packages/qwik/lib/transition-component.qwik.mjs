import { jsx } from "@builder.io/qwik/jsx-runtime";
import { component$, useSignal, useVisibleTask$, Slot } from "@builder.io/qwik";
import { transition } from "@ssgoi/core";
const TransitionInternal = component$(({ transitionKey, scope, in$, out$, inFn, outFn, class: className, contextSignal, pageId }) => {
  const elementRef = useSignal();
  useVisibleTask$(async ({ cleanup, track }) => {
    const element = elementRef.value;
    track(elementRef);
    const context = contextSignal ? track(() => contextSignal.value) : null;
    if (!element) return;
    let resolvedIn;
    let resolvedOut;
    if (context && pageId) {
      const options = context(pageId);
      resolvedIn = options.in;
      resolvedOut = options.out;
    } else {
      resolvedIn = in$ ? await in$.resolve() : inFn;
      resolvedOut = out$ ? await out$.resolve() : outFn;
    }
    if (!resolvedIn && !resolvedOut) return;
    const key = transitionKey || `qwik-transition-${Math.random().toString(36).slice(2)}`;
    const callback = transition({
      key,
      scope,
      in: resolvedIn,
      out: resolvedOut
    });
    const transitionCleanup = callback(element);
    cleanup(() => {
      transitionCleanup?.();
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
const Transition = component$(({ transitionKey, scope, in$, out$, class: className }) => {
  return /* @__PURE__ */ jsx(TransitionInternal, {
    transitionKey,
    scope,
    in$,
    out$,
    class: className,
    children: /* @__PURE__ */ jsx(Slot, {})
  });
});
export {
  Transition,
  TransitionInternal
};
