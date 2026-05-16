"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE = "/demo/honeydrop";

const ITEMS: Array<{ index: string; label: string; href: string }> = [
  { index: "01", label: "THE COURT", href: BASE },
  { index: "02", label: "THE DROP", href: `${BASE}/drop` },
  { index: "03", label: "SHOE SCHOOL", href: BASE },
  { index: "04", label: "THE LOUNGE", href: BASE },
];

function Hex({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`fill-[#f0b500] stroke-[#f0b500]/40 ${className}`}
    >
      <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" strokeWidth="1" />
    </svg>
  );
}

function Bee({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 24"
      aria-hidden
      className={`fill-white/95 ${className}`}
    >
      {/* wings */}
      <ellipse cx="9" cy="6" rx="5" ry="3" className="fill-white/60" />
      <ellipse cx="23" cy="6" rx="5" ry="3" className="fill-white/60" />
      {/* body */}
      <ellipse cx="16" cy="14" rx="7" ry="5" />
      <path
        d="M11 13 h10 M11 16 h10"
        className="stroke-black"
        strokeWidth="1.5"
        fill="none"
      />
      {/* eye / antenna */}
      <circle cx="22.5" cy="12.5" r="0.9" className="fill-black" />
      <path
        d="M21 9 Q23 5 25 5"
        className="stroke-white/80"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function HiveMenu() {
  const pathname = usePathname() ?? BASE;
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Open menu"
        className="group fixed top-6 left-1/2 z-50 -translate-x-1/2 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5">
            <Hex className="h-3 w-3" />
            <Hex className="h-3 w-3 opacity-70" />
            <Hex className="h-3 w-3 opacity-70" />
            <Hex className="h-3 w-3" />
          </div>
          <Bee className="h-6 w-8 transition-transform group-hover:scale-110" />
          <div className="grid grid-cols-2 gap-0.5">
            <Hex className="h-3 w-3" />
            <Hex className="h-3 w-3 opacity-70" />
            <Hex className="h-3 w-3 opacity-70" />
            <Hex className="h-3 w-3" />
          </div>
        </div>
      </button>

      {/* centered overlay menu — fade only */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        <ul
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col items-center gap-2 px-8 py-10"
        >
          {ITEMS.map((it) => {
            const active = it.href === pathname;
            return (
              <li key={it.label} className="flex items-baseline gap-3">
                <span className="font-serif text-sm text-[#f0b500]/80">
                  <sup>{it.index}</sup>
                </span>
                <Link
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={`font-serif text-4xl font-bold tracking-wide uppercase transition sm:text-5xl lg:text-6xl ${
                    active ? "text-[#f0b500]" : "text-white/55 hover:text-white"
                  }`}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
