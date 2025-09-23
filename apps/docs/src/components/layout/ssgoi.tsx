"use client";

import { useMobile } from "@/lib/use-mobile";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { fade, film } from "@ssgoi/react/view-transitions";
import { useMemo } from "react";

interface SsgoiProviderProps {
  children: React.ReactNode;
}

export function SsgoiProvider({ children }: SsgoiProviderProps) {
  const isMobile = useMobile();
  const config = useMemo<SsgoiConfig>(
    () => ({
      transitions: isMobile
        ? []
        : [
            // Apply film transition to non-demo pages
            {
              from: "/non-demo/*",
              to: "/non-demo/*",
              transition: film(),
            },
          ],
      defaultTransition: fade(),
      middleware(from, to) {
        // Transform paths: non-demo routes get prefixed with /non-demo
        const isDemoRoute = (path: string) => path.includes("/demo");

        const transformedFrom = isDemoRoute(from) ? from : `/non-demo${from}`;
        const transformedTo = isDemoRoute(to) ? to : `/non-demo${to}`;

        return { from: transformedFrom, to: transformedTo };
      },
    }),
    [isMobile],
  );

  return <Ssgoi config={config}>{children}</Ssgoi>;
}
