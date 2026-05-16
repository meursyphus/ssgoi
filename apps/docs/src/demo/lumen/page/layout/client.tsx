"use client";

import { useState, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { film } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { useShowcaseFrameBridge } from "@/lib/hooks";

const BASE = "/demo/lumen";
const FOUNDATIONS = BASE;
const CINEMATIC_EYE = `${BASE}/cinematic-eye`;

const config: SsgoiConfig = {
  transitions: film({ paths: [FOUNDATIONS, CINEMATIC_EYE] }),
};

export function LumenLayoutClient({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  useShowcaseFrameBridge(host);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
      <Ssgoi config={config} host={host}>
        {children}
      </Ssgoi>
    </div>
  );
}
