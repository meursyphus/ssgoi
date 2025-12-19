"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const qwik = require("@builder.io/qwik");
const build = require("@builder.io/qwik/build");
const context = require("./context.qwik.cjs");
const core = require("@ssgoi/core");
const Ssgoi = qwik.component$(({ config }) => {
  const contextValue = qwik.useSignal(null);
  qwik.useContextProvider(context.SsgoiContextId, contextValue);
  qwik.useTask$(({ track }) => {
    track(() => config);
    if (build.isServer) return;
    if (config) {
      contextValue.value = qwik.noSerialize(core.createSggoiTransitionContext(config, {
        outFirst: true
      }));
    }
  });
  return /* @__PURE__ */ jsxRuntime.jsx(qwik.Slot, {});
});
exports.Ssgoi = Ssgoi;
