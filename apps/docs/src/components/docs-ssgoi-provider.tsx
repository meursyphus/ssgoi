"use client";

import type { ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { scroll } from "@ssgoi/react/view-transitions";

const config: SsgoiConfig = {
  transitions: [
    ...scroll({
      paths: ["/", "/showcase"],
      type: "non-directional",
      direction: "up",
    }),
  ],
};

export function DocsSsgoiProvider({ children }: { children: ReactNode }) {
  return <Ssgoi config={config}>{children}</Ssgoi>;
}
