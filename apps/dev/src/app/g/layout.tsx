"use client";

import { ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { MobileFrame } from "@/components/mobile-frame";
import {
  AnimationDock,
  SsgoiDebugProvider,
  useSsgoiHost,
} from "@/components/animation-dock";

const config: SsgoiConfig = {
  transitions: [{ on: "/g/sheet1/compose", transition: sheet() }],
};

function GLayoutInner({ children }: { children: ReactNode }) {
  const host = useSsgoiHost() ?? undefined;
  return (
    <MobileFrame>
      <Ssgoi config={config} host={host}>
        {children}
      </Ssgoi>
    </MobileFrame>
  );
}

export default function GLayout({ children }: { children: ReactNode }) {
  return (
    <SsgoiDebugProvider>
      <GLayoutInner>{children}</GLayoutInner>
      <AnimationDock />
    </SsgoiDebugProvider>
  );
}
