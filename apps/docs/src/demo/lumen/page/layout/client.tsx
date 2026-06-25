"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { film } from "@ssgoi/react/view-transitions";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";

const BASE = "/demo/lumen";
const FOUNDATIONS = BASE;
const CINEMATIC_EYE = `${BASE}/cinematic-eye`;

const config: SsgoiConfig = {
  transitions: film({ paths: [FOUNDATIONS, CINEMATIC_EYE] }),
};

export function LumenLayoutClient({ children }: { children: ReactNode }) {
  return (
    <DemoShell>
      <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
        <SsgoiWithHost
          config={config}
          boundaryClassName="h-full min-h-full bg-black"
        >
          {children}
        </SsgoiWithHost>
      </div>
    </DemoShell>
  );
}
