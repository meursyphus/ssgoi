"use client";

import { useMemo, type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import {
  axis,
  blind,
  film,
  hero,
  scroll,
  zoom,
} from "@ssgoi/react/view-transitions";
import { SsgoiWithHost } from "@/lib/components/demo-shell";
import type { TransitionLabPreset } from "./presets";

function createTransition(preset: TransitionLabPreset) {
  switch (preset) {
    case "axis-y":
      return axis({ type: "y" });
    case "axis-z":
      return axis({ type: "z" });
    case "scroll-directional":
      return scroll({ type: "directional" });
    case "scroll-non-directional":
      return scroll({ type: "non-directional" });
    case "blind-horizontal":
      return blind({ type: "horizontal" });
    case "blind-vertical":
      return blind({ type: "vertical" });
    case "hero-static-default":
      return hero({ type: "static", variant: "default" });
    case "hero-static-smooth":
      return hero({ type: "static", variant: "smooth" });
    case "hero-fade-smooth":
      return hero({ type: "fade", variant: "smooth" });
    case "zoom-static-fade":
      return zoom({ type: "static", variant: "fade" });
    case "zoom-expand-fade":
      return zoom({ type: "expand", variant: "fade" });
    case "zoom-blur-default":
      return zoom({ type: "blur", variant: "default" });
    case "film-orange":
      return film({ options: { borderColor: "#fb923c" } });
  }
}

function createConfig(preset: TransitionLabPreset): SsgoiConfig {
  const base = `/demo/transition-lab/${preset}`;

  return {
    transitions: [
      {
        from: `${base}/a`,
        to: `${base}/b`,
        transition: createTransition(preset),
      },
    ],
  };
}

export function TransitionLabLayoutClient({
  preset,
  children,
}: {
  preset: TransitionLabPreset;
  children: ReactNode;
}) {
  const config = useMemo(() => createConfig(preset), [preset]);

  return (
    <div className="relative z-0 h-dvh w-full overflow-hidden bg-[#f2eee5] text-[#1d1a17]">
      <SsgoiWithHost
        config={config}
        boundaryClassName="h-full min-h-full bg-[#f2eee5]"
      >
        {children}
      </SsgoiWithHost>
    </div>
  );
}
