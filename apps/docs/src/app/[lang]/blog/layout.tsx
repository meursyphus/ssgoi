"use client";
import { Ssgoi, SsgoiConfig, SsgoiTransition } from "@ssgoi/react";
import { useMemo } from "react";
import { hero } from "@ssgoi/react/view-transitions";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  const config = useMemo<SsgoiConfig>(
    () => ({
      transitions: [],
      defaultTransition: hero(),
    }),
    [],
  );

  return (
    <SsgoiTransition
      id="/ssgoi/blog"
      as="div"
      className="page"
    >
      <div className="relative overflow-hidden z-0 pt-16">
        <Ssgoi config={config}>{children}</Ssgoi>
      </div>
    </SsgoiTransition>
  );
}
