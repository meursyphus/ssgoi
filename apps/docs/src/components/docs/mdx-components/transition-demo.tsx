"use client";

import React, { useState } from "react";
import { transition } from "@ssgoi/react";
import * as transitions from "@ssgoi/react/transitions";

interface TransitionDemoProps {
  type: keyof typeof transitions;
  options?: Record<string, any>;
}

const springPresets = {
  smooth: { stiffness: 100, damping: 20 },
  normal: { stiffness: 300, damping: 30 },
  fast: { stiffness: 500, damping: 40 },
};

export function TransitionDemo({ type, options = {} }: TransitionDemoProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [springPreset, setSpringPreset] =
    useState<keyof typeof springPresets>("normal");

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
    <div className="w-full space-y-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      {/* Preview Area */}
      <div className="flex justify-center items-center h-40 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        {isVisible && (
          <div
            ref={transition({
              key: `demo-${type}`,
              ...transitionConfig,
            })}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
          >
            SSGOI
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        {/* Spring Preset Buttons */}
        <div className="flex gap-2">
          {Object.keys(springPresets).map((preset) => (
            <button
              key={preset}
              onClick={() =>
                setSpringPreset(preset as keyof typeof springPresets)
              }
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                springPreset === preset
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </button>
          ))}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className={`px-4 py-2 font-medium rounded-lg transition-all ${
            isVisible
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
