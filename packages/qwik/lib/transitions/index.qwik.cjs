"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const transitions = require("@ssgoi/core/transitions");
Object.keys(transitions).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => transitions[k]
  });
});
