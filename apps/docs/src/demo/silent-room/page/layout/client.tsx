"use client";

import { useState, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";
import { HostAnimation } from "@ssgoi/core/internal";
import { useShowcaseFrameBridge } from "@/lib/hooks";
import { GalleryChrome } from "../shared/gallery-chrome";

const BASE = "/demo/silent-room";
const STILLNESS = BASE;
const TENSION = `${BASE}/tension`;
const LIGHT = `${BASE}/light`;

const config: SsgoiConfig = {
  transitions: fade({ paths: [STILLNESS, TENSION, LIGHT] }),
};

export function SilentRoomLayoutClient({ children }: { children: ReactNode }) {
  const [host] = useState(() => new HostAnimation());
  useShowcaseFrameBridge(host);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0c0c0c] text-[#f5f1ea]">
      <Ssgoi config={config} host={host}>
        <main className="relative h-full w-full">{children}</main>
      </Ssgoi>
      <GalleryChrome />
    </div>
  );
}
