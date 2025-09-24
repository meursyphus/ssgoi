"use client";
import React from "react";
import DemoLayout from "@/components/demo/layout";
import { useCurrentLanguage } from "@/i18n";
import { usePathname, useRouter } from "next/navigation";
import { RouterProvider } from "@/components/demo/router-provider";
import { useMobile } from "@/lib/use-mobile";
import { Particles } from "@/components/demo/particles";

export default function DemoWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = useCurrentLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMobile();
  const customRouter = {
    goto: (path: string) => {
      router.push(`/${lang}/${path}`);
    },
    prefetch: (path: string) => {
      router.prefetch(`/${lang}/${path}`);
    },
  };
  return (
    <div className="h-[calc(100vh-80px)] md:h-screen md:-mt-20 grow flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black lg:py-10 relative overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle gradient accent */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
      </div>

      {/* Particles for desktop only */}
      {!isMobile && <Particles />}

      {/* Main content */}
      <div className="w-full h-full lg:w-[390px] lg:h-[844px] lg:rounded-[3rem] overflow-hidden lg:border-8 lg:border-gray-800 lg:shadow-2xl relative z-10">
        <RouterProvider
          currentPath={pathname.replace(`/${lang}`, "")}
          customRouter={customRouter}
        >
          <DemoLayout>{children}</DemoLayout>
        </RouterProvider>
      </div>
    </div>
  );
}
