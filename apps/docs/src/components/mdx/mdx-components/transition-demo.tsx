"use client";

import React, { useState } from "react";
import { transition } from "@ssgoi/react";
import * as transitions from "@ssgoi/react/transitions";
import { config as springPresets } from "@ssgoi/react/presets";

interface TransitionDemoProps {
  type: keyof typeof transitions;
  options?: Record<string, any>;
}

// Transition-specific option configurations
const transitionOptions = {
  scale: [
    { name: "start", type: "range", min: 0, max: 2, step: 0.1, default: 0 },
    { name: "opacity", type: "range", min: 0, max: 1, step: 0.1, default: 0 },
    {
      name: "axis",
      type: "select",
      options: ["both", "x", "y"],
      default: "both",
    },
  ],
  fade: [
    { name: "from", type: "range", min: 0, max: 1, step: 0.1, default: 0 },
    { name: "to", type: "range", min: 0, max: 1, step: 0.1, default: 1 },
  ],
  rotate: [
    {
      name: "degrees",
      type: "range",
      min: 0,
      max: 720,
      step: 45,
      default: 360,
    },
    { name: "clockwise", type: "toggle", default: true },
    { name: "scale", type: "toggle", default: false },
    { name: "fade", type: "toggle", default: true },
    {
      name: "axis",
      type: "select",
      options: ["2d", "x", "y", "z"],
      default: "2d",
    },
    {
      name: "perspective",
      type: "range",
      min: 100,
      max: 2000,
      step: 100,
      default: 800,
    },
    {
      name: "origin",
      type: "select",
      options: [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top left",
        "top right",
        "bottom left",
        "bottom right",
      ],
      default: "center",
    },
  ],
  slide: [
    {
      name: "direction",
      type: "select",
      options: ["left", "right", "up", "down"],
      default: "left",
    },
    {
      name: "distance",
      type: "range",
      min: 0,
      max: 500,
      step: 10,
      default: 100,
    },
    { name: "opacity", type: "range", min: 0, max: 1, step: 0.1, default: 0 },
    { name: "fade", type: "toggle", default: true },
  ],
  bounce: [
    { name: "height", type: "range", min: 0, max: 100, step: 5, default: 20 },
    { name: "bounces", type: "range", min: 1, max: 10, step: 1, default: 3 },
    { name: "fade", type: "toggle", default: true },
  ],
  blur: [
    { name: "amount", type: "range", min: 0, max: 20, step: 1, default: 10 },
    { name: "opacity", type: "range", min: 0, max: 1, step: 0.1, default: 0 },
  ],
  fly: [
    { name: "y", type: "range", min: -500, max: 500, step: 10, default: -100 },
    { name: "x", type: "range", min: -500, max: 500, step: 10, default: 0 },
    { name: "opacity", type: "range", min: 0, max: 1, step: 0.1, default: 0 },
  ],
  mask: [
    {
      name: "shape",
      type: "select",
      options: ["circle", "ellipse", "square"],
      default: "circle",
    },
    {
      name: "origin",
      type: "select",
      options: [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
      default: "center",
    },
    { name: "scale", type: "range", min: 0.5, max: 3, step: 0.1, default: 1.5 },
    { name: "fade", type: "toggle", default: false },
  ],
} as const;

export function TransitionDemo({ type, options = {} }: TransitionDemoProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [springPreset, setSpringPreset] =
    useState<keyof typeof springPresets>("default");
  const [customOptions, setCustomOptions] = useState<Record<string, any>>({});

  // Get the transition function
  const transitionFn = transitions[type];
  if (!transitionFn) {
    return <div>Unknown transition type: {type}</div>;
  }

  // Merge default options with custom options
  const mergedOptions = { ...options, ...customOptions };

  // Apply the transition with spring preset
  const transitionConfig = transitionFn({
    ...mergedOptions,
    spring: springPresets[springPreset],
  });

  return (
    <div className="w-full space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
      {/* Preview Area */}
      <div className="relative flex justify-center items-center h-48 bg-gray-950/50 rounded-lg border border-gray-800">
        {isVisible && (
          <div
            ref={transition({
              key: `demo-${type}`,
              ...transitionConfig,
            })}
            className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-2xl flex items-center justify-center text-gray-900 font-bold text-xl"
          >
            SSGOI
          </div>
        )}

        {/* Toggle Button - positioned at bottom of preview */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className={`absolute bottom-4 px-6 py-2 font-medium rounded-lg transition-all transform hover:scale-105 ${
            isVisible
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-orange-500 hover:bg-orange-600 text-white animate-pulse"
          }`}
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>

      {/* Transition-specific Options */}
      {transitionOptions[type as keyof typeof transitionOptions] && (
        <div className="space-y-3 p-4 bg-gray-950/50 rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {transitionOptions[type as keyof typeof transitionOptions].map(
              (option) => {
                const currentValue =
                  customOptions[option.name] ?? option.default;

                return (
                  <div key={option.name} className="space-y-1">
                    <label className="text-xs text-gray-500 capitalize">
                      {option.name.replace(/([A-Z])/g, " $1").trim()}
                    </label>

                    {option.type === "range" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={option.min}
                          max={option.max}
                          step={option.step}
                          value={currentValue}
                          onChange={(e) =>
                            setCustomOptions({
                              ...customOptions,
                              [option.name]: parseFloat(e.target.value),
                            })
                          }
                          className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <span className="text-xs text-gray-400 w-12 text-right">
                          {currentValue}
                        </span>
                      </div>
                    )}

                    {option.type === "select" && (
                      <select
                        value={currentValue}
                        onChange={(e) =>
                          setCustomOptions({
                            ...customOptions,
                            [option.name]: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:border-orange-500 focus:outline-none"
                      >
                        {option.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {option.type === "toggle" && (
                      <button
                        onClick={() =>
                          setCustomOptions({
                            ...customOptions,
                            [option.name]: !currentValue,
                          })
                        }
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          currentValue ? "bg-orange-500" : "bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            currentValue ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}

      {/* Spring Preset Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(
          ["default", "gentle", "wobbly", "stiff", "slow", "molasses"] as const
        ).map((preset) => (
          <button
            key={preset}
            onClick={() => setSpringPreset(preset)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              springPreset === preset
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
            }`}
          >
            {preset.charAt(0).toUpperCase() + preset.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
