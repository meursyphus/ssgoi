"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const qwik = require("@builder.io/qwik");
const core = require("@ssgoi/core");
const TransitionScope = qwik.component$(() => {
  const elementRef = qwik.useSignal();
  qwik.useVisibleTask$(() => {
    const element = elementRef.value;
    if (element) {
      core.createTransitionScope()(element);
    }
  });
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    ref: elementRef,
    style: {
      display: "contents"
    },
    children: /* @__PURE__ */ jsxRuntime.jsx(qwik.Slot, {})
  });
});
exports.TransitionScope = TransitionScope;
