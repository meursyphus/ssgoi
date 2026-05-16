"use client";

import { ComwitProvider } from "comwit";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export type AppContext = {
  router: { push: (href: string) => void };
};

export function StateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ComwitProvider
      context={{ router }}
      defaultOptions={{
        query: {
          // 데모용 — 첫 fetch 후 영구 캐시.
          // 페이지마다 다시 loading skeleton 보이지 않도록 stale/GC 둘 다 무한.
          staleTime: Infinity,
          cacheTime: Infinity,
          gcTime: Infinity,
        },
      }}
    >
      {children}
    </ComwitProvider>
  );
}
