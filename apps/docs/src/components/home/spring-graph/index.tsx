"use client";

import { useMemo } from "react";
import { SpringCurve } from "./spring-curve";
import { SpringControls } from "./spring-controls";
import { simulate } from "./simulate";
import type { GraphConfig } from "./types";

interface SpringGraphPanelProps {
  config: GraphConfig;
  onChange: (config: GraphConfig) => void;
}

export function SpringGraphPanel({ config, onChange }: SpringGraphPanelProps) {
  const frames = useMemo(() => simulate(config), [config]);

  const duration = frames[frames.length - 1]?.time ?? 0;

  return (
    <div className="space-y-6">
      {/* Graph - 넓게 */}
      <div>
        <SpringCurve frames={frames} width={600} height={200} />
      </div>

      {/* Duration */}
      <div className="text-center">
        <span className="text-[9px] text-neutral-600">
          {Math.round(duration)}ms
        </span>
      </div>

      {/* Controls - 가운데에 좁게 */}
      <SpringControls config={config} onChange={onChange} />
    </div>
  );
}

export { type GraphConfig, type SpringSettings, DEFAULT_SPRING } from "./types";
