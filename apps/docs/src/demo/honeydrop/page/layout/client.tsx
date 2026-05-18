"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { rotate } from "@ssgoi/react/view-transitions";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";
import { HiveMenu } from "../shared/hive-menu";
import { CornerMarks } from "../shared/corner-marks";

const BASE = "/demo/honeydrop";
const COURT = BASE;
const DROP = `${BASE}/drop`;

const config: SsgoiConfig = {
  transitions: rotate({ paths: [COURT, DROP] }),
};

export function HoneydropLayoutClient({ children }: { children: ReactNode }) {
  return (
    <DemoShell>
      <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
        <SsgoiWithHost config={config}>
          <main className="relative h-full w-full">{children}</main>
        </SsgoiWithHost>
        {/* fixed chrome — outside Ssgoi so it doesn't rotate with the page */}
        <HiveMenu />
        <CornerMarks />
      </div>
    </DemoShell>
  );
}
