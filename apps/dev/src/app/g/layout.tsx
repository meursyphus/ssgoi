"use client";

import { ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { sheet } from "@ssgoi/react/view-transitions";
import { MobileFrame } from "@/components/mobile-frame";

const config: SsgoiConfig = {
  transitions: [
    {
      from: "/g/sheet1",
      to: "/g/sheet1/compose",
      transition: sheet({ direction: "enter" }),
    },
    {
      from: "/g/sheet1/compose",
      to: "/g/sheet1",
      transition: sheet({ direction: "exit" }),
    },
  ],
};

export default function GLayout({ children }: { children: ReactNode }) {
  return (
    <MobileFrame>
      <Ssgoi config={config}>{children}</Ssgoi>
    </MobileFrame>
  );
}
