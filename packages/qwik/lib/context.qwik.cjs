"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const qwik = require("@builder.io/qwik");
const SsgoiContextId = qwik.createContextId("ssgoi-context");
const useSsgoi = () => {
  const contextSignal = qwik.useContext(SsgoiContextId);
  return contextSignal;
};
exports.SsgoiContextId = SsgoiContextId;
exports.useSsgoi = useSsgoi;
