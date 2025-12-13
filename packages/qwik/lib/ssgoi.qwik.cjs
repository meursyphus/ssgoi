"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const qwik = require("@builder.io/qwik");
const context = require("./context.qwik.cjs");
const core = require("@ssgoi/core");
const Ssgoi = qwik.component$(({ config }) => {
  const contextValue = qwik.useSignal(null);
  qwik.useContextProvider(context.SsgoiContextId, contextValue);
  qwik.useVisibleTask$(() => {
    if (config) {
      contextValue.value = qwik.noSerialize(core.createSggoiTransitionContext(config, {
        outFirst: false
      }));
    }
  }, {
    strategy: "document-ready"
  });
  return /* @__PURE__ */ jsxRuntime.jsx(qwik.Slot, {});
});
exports.Ssgoi = Ssgoi;
