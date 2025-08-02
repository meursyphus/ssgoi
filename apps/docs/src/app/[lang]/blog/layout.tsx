"use client";
import { useCurrentLanguage } from "@/i18n";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { fade, hero } from "@ssgoi/react/view-transitions";
import { useMemo } from "react";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  const lang = useCurrentLanguage();

  const config = useMemo<SsgoiConfig>(
    () => ({
      transitions: [],
      defaultTransition: hero({ spring: { stiffness: 30, damping: 10 } }),
    }),
    [lang]
  );
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 pt-16">
      <div className="relative overflow-hidden z-0">
        <Ssgoi config={config}>{children}</Ssgoi>
      </div>
    </div>
  );
}
