"use client";

import { useState, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { rotate } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { useShowcaseFrameBridge } from "@/lib/hooks";
import { HiveMenu } from "../shared/hive-menu";
import { CornerMarks } from "../shared/corner-marks";

const BASE = "/demo/honeydrop";
const COURT = BASE;
const DROP = `${BASE}/drop`;

const config: SsgoiConfig = {
  transitions: rotate({ paths: [COURT, DROP] }),
};

export function HoneydropLayoutClient({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  useShowcaseFrameBridge(host);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
      <Ssgoi config={config} host={host}>
        <main className="relative h-full w-full">{children}</main>
      </Ssgoi>
      {/* fixed chrome — outside Ssgoi so it doesn't rotate with the page */}
      <HiveMenu />
      <CornerMarks />
    </div>
  );
}
