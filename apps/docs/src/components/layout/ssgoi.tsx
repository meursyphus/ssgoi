"use client";

import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { fade } from "@ssgoi/react/view-transitions";
import { useMemo } from "react";

interface SsgoiProviderProps {
  children: React.ReactNode;
}

export function SsgoiProvider({ children }: SsgoiProviderProps) {
  const config = useMemo<SsgoiConfig>(
    () => ({
      transitions: [],
      defaultTransition: fade(),
    }),
    []
  );

  return <Ssgoi config={config}>{children}</Ssgoi>;
}
