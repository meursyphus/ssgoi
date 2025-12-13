"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const presets = require("@ssgoi/core/presets");
Object.keys(presets).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => presets[k]
  });
});
