"use client";

import { Link } from "@/lib/link";
import { usePathname } from "next/navigation";

const BASE = "/demo/silent-room";

const ROOMS = [
  { index: "I", label: "Stillness", href: BASE },
  { index: "II", label: "Tension", href: `${BASE}/tension` },
  { index: "III", label: "Light", href: `${BASE}/light` },
];

export function GalleryChrome() {
  const pathname = usePathname() ?? BASE;
  const activeIdx = ROOMS.findIndex((r) => r.href === pathname);
  const active = activeIdx >= 0 ? ROOMS[activeIdx] : ROOMS[0];

  return (
    <>
      {/* top: logo + section */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 lg:px-10">
        <Link
          href={BASE}
          className="pointer-events-auto font-serif text-[11px] tracking-[0.46em] text-[#f5f1ea] uppercase"
        >
          Silent · Room
        </Link>
        <div className="pointer-events-auto flex items-center gap-3 text-[10px] tracking-[0.32em] text-[#f5f1ea]/55 uppercase">
          <span className="hidden md:inline">Currently on view</span>
          <span className="text-[#c9a96b]">— {active.label}</span>
        </div>
      </div>

      {/* bottom: room dot nav */}
      <nav className="fixed inset-x-0 bottom-6 z-40 flex justify-center lg:bottom-8">
        <ul className="flex items-center gap-7 rounded-full border border-[#f5f1ea]/15 bg-black/35 px-6 py-2.5 backdrop-blur-md">
          {ROOMS.map((r) => {
            const isActive = r.href === active.href;
            return (
              <li key={r.index}>
                <Link
                  href={r.href}
                  aria-current={isActive ? "page" : undefined}
                  className="group flex flex-col items-center"
                >
                  <span
                    className={`font-serif text-[11px] tracking-[0.32em] transition-colors ${
                      isActive
                        ? "text-[#c9a96b]"
                        : "text-[#f5f1ea]/55 group-hover:text-[#f5f1ea]"
                    }`}
                  >
                    {r.index}
                  </span>
                  <span
                    className={`mt-1 h-[1.5px] w-7 transition-all duration-500 ${
                      isActive
                        ? "bg-[#c9a96b]"
                        : "bg-[#f5f1ea]/20 group-hover:bg-[#f5f1ea]/50"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
