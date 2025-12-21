"use client";

import React, { useMemo } from "react";
import type { SimulationFrame } from "./types";

interface SpringCurveProps {
  frames: SimulationFrame[];
  width?: number;
  height?: number;
}

const PADDING = { top: 20, right: 20, bottom: 30, left: 40 };

function generatePath(
  frames: SimulationFrame[],
  graphWidth: number,
  graphHeight: number,
): string {
  if (frames.length === 0) return "";

  const maxTime = frames[frames.length - 1]?.time ?? 1;

  const points = frames.map((frame) => {
    const x = PADDING.left + (frame.time / maxTime) * graphWidth;
    const y = PADDING.top + (1 - frame.position) * graphHeight;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return `M ${points.join(" L ")}`;
}

function generateGridLines(
  graphWidth: number,
  graphHeight: number,
  maxTime: number,
): { x: React.ReactNode[]; y: React.ReactNode[] } {
  const xLines: React.ReactNode[] = [];
  const yLines: React.ReactNode[] = [];

  // Y-axis grid (0, 0.5, 1)
  [0, 0.5, 1].forEach((val) => {
    const y = PADDING.top + (1 - val) * graphHeight;
    yLines.push(
      <g key={`y-${val}`}>
        <line
          x1={PADDING.left}
          y1={y}
          x2={PADDING.left + graphWidth}
          y2={y}
          stroke="#333"
          strokeDasharray={val === 0 || val === 1 ? "0" : "4,4"}
        />
        <text
          x={PADDING.left - 8}
          y={y + 4}
          textAnchor="end"
          className="fill-neutral-500 text-[10px]"
        >
          {val}
        </text>
      </g>,
    );
  });

  // X-axis grid (time markers)
  const timeStep = maxTime <= 500 ? 100 : maxTime <= 1000 ? 200 : 500;
  for (let t = 0; t <= maxTime; t += timeStep) {
    const x = PADDING.left + (t / maxTime) * graphWidth;
    xLines.push(
      <g key={`x-${t}`}>
        <line
          x1={x}
          y1={PADDING.top}
          x2={x}
          y2={PADDING.top + graphHeight}
          stroke="#333"
          strokeDasharray={t === 0 ? "0" : "4,4"}
        />
        <text
          x={x}
          y={PADDING.top + graphHeight + 16}
          textAnchor="middle"
          className="fill-neutral-500 text-[10px]"
        >
          {t}
        </text>
      </g>,
    );
  }

  return { x: xLines, y: yLines };
}

export function SpringCurve({
  frames,
  width = 400,
  height = 200,
}: SpringCurveProps) {
  const graphWidth = width - PADDING.left - PADDING.right;
  const graphHeight = height - PADDING.top - PADDING.bottom;
  const maxTime = frames[frames.length - 1]?.time ?? 1000;

  const pathD = useMemo(
    () => generatePath(frames, graphWidth, graphHeight),
    [frames, graphWidth, graphHeight],
  );

  const gridLines = useMemo(
    () => generateGridLines(graphWidth, graphHeight, maxTime),
    [graphWidth, graphHeight, maxTime],
  );

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-lg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid lines */}
      {gridLines.y}
      {gridLines.x}

      {/* Axes */}
      <line
        x1={PADDING.left}
        y1={PADDING.top + graphHeight}
        x2={PADDING.left + graphWidth}
        y2={PADDING.top + graphHeight}
        stroke="#525252"
        strokeWidth={1}
      />
      <line
        x1={PADDING.left}
        y1={PADDING.top}
        x2={PADDING.left}
        y2={PADDING.top + graphHeight}
        stroke="#525252"
        strokeWidth={1}
      />

      {/* Curve */}
      <path
        d={pathD}
        fill="none"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* X-axis label */}
      <text
        x={PADDING.left + graphWidth / 2}
        y={height - 4}
        textAnchor="middle"
        className="fill-neutral-600 text-[9px]"
      >
        time (ms)
      </text>
    </svg>
  );
}
