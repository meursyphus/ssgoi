import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-black">
      <SiteNav active="blog" />
      {children}
    </div>
  );
}
