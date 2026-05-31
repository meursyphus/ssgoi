"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/lib/link";
import { DOCS_NAV, DOCS_NAV_FLAT } from "./nav";

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-7 text-sm">
      {DOCS_NAV.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
            {group.label}
          </p>
          <ul className="mt-2 flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "block rounded-lg px-3 py-1.5 transition-colors " +
                      (active
                        ? "bg-white/[0.06] font-medium text-neutral-100"
                        : "text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-100")
                    }
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsMobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Documentation"
      className="scrollbar-hide -mx-px overflow-x-auto border-b border-white/[0.06] lg:hidden"
    >
      <ul className="mx-auto flex w-max max-w-6xl items-center gap-1 px-5 py-3">
        {DOCS_NAV_FLAT.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  "block whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors " +
                  (active
                    ? "bg-white/[0.08] font-medium text-neutral-100"
                    : "text-neutral-400 hover:text-neutral-100")
                }
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
