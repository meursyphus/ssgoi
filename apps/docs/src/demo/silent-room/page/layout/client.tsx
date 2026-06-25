"use client";

import { type ReactNode } from "react";
import { type SsgoiConfig } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";
import { DemoShell, SsgoiWithHost } from "@/lib/components/demo-shell";
import { GalleryChrome } from "../shared/gallery-chrome";

const BASE = "/demo/silent-room";
const STILLNESS = BASE;
const TENSION = `${BASE}/tension`;
const LIGHT = `${BASE}/light`;

const config: SsgoiConfig = {
  transitions: fade({ paths: [STILLNESS, TENSION, LIGHT] }),
};

export function SilentRoomLayoutClient({ children }: { children: ReactNode }) {
  return (
    <DemoShell>
      <div className="relative h-dvh w-full overflow-hidden bg-[#0c0c0c] text-[#f5f1ea]">
        <SsgoiWithHost
          config={config}
          boundaryClassName="h-full min-h-full bg-[#0c0c0c]"
        >
          <main className="relative h-full w-full">{children}</main>
        </SsgoiWithHost>
        <GalleryChrome />
      </div>
    </DemoShell>
  );
}
