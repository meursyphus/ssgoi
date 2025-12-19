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

type SpringPreset =
  | "default"
  | "gentle"
  | "wobbly"
  | "stiff"
  | "slow"
  | "molasses";

const springPresets: Record<
  SpringPreset,
  { stiffness: number; damping: number }
> = {
  default: { stiffness: 170, damping: 26 },
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 },
  slow: { stiffness: 280, damping: 60 },
  molasses: { stiffness: 150, damping: 60 },
};

interface TransitionParams {
  fade: { from: number; to: number };
  scale: { start: number; opacity: number; axis: "both" | "x" | "y" };
  blur: { amount: number; opacity: number };
  slide: { direction: "up" | "down" | "left" | "right"; distance: number };
  fly: { x: number; y: number; opacity: number };
  rotate: { degrees: number; axis: "2d" | "x" | "y" | "z" };
  bounce: { height: number; intensity: number; direction: "up" | "down" };
  mask: { shape: "circle" | "ellipse" | "square"; origin: string };
}

const defaultParams: TransitionParams = {
  fade: { from: 0, to: 1 },
  scale: { start: 0.5, opacity: 0, axis: "both" },
  blur: { amount: 10, opacity: 0 },
  slide: { direction: "down", distance: 50 },
  fly: { x: 0, y: -50, opacity: 0 },
  rotate: { degrees: 180, axis: "2d" },
  bounce: { height: 20, intensity: 1, direction: "up" },
  mask: { shape: "circle", origin: "center" },
};

