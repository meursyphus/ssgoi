"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const qwik = require("@builder.io/qwik");
const core = require("@ssgoi/core");
const TransitionInternal = qwik.component$(({ transitionKey, scope, in$, out$, inFn, outFn, class: className, contextSignal, pageId }) => {
  const elementRef = qwik.useSignal();
  qwik.useVisibleTask$(async ({ cleanup, track }) => {
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
    const callback = core.transition({
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    ref: elementRef,
    class: className,
    children: /* @__PURE__ */ jsxRuntime.jsx(qwik.Slot, {})
  });
});
const Transition = qwik.component$(({ transitionKey, scope, in$, out$, class: className }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(TransitionInternal, {
    transitionKey,
    scope,
    in$,
    out$,
    class: className,
    children: /* @__PURE__ */ jsxRuntime.jsx(qwik.Slot, {})
  });
});
exports.Transition = Transition;
exports.TransitionInternal = TransitionInternal;
