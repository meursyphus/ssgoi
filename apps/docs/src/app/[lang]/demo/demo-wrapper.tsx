"use client";
import React from "react";
import DemoLayout from "@/components/demo/layout";
import { useCurrentLanguage } from "@/i18n";
import { usePathname, useRouter } from "next/navigation";
import { RouterProvider } from "@/components/demo/router-provider";

export default function DemoWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = useCurrentLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const customRouter = {
    goto: (path: string) => {
      router.push(`/${lang}/${path}`);
    },
    prefetch: (path: string) => {
      router.prefetch(`/${lang}/${path}`);
    },
  };
  return (
    <div className="h-[calc(100vh-80px)] grow flex items-center justify-center bg-gray-100 lg:py-10">
      <div className="w-full h-full lg:w-[390px] lg:h-[844px] lg:rounded-[3rem] overflow-hidden lg:border-8 lg:border-gray-900 lg:shadow-2xl">
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
