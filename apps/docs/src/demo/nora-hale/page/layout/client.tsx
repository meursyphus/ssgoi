"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { strip } from "@ssgoi/react/view-transitions";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";
import { SiteHeader } from "../shared/site-header";

const BASE = "/demo/nora-hale";
const ARCHIVE = BASE;
const ABOUT = `${BASE}/about`;

const config: SsgoiConfig = {
  transitions: strip({ paths: [ARCHIVE, ABOUT] }),
};

export function NoraHaleLayoutClient({ children }: { children: ReactNode }) {
  return (
    <DemoShell>
      <div className="relative h-dvh w-full overflow-hidden bg-[#f4ecdd] text-[#1a1a1a]">
        <SiteHeader />
        <SsgoiWithHost
          config={config}
          boundaryClassName="h-full min-h-full bg-[#f4ecdd]"
        >
          <main className="relative h-full w-full">{children}</main>
        </SsgoiWithHost>
      </div>
    </DemoShell>
  );
}
