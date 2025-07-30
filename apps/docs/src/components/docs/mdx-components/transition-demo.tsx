"use client";

import React, { useState } from "react";
import { transition } from "@ssgoi/react";
import * as transitions from "@ssgoi/react/transitions";
import { config as springPresets } from "@ssgoi/react/presets";

interface TransitionDemoProps {
  type: keyof typeof transitions;
  options?: Record<string, any>;
}

export function TransitionDemo({ type, options = {} }: TransitionDemoProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [springPreset, setSpringPreset] =
    useState<keyof typeof springPresets>("default");

  // Get the transition function
  const transitionFn = transitions[type];
  if (!transitionFn) {
    return <div>Unknown transition type: {type}</div>;
  }

  // Apply the transition with spring preset
  const transitionConfig = transitionFn({
    ...options,
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

      {/* Spring Preset Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(["default", "gentle", "wobbly", "stiff", "slow", "molasses"] as const).map((preset) => (
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