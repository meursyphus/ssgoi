"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const types = require("@ssgoi/core/types");
Object.keys(types).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => types[k]
  });
});
