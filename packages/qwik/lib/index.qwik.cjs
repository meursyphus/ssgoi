"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const transitionComponent = require("./transition-component.qwik.cjs");
const types = require("@ssgoi/core/types");
const ssgoi = require("./ssgoi.qwik.cjs");
const ssgoiTransition = require("./ssgoi-transition.qwik.cjs");
const transitionScope = require("./transition-scope.qwik.cjs");
exports.Transition = transitionComponent.Transition;
exports.Ssgoi = ssgoi.Ssgoi;
exports.SsgoiTransition = ssgoiTransition.SsgoiTransition;
exports.TransitionScope = transitionScope.TransitionScope;
Object.keys(types).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => types[k]
  });
});
