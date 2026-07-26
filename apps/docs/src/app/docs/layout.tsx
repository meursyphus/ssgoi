import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { DocsSidebar, DocsMobileNav } from "@/page/docs/sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-canvas">
      <SiteNav active="docs" desktopOnly />
      <DocsMobileNav />
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 pt-10 lg:gap-14 lg:pt-16">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="scrollbar-subtle sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pb-8 pr-2">
            <DocsSidebar />
          </div>
        </aside>
        <main className="min-w-0 max-w-3xl flex-1 pb-28">{children}</main>
      </div>
    </div>
  );
}
