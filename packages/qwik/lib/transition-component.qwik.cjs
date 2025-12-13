"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const qwik = require("@builder.io/qwik");
const core = require("@ssgoi/core");
const Transition = qwik.component$(({ transitionKey, scope, in$, out$, inFn, outFn, class: className }) => {
  const elementRef = qwik.useSignal();
  qwik.useVisibleTask$(async ({ cleanup, track }) => {
    const element = elementRef.value;
    track(elementRef);
    if (!element) return;
    const resolvedIn = in$ ? await in$.resolve() : inFn;
    const resolvedOut = out$ ? await out$.resolve() : outFn;
    if (!resolvedIn && !resolvedOut) return;
    const callback = core.transition({
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
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    ref: elementRef,
    class: className,
    children: /* @__PURE__ */ jsxRuntime.jsx(qwik.Slot, {})
  });
});
exports.Transition = Transition;
