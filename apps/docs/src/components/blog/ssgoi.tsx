"use client";

export { SsgoiTransition } from "@ssgoi/react";

import { Ssgoi } from "@ssgoi/react";
import { SsgoiConfig } from "@ssgoi/core";
import { useMemo } from "react";

export function BlogSsgoi({ children }: { children: React.ReactNode }) {
  const config = useMemo<SsgoiConfig>(() => {
    return {
      transitions: [], // Empty transitions for blog pages
    };
  }, []);
  return <Ssgoi config={config}>{children}</Ssgoi>;
}
