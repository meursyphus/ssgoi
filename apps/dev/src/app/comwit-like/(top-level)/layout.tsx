import Link from "next/link";
import type { ReactNode } from "react";
import { SsgoiPageBoundary } from "@ssgoi/react";

/** Group boundary with the persistent tab bar INSIDE it, like Comwit's TabShell. */
export default function TopLevelLayout({ children }: { children: ReactNode }) {
  return (
    <SsgoiPageBoundary
      data-group="top-level"
      className="min-h-dvh bg-neutral-950"
    >
      {children}
      <nav className="sticky bottom-0 flex justify-around border-t border-white/10 bg-neutral-900 py-3 text-sm">
        <Link href="/comwit-like/list">List</Link>
        <Link href="/comwit-like/other">Other</Link>
      </nav>
    </SsgoiPageBoundary>
  );
}
