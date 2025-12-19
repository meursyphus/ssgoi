"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const qwik = require("@builder.io/qwik");
const context = require("./context.qwik.cjs");
const transitionComponent = require("./transition-component.qwik.cjs");
const SsgoiTransition = qwik.component$(({ id, class: className }) => {
  const contextSignal = context.useSsgoi();
  return /* @__PURE__ */ jsxRuntime.jsx(transitionComponent.TransitionInternal, {
    transitionKey: id,
    contextSignal,
    pageId: id,
    class: className,
    children: /* @__PURE__ */ jsxRuntime.jsx(qwik.Slot, {})
  });
});
exports.SsgoiTransition = SsgoiTransition;
