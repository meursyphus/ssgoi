"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

const PAGES = [
  "Home",
  "Courses",
  "Certification",
  "Funding",
  "Competition",
  "Enterprise",
  "About",
  "FAQ",
  "Contact",
];

type CourseEntry =
  | { label: string; href: string; badge?: "NEW"; disabled?: false }
  | { label: string; disabled: true; badge?: "NEW" };

const COURSES: CourseEntry[] = [
  { label: "Documentary Foundations", href: "/demo/lumen" },
  {
    label: "The Cinematic Eye",
    href: "/demo/lumen/cinematic-eye",
    badge: "NEW",
  },
  { label: "Advanced Documentary", disabled: true },
  { label: "Create & Earn", disabled: true },
  { label: "The Perfect Cut", disabled: true },
  { label: "CinePath Pro", disabled: true },
  { label: "Producing Foundations", disabled: true },
];

const SOCIALS = [
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active: "foundations" | "cinematic-eye" = pathname?.endsWith(
    "/cinematic-eye",
  )
    ? "cinematic-eye"
    : "foundations";

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* always-visible top bar inside the page */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href="/demo/lumen"
          className="pointer-events-auto font-serif text-xl tracking-[0.18em] text-white"
        >
          LUMEN
        </Link>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-white/40 px-5 py-2 text-[11px] font-medium tracking-[0.22em] text-white uppercase backdrop-blur-sm transition hover:bg-white/10"
          >
            Menu
          </button>
          <button
            type="button"
            disabled
            aria-disabled
            className="rounded-full border border-white/15 px-5 py-2 text-[11px] font-medium tracking-[0.22em] text-white/30 uppercase cursor-not-allowed"
          >
            Join Now
          </button>
        </div>
      </header>

      {/* drop-down overlay — absolute fills the page transition boundary */}
      <div
        className={`absolute inset-0 z-50 flex flex-col bg-black text-white transition-transform duration-[600ms] ease-[cubic-bezier(0.7,0,0.2,1)] ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6 lg:px-10">
          <span className="font-serif text-xl tracking-[0.18em]">LUMEN</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-amber-400 px-5 py-2 text-[11px] font-semibold tracking-[0.22em] text-black uppercase transition hover:bg-amber-300"
            >
              Close
            </button>
            <button
              type="button"
              disabled
              aria-disabled
              className="rounded-full border border-white/15 px-5 py-2 text-[11px] font-medium tracking-[0.22em] text-white/30 uppercase cursor-not-allowed"
            >
              Join Now →
            </button>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-12 px-6 pt-8 pb-10 lg:grid-cols-[220px_1fr] lg:px-10">
          {/* left column: pages + socials */}
          <nav className="flex flex-col gap-10">
            <div>
              <h3 className="mb-4 text-[11px] tracking-[0.28em] text-amber-400 uppercase">
                Pages
              </h3>
              <ul className="flex flex-col gap-2">
                {PAGES.map((label) => (
                  <li key={label}>
                    <span
                      aria-disabled
                      className="cursor-not-allowed text-base text-white/25 line-through decoration-white/15 decoration-1"
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10px] tracking-[0.22em] text-white/30 uppercase">
                Demo only — pages unavailable
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-[11px] tracking-[0.28em] text-amber-400 uppercase">
                Socials
              </h3>
              <ul className="flex flex-col gap-2">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-base text-white/90 transition hover:text-white"
                    >
                      {s.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* center: courses */}
          <div className="flex flex-col">
            <h3 className="mb-4 text-[11px] tracking-[0.28em] text-amber-400 uppercase">
              Courses
            </h3>
            <ul className="flex flex-col gap-1">
              {COURSES.map((c) => {
                if (c.disabled) {
                  return (
                    <li key={c.label}>
                      <span
                        aria-disabled
                        className="inline-flex cursor-not-allowed items-center gap-3 py-1 font-serif text-3xl leading-tight tracking-tight text-white/25 line-through decoration-white/15 decoration-1 lg:text-4xl"
                      >
                        {c.label}
                      </span>
                    </li>
                  );
                }
                const isActive =
                  (active === "foundations" &&
                    c.label === "Documentary Foundations") ||
                  (active === "cinematic-eye" &&
                    c.label === "The Cinematic Eye");
                return (
                  <li key={c.label}>
                    <Link
                      href={c.href}
                      className="group inline-flex items-center gap-3 py-1 font-serif text-3xl leading-tight tracking-tight transition lg:text-4xl"
                    >
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      )}
                      <span
                        className={
                          isActive
                            ? "text-white"
                            : "text-white/90 group-hover:text-white"
                        }
                      >
                        {c.label}
                      </span>
                      {c.badge && (
                        <span className="rounded-full border border-amber-400 px-2 py-0.5 text-[10px] tracking-[0.22em] text-amber-400 uppercase">
                          {c.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8">
              <button
                type="button"
                disabled
                aria-disabled
                className="cursor-not-allowed rounded-full border border-white/15 px-6 py-2.5 text-[11px] font-semibold tracking-[0.22em] text-white/30 uppercase"
              >
                Login →
              </button>
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-4 text-[10px] tracking-[0.22em] uppercase lg:px-10">
          <div className="flex gap-6">
            <span className="cursor-not-allowed text-white/25 line-through decoration-white/15 decoration-1">
              Privacy Policy
            </span>
            <span className="cursor-not-allowed text-white/25 line-through decoration-white/15 decoration-1">
              Terms of Use
            </span>
          </div>
          <div className="text-white/40">
            The most comprehensive online filmmaking academy
          </div>
        </footer>
      </div>
    </>
  );
}
