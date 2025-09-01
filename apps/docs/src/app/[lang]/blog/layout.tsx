"use client"
import { Ssgoi, SsgoiConfig, SsgoiTransition } from "@ssgoi/react";
import { useMemo } from "react";
import { hero } from "@ssgoi/react/view-transitions";
import { useCurrentLanguage } from "@/i18n";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  const lang = useCurrentLanguage()
  const config = useMemo<SsgoiConfig>(
    () => ({
      transitions: [],
      defaultTransition: hero(),
    }),
    [lang]  
  );

  return (
    <SsgoiTransition 
      id="/ssgoi/blog"
      as="div" 
      className="min-h-[calc(100vh-4rem)] bg-zinc-950 pt-16"
    >
      <div className="relative overflow-hidden z-0">
        <Ssgoi config={config}>{children}</Ssgoi>
      </div>
    </SsgoiTransition>
  );
}
