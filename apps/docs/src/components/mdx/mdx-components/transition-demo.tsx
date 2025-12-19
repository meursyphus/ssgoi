"use client";

import React, { useState, useMemo } from "react";
import { transition } from "@ssgoi/react";
import {
  fade,
  scale,
  blur,
  slide,
  fly,
  rotate,
  bounce,
  mask,
} from "@ssgoi/react/transitions";

type TransitionType =
  | "fade"
  | "scale"
  | "blur"
  | "slide"
  | "fly"
  | "rotate"
  | "bounce"
  | "mask";

interface TransitionParams {
  fade: { duration: number };
  scale: { start: number; duration: number };
  blur: { amount: number; duration: number };
  slide: {
    direction: "up" | "down" | "left" | "right";
    distance: number;
    duration: number;
  };
  fly: { x: number; y: number; duration: number };
  rotate: { degrees: number; duration: number };
  bounce: { stiffness: number; damping: number };
  mask: { duration: number };
}

const defaultParams: TransitionParams = {
  fade: { duration: 300 },
  scale: { start: 0.8, duration: 300 },
  blur: { amount: 10, duration: 300 },
  slide: { direction: "down", distance: 20, duration: 300 },
  fly: { x: 0, y: 50, duration: 300 },
  rotate: { degrees: 90, duration: 300 },
  bounce: { stiffness: 300, damping: 20 },
  mask: { duration: 300 },
};

function ControlPanel({
  type,
  params,
  onChange,
}: {
  type: TransitionType;
  params: TransitionParams[TransitionType];
  onChange: (params: TransitionParams[TransitionType]) => void;
}) {
  const update = (key: string, value: number | string) => {
    onChange({ ...params, [key]: value });
  };

  const renderSlider = (
    label: string,
    key: string,
    value: number,
    min: number,
    max: number,
    step: number = 1,
    unit: string = "",
  ) => (
    <div className="flex items-center gap-3">
      <label className="text-neutral-500 text-xs w-20 flex-shrink-0">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => update(key, parseFloat(e.target.value))}
        className="flex-1 h-1 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-neutral-300 [&::-webkit-slider-thumb]:rounded-full"
      />
      <span className="text-neutral-400 text-xs w-14 text-right">
        {value}
        {unit}
      </span>
    </div>
  );

  const renderSelect = (
    label: string,
    key: string,
    value: string,
    options: string[],
  ) => (
    <div className="flex items-center gap-3">
      <label className="text-neutral-500 text-xs w-20 flex-shrink-0">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => update(key, e.target.value)}
        className="flex-1 px-2 py-1 bg-neutral-800 text-neutral-300 rounded border border-neutral-700 text-xs"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  switch (type) {
    case "fade":
      return (
        <div className="space-y-2">
          {renderSlider(
            "Duration",
            "duration",
            (params as TransitionParams["fade"]).duration,
            100,
            1000,
            50,
            "ms",
          )}
        </div>
      );
    case "scale":
      return (
        <div className="space-y-2">
          {renderSlider(
            "Start",
            "start",
            (params as TransitionParams["scale"]).start,
            0,
            1,
            0.1,
          )}
          {renderSlider(
            "Duration",
            "duration",
            (params as TransitionParams["scale"]).duration,
            100,
            1000,
            50,
            "ms",
          )}
        </div>
      );
    case "blur":
      return (
        <div className="space-y-2">
          {renderSlider(
            "Amount",
            "amount",
            (params as TransitionParams["blur"]).amount,
            0,
            30,
            1,
            "px",
          )}
          {renderSlider(
            "Duration",
            "duration",
            (params as TransitionParams["blur"]).duration,
            100,
            1000,
            50,
            "ms",
          )}
        </div>
      );
    case "slide":
      return (
        <div className="space-y-2">
          {renderSelect(
            "Direction",
            "direction",
            (params as TransitionParams["slide"]).direction,
            ["up", "down", "left", "right"],
          )}
          {renderSlider(
            "Distance",
            "distance",
            (params as TransitionParams["slide"]).distance,
            10,
            100,
            5,
            "px",
          )}
          {renderSlider(
            "Duration",
            "duration",
            (params as TransitionParams["slide"]).duration,
            100,
            1000,
            50,
            "ms",
          )}
        </div>
      );
    case "fly":
      return (
        <div className="space-y-2">
          {renderSlider(
            "X",
            "x",
            (params as TransitionParams["fly"]).x,
            -100,
            100,
            10,
            "px",
          )}
          {renderSlider(
            "Y",
            "y",
            (params as TransitionParams["fly"]).y,
            -100,
            100,
            10,
            "px",
          )}
          {renderSlider(
            "Duration",
            "duration",
            (params as TransitionParams["fly"]).duration,
            100,
            1000,
            50,
            "ms",
          )}
        </div>
      );
    case "rotate":
      return (
        <div className="space-y-2">
          {renderSlider(
            "Degrees",
            "degrees",
            (params as TransitionParams["rotate"]).degrees,
            0,
            360,
            15,
            "°",
          )}
          {renderSlider(
            "Duration",
            "duration",
            (params as TransitionParams["rotate"]).duration,
            100,
            1000,
            50,
            "ms",
          )}
        </div>
      );
    case "bounce":
      return (
        <div className="space-y-2">
          {renderSlider(
            "Stiffness",
            "stiffness",
            (params as TransitionParams["bounce"]).stiffness,
            100,
            500,
            20,
          )}
          {renderSlider(
            "Damping",
            "damping",
            (params as TransitionParams["bounce"]).damping,
            5,
            40,
            1,
          )}
        </div>
      );
    case "mask":
      return (
        <div className="space-y-2">
          {renderSlider(
            "Duration",
            "duration",
            (params as TransitionParams["mask"]).duration,
            100,
            1000,
            50,
            "ms",
          )}
        </div>
      );
    default:
      return null;
  }
}