function ControlPanel({
  type,
  params,
  spring,
  onParamsChange,
  onSpringChange,
}: {
  type: TransitionType;
  params: TransitionParams[TransitionType];
  spring: SpringPreset;
  onParamsChange: (params: TransitionParams[TransitionType]) => void;
  onSpringChange: (spring: SpringPreset) => void;
}) {
  const update = (key: string, value: number | string) => {
    onParamsChange({ ...params, [key]: value });
  };

  const Slider = ({
    label,
    k,
    value,
    min,
    max,
    step = 1,
    unit = "",
  }: {
    label: string;
    k: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
  }) => (
    <div className="flex items-center gap-3">
      <span className="text-neutral-400 text-xs w-16">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => update(k, parseFloat(e.target.value))}
        className="flex-1 h-1 bg-neutral-700 rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-neutral-300 [&::-webkit-slider-thumb]:rounded-full"
      />
      <span className="text-neutral-500 text-xs w-12 text-right">
        {value}
        {unit}
      </span>
    </div>
  );

  const Select = ({
    label,
    k,
    value,
    options,
  }: {
    label: string;
    k: string;
    value: string;
    options: string[];
  }) => (
    <div className="flex items-center gap-3">
      <span className="text-neutral-400 text-xs w-16">{label}</span>
      <select
        value={value}
        onChange={(e) => update(k, e.target.value)}
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

  const controls = (() => {
    switch (type) {
      case "fade": {
        const p = params as TransitionParams["fade"];
        return (
          <>
            <Slider
              label="from"
              k="from"
              value={p.from}
              min={0}
              max={1}
              step={0.1}
            />
            <Slider label="to" k="to" value={p.to} min={0} max={1} step={0.1} />
          </>
        );
      }
      case "scale": {
        const p = params as TransitionParams["scale"];
        return (
          <>
            <Slider
              label="start"
              k="start"
              value={p.start}
              min={0}
              max={1}
              step={0.1}
            />
            <Slider
              label="opacity"
              k="opacity"
              value={p.opacity}
              min={0}
              max={1}
              step={0.1}
            />
            <Select
              label="axis"
              k="axis"
              value={p.axis}
              options={["both", "x", "y"]}
            />
          </>
        );
      }
      case "blur": {
        const p = params as TransitionParams["blur"];
        return (
          <>
            <Slider
              label="amount"
              k="amount"
              value={p.amount}
              min={0}
              max={30}
              step={1}
              unit="px"
            />
            <Slider
              label="opacity"
              k="opacity"
              value={p.opacity}
              min={0}
              max={1}
              step={0.1}
            />
          </>
        );
      }
      case "slide": {
        const p = params as TransitionParams["slide"];
        return (
          <>
            <Select
              label="direction"
              k="direction"
              value={p.direction}
              options={["up", "down", "left", "right"]}
            />
            <Slider
              label="distance"
              k="distance"
              value={p.distance}
              min={10}
              max={200}
              step={10}
              unit="px"
            />
          </>
        );
      }
      case "fly": {
        const p = params as TransitionParams["fly"];
        return (
          <>
            <Slider
              label="x"
              k="x"
              value={p.x}
              min={-100}
              max={100}
              step={10}
              unit="px"
            />
            <Slider
              label="y"
              k="y"
              value={p.y}
              min={-100}
              max={100}
              step={10}
              unit="px"
            />
            <Slider
              label="opacity"
              k="opacity"
              value={p.opacity}
              min={0}
              max={1}
              step={0.1}
            />
          </>
        );
      }
      case "rotate": {
        const p = params as TransitionParams["rotate"];
        return (
          <>
            <Slider
              label="degrees"
              k="degrees"
              value={p.degrees}
              min={0}
              max={360}
              step={15}
              unit="°"
            />
            <Select
              label="axis"
              k="axis"
              value={p.axis}
              options={["2d", "x", "y", "z"]}
            />
          </>
        );
      }
      case "bounce": {
        const p = params as TransitionParams["bounce"];
        return (
          <>
            <Slider
              label="height"
              k="height"
              value={p.height}
              min={5}
              max={50}
              step={5}
              unit="px"
            />
            <Slider
              label="intensity"
              k="intensity"
              value={p.intensity}
              min={0.5}
              max={2}
              step={0.1}
            />
            <Select
              label="direction"
              k="direction"
              value={p.direction}
              options={["up", "down"]}
            />
          </>
        );
      }
      case "mask": {
        const p = params as TransitionParams["mask"];
        return (
          <>
            <Select
              label="shape"
              k="shape"
              value={p.shape}
              options={["circle", "ellipse", "square"]}
            />
            <Select
              label="origin"
              k="origin"
              value={p.origin}
              options={["center", "top", "bottom", "left", "right"]}
            />
          </>
        );
      }
    }
  })();

  return (
    <div className="space-y-3">
      {controls}

      {/* Spring presets as buttons */}
      <div className="pt-3 border-t border-neutral-800">
        <span className="text-neutral-400 text-xs block mb-2">spring</span>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(springPresets) as SpringPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => onSpringChange(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                spring === preset
                  ? "bg-neutral-200 text-neutral-900"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function createTransition(
  type: TransitionType,
  params: TransitionParams[TransitionType],
  spring: SpringPreset,
) {
  const springConfig = springPresets[spring];

  switch (type) {
    case "fade": {
      const p = params as TransitionParams["fade"];
      return fade({ from: p.from, to: p.to, spring: springConfig });
    }
    case "scale": {
      const p = params as TransitionParams["scale"];
      return scale({
        start: p.start,
        opacity: p.opacity,
        axis: p.axis,
        spring: springConfig,
      });
    }
    case "blur": {
      const p = params as TransitionParams["blur"];
      return blur({
        amount: p.amount,
        opacity: p.opacity,
        spring: springConfig,
      });
    }
    case "slide": {
      const p = params as TransitionParams["slide"];
      return slide({
        direction: p.direction,
        distance: p.distance,
        spring: springConfig,
      });
    }
    case "fly": {
      const p = params as TransitionParams["fly"];
      return fly({ x: p.x, y: p.y, opacity: p.opacity, spring: springConfig });
    }
    case "rotate": {
      const p = params as TransitionParams["rotate"];
      return rotate({ degrees: p.degrees, axis: p.axis, spring: springConfig });
    }
    case "bounce": {
      const p = params as TransitionParams["bounce"];
      return bounce({
        height: p.height,
        intensity: p.intensity,
        direction: p.direction,
        spring: springConfig,
      });
    }
    case "mask": {
      const p = params as TransitionParams["mask"];
      return mask({ shape: p.shape, origin: p.origin, spring: springConfig });
    }
  }
}

export function TransitionDemo() {
  const [selectedType, setSelectedType] = useState<TransitionType>("fade");
  const [isVisible, setIsVisible] = useState(true);
  const [params, setParams] = useState<TransitionParams>(defaultParams);
  const [spring, setSpring] = useState<SpringPreset>("default");

  const currentParams = params[selectedType];
  const currentTransition = useMemo(
    () => createTransition(selectedType, currentParams, spring),
    [selectedType, currentParams, spring],
  );

  const handleParamsChange = (newParams: TransitionParams[TransitionType]) => {
    setParams((prev) => ({ ...prev, [selectedType]: newParams }));
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        {/* Header - type selector */}
        <div className="px-4 py-3 border-b border-neutral-800">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TransitionType)}
            className="px-3 py-1.5 bg-neutral-800 text-neutral-200 rounded-lg border border-neutral-700 text-sm"
          >
            {[
              "fade",
              "scale",
              "blur",
              "slide",
              "fly",
              "rotate",
              "bounce",
              "mask",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Demo area */}
        <div className="relative flex items-center justify-center h-[280px] bg-neutral-950">
          {isVisible && (
            <div
              ref={transition({
                key: `demo-${selectedType}-${JSON.stringify(currentParams)}-${spring}`,
                ...currentTransition,
              })}
              className="w-28 h-28 bg-neutral-100 rounded-xl flex items-center justify-center shadow-xl"
            >
              <span className="text-neutral-800 font-semibold text-sm">
                SSGOI
              </span>
            </div>
          )}

          {/* Toggle button near the box */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg text-sm hover:bg-neutral-700 transition-colors"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>

        {/* Control panel */}
        <div className="px-5 py-4 border-t border-neutral-800">
          <ControlPanel
            type={selectedType}
            params={currentParams}
            spring={spring}
            onParamsChange={handleParamsChange}
            onSpringChange={setSpring}
          />
        </div>
      </div>
    </div>
  );
}
