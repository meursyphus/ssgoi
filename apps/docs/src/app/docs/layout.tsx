import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { DocsSidebar, DocsMobileNav } from "@/page/docs/sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-black">
      <SiteNav active="docs" />
      <DocsMobileNav />
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 pt-8 lg:gap-12 lg:pt-12">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pb-8 pr-2">
            <DocsSidebar />
          </div>
        </aside>
        <main className="min-w-0 max-w-3xl flex-1 pb-24">{children}</main>
      </div>
    </div>
  );
}
