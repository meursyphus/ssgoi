import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { DocsSidebar, DocsMobileNav } from "@/page/docs/sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div data-ssgoi-transition="/docs" className="relative min-h-dvh bg-black">
      <SiteNav active="docs" />
      <DocsMobileNav />
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 pt-8 lg:gap-14 lg:pt-12">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24">
            <DocsSidebar />
          </div>
        </aside>
        <main className="min-w-0 max-w-3xl flex-1 pb-24">{children}</main>
      </div>
    </div>
  );
}
