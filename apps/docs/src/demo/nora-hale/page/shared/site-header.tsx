"use client";

import { Link } from "@/lib/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

const BASE = "/demo/nora-hale";

const NAV: Array<{
  label: string;
  href: string;
  match: (p: string) => boolean;
}> = [
  {
    label: "ABOUT",
    href: `${BASE}/about`,
    match: (p) => p === `${BASE}/about`,
  },
  {
    label: "ARCHIVE",
    href: BASE,
    match: (p) => p === BASE,
  },
  {
    label: "JOURNAL",
    href: BASE,
    match: () => false,
  },
  {
    label: "CONTACT",
    href: BASE,
    match: () => false,
  },
];

export function SiteHeader() {
  const pathname = usePathname() ?? BASE;
  const accent =
    pathname === `${BASE}/about` ? "text-[#d94a35]" : "text-[#6b5cff]";

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-6 px-6 py-6 lg:px-10">
      <div className="pointer-events-auto flex items-center gap-8">
        <Link
          href={BASE}
          className={`font-serif text-2xl font-bold tracking-tight ${accent} transition-colors`}
        >
          NH
        </Link>
        <div className="hidden items-center gap-4 text-[11px] tracking-[0.18em] uppercase md:flex">
          <a
            href="mailto:hello@norahale.studio"
            className={`underline-offset-4 hover:underline ${accent}`}
          >
            HELLO@NORAHALE.STUDIO
          </a>
          <span className={`inline-flex items-center gap-1 ${accent}`}>
            <Sparkles className="h-3 w-3" />
            AVAILABLE Q3 2026
          </span>
        </div>
      </div>

      <nav className="pointer-events-auto flex items-center gap-5 text-[11px] tracking-[0.22em] uppercase">
        {NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`${accent} transition-opacity ${
                active
                  ? "underline underline-offset-[6px]"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
