"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const qwik = require("@builder.io/qwik");
const context = require("./context.qwik.cjs");
const transitionComponent = require("./transition-component.qwik.cjs");
const SsgoiTransition = qwik.component$(({ id, class: className }) => {
  const contextSignal = context.useSsgoi();
  const transitionFns = qwik.useComputed$(() => {
    const context2 = contextSignal.value;
    if (!context2) return {
      inFn: void 0,
      outFn: void 0
    };
    const options = context2(id);
    return {
      inFn: options.in ? qwik.noSerialize(options.in) : void 0,
      outFn: options.out ? qwik.noSerialize(options.out) : void 0
    };
  });
  return /* @__PURE__ */ jsxRuntime.jsx(transitionComponent.Transition, {
    transitionKey: id,
    inFn: transitionFns.value.inFn,
    outFn: transitionFns.value.outFn,
    class: className,
    children: /* @__PURE__ */ jsxRuntime.jsx(qwik.Slot, {})
  });
});
exports.SsgoiTransition = SsgoiTransition;
