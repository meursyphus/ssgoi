"use client";

import type {
  GraphConfig,
  SpringSettings,
  InertiaSettings,
  ResistanceType,
} from "./types";
import { SLIDER_RANGES, DEFAULT_SPRING, DEFAULT_INERTIA } from "./types";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-neutral-500 w-16">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-0.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
      />
      <span className="text-[10px] text-neutral-400 w-8 text-right font-mono">
        {value}
      </span>
    </div>
  );
}

interface SpringGroupProps {
  label: string;
  settings: SpringSettings;
  onChange: (settings: SpringSettings) => void;
  onRemove?: () => void;
}

function SpringGroup({
  label,
  settings,
  onChange,
  onRemove,
}: SpringGroupProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-neutral-600 hover:text-neutral-400 text-[10px] transition-colors"
            aria-label="Remove"
          >
            ×
          </button>
        )}
      </div>
      <div className="space-y-1">
        <Slider
          label="stiffness"
          value={settings.stiffness}
          min={SLIDER_RANGES.stiffness.min}
          max={SLIDER_RANGES.stiffness.max}
          step={SLIDER_RANGES.stiffness.step}
          onChange={(stiffness) => onChange({ ...settings, stiffness })}
        />
        <Slider
          label="damping"
          value={settings.damping}
          min={SLIDER_RANGES.damping.min}
          max={SLIDER_RANGES.damping.max}
          step={SLIDER_RANGES.damping.step}
          onChange={(damping) => onChange({ ...settings, damping })}
        />
      </div>
    </div>
  );
}

interface InertiaGroupProps {
  settings: InertiaSettings;
  onChange: (settings: InertiaSettings) => void;
  onRemove: () => void;
}

function InertiaGroup({ settings, onChange, onRemove }: InertiaGroupProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
          Inertia
        </span>
        <button
          onClick={onRemove}
          className="text-neutral-600 hover:text-neutral-400 text-[10px] transition-colors"
          aria-label="Remove"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <Slider
          label="accel"
          value={settings.acceleration}
          min={SLIDER_RANGES.acceleration.min}
          max={SLIDER_RANGES.acceleration.max}
          step={SLIDER_RANGES.acceleration.step}
          onChange={(acceleration) => onChange({ ...settings, acceleration })}
        />
        <Slider
          label="resist"
          value={settings.resistance}
          min={SLIDER_RANGES.resistance.min}
          max={SLIDER_RANGES.resistance.max}
          step={SLIDER_RANGES.resistance.step}
          onChange={(resistance) => onChange({ ...settings, resistance })}
        />
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-neutral-500 w-16">type</span>
          <select
            value={settings.resistanceType}
            onChange={(e) =>
              onChange({
                ...settings,
                resistanceType: e.target.value as ResistanceType,
              })
            }
            className="flex-1 text-[10px] bg-transparent border border-neutral-700 rounded px-1 py-0.5 text-neutral-400 cursor-pointer"
          >
            <option value="quadratic">v² (quadratic)</option>
            <option value="linear">v (linear)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

interface SpringControlsProps {
  config: GraphConfig;
  onChange: (config: GraphConfig) => void;
}

export function SpringControls({ config, onChange }: SpringControlsProps) {
  const handleLeaderChange = (leader: SpringSettings) => {
    onChange({ ...config, leader });
  };

  const handleFollowerChange = (follower: SpringSettings) => {
    onChange({ ...config, follower });
  };

  const handleInertiaChange = (inertia: InertiaSettings) => {
    onChange({ ...config, inertia });
  };

  const handleAddFollower = () => {
    onChange({ ...config, follower: { ...DEFAULT_SPRING }, inertia: null });
  };

  const handleRemoveFollower = () => {
    onChange({ ...config, follower: null });
  };

  const handleAddInertia = () => {
    onChange({ ...config, inertia: { ...DEFAULT_INERTIA }, follower: null });
  };

  const handleRemoveInertia = () => {
    onChange({ ...config, inertia: null });
  };

  // Inertia mode - show inertia controls only
  if (config.inertia) {
    return (
      <div className="flex justify-center">
        <div className="flex items-start gap-8">
          <InertiaGroup
            settings={config.inertia}
            onChange={handleInertiaChange}
            onRemove={handleRemoveInertia}
          />
        </div>
      </div>
    );
  }

  // Spring mode
  return (
    <div className="flex justify-center">
      <div className="flex items-start gap-8">
        <SpringGroup
          label="Spring"
          settings={config.leader}
          onChange={handleLeaderChange}
        />

        {config.follower ? (
          <SpringGroup
            label="Follower"
            settings={config.follower}
            onChange={handleFollowerChange}
            onRemove={handleRemoveFollower}
          />
        ) : (
          <div className="flex flex-col gap-1 mt-4">
            <button
              onClick={handleAddFollower}
              className="text-[9px] text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              + follower
            </button>
            <button
              onClick={handleAddInertia}
              className="text-[9px] text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              + inertia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
