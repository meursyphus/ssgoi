"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const viewTransitions = require("@ssgoi/core/view-transitions");
Object.keys(viewTransitions).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => viewTransitions[k]
  });
});
