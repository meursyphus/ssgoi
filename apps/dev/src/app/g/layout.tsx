"use client";

import { ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { MobileFrame } from "@/components/mobile-frame";

const config: SsgoiConfig = {
  transitions: [
    sheet({
      enter: "/g/sheet1/compose",
      exit: "/g/sheet1",
    }),
  ],
};

export default function GLayout({ children }: { children: ReactNode }) {
  return (
    <MobileFrame>
      <Ssgoi config={config}>{children}</Ssgoi>
    </MobileFrame>
  );
}