function createTransition(
  type: TransitionType,
  params: TransitionParams[TransitionType],
) {
  switch (type) {
    case "fade":
      return fade({ duration: (params as TransitionParams["fade"]).duration });
    case "scale":
      const scaleParams = params as TransitionParams["scale"];
      return scale({
        start: scaleParams.start,
        duration: scaleParams.duration,
      });
    case "blur":
      const blurParams = params as TransitionParams["blur"];
      return blur({ amount: blurParams.amount, duration: blurParams.duration });
    case "slide":
      const slideParams = params as TransitionParams["slide"];
      return slide({
        direction: slideParams.direction,
        distance: slideParams.distance,
        duration: slideParams.duration,
      });
    case "fly":
      const flyParams = params as TransitionParams["fly"];
      return fly({
        x: flyParams.x,
        y: flyParams.y,
        duration: flyParams.duration,
      });
    case "rotate":
      const rotateParams = params as TransitionParams["rotate"];
      return rotate({
        degrees: rotateParams.degrees,
        duration: rotateParams.duration,
      });
    case "bounce":
      const bounceParams = params as TransitionParams["bounce"];
      return bounce({
        stiffness: bounceParams.stiffness,
        damping: bounceParams.damping,
      });
    case "mask":
      return mask({ duration: (params as TransitionParams["mask"]).duration });
  }
}

export function TransitionDemo() {
  const [selectedType, setSelectedType] = useState<TransitionType>("fade");
  const [isVisible, setIsVisible] = useState(true);
  const [params, setParams] = useState<TransitionParams>(defaultParams);

  const currentParams = params[selectedType];
  const currentTransition = useMemo(
    () => createTransition(selectedType, currentParams),
    [selectedType, currentParams],
  );

  const handleParamsChange = (newParams: TransitionParams[TransitionType]) => {
    setParams((prev) => ({ ...prev, [selectedType]: newParams }));
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        {/* Header with selector */}
        <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-3">
          <span className="text-neutral-500 text-xs">Type</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TransitionType)}
            className="flex-1 px-3 py-1.5 bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 focus:border-neutral-600 focus:outline-none text-sm"
          >
            <option value="fade">fade</option>
            <option value="scale">scale</option>
            <option value="blur">blur</option>
            <option value="slide">slide</option>
            <option value="fly">fly</option>
            <option value="rotate">rotate</option>
            <option value="bounce">bounce</option>
            <option value="mask">mask</option>
          </select>
        </div>

        {/* Control panel */}
        <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
          <ControlPanel
            type={selectedType}
            params={currentParams}
            onChange={handleParamsChange}
          />
        </div>

        {/* Preview area */}
        <div className="relative flex items-center justify-center h-[180px] bg-neutral-950">
          {isVisible && (
            <div
              ref={transition({
                key: `transition-demo-${selectedType}-${JSON.stringify(currentParams)}`,
                ...currentTransition,
              })}
              className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center shadow-lg"
            >
              <span className="text-neutral-900 font-medium text-xs">
                SSGOI
              </span>
            </div>
          )}
        </div>

        {/* Footer with toggle button */}
        <div className="px-4 py-3 border-t border-neutral-800 flex justify-center">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="px-5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors text-sm"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    </div>
  );
}
