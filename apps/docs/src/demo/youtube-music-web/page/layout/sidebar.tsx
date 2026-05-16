"use client";

import { Bookmark, Compass, Home, Pin, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Compass },
  { label: "Library", icon: Bookmark },
];

type PlaylistRow = {
  title: string;
  subtitle: string;
  icon: "pin" | "bookmark" | "avatar";
  /** color for avatar variant */
  tint?: string;
};

const PLAYLISTS: PlaylistRow[] = [
  { title: "Liked Music", subtitle: "Auto playlist", icon: "pin" },
  {
    title: "Late Night Drives",
    subtitle: "moon",
    icon: "avatar",
    tint: "from-rose-400 via-fuchsia-500 to-indigo-500",
  },
  {
    title: "Bedroom Pop Selects",
    subtitle: "moon",
    icon: "avatar",
    tint: "from-amber-300 via-orange-500 to-rose-500",
  },
  { title: "Episodes for Later", subtitle: "Auto playlist", icon: "bookmark" },
];

export function Sidebar() {
  const pathname = usePathname();
  const onHome = pathname === "/demo/youtube-music-web";

  return (
    <nav className="hidden w-60 shrink-0 flex-col overflow-y-auto border-r border-white/[0.06] bg-[#030303] py-2 md:flex">
      <ul className="px-2 pt-1">
        {NAV.map(({ label, icon: Icon }, i) => {
          const active = i === 0 && onHome;
          return (
            <li key={label}>
              <button
                type="button"
                className={[
                  "flex h-10 w-full items-center gap-5 rounded-md px-4 text-[13px] font-medium text-left",
                  active
                    ? "bg-white/[0.12] text-white"
                    : "text-white/85 hover:bg-white/[0.06]",
                ].join(" ")}
              >
                <Icon
                  className="h-[18px] w-[18px]"
                  strokeWidth={active ? 2 : 1.5}
                />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mx-4 my-3 h-px bg-white/[0.08]" />

      <div className="px-4">
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-[13px] font-medium text-white hover:bg-white/[0.08]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          New playlist
        </button>
      </div>

      <ul className="mt-3 flex flex-col gap-0.5 px-2 pb-4">
        {PLAYLISTS.map((p) => (
          <li key={p.title}>
            <button
              type="button"
              className="group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-white/[0.05]"
            >
              <PlaylistIcon row={p} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium leading-tight text-white">
                  {p.title}
                </div>
                <div className="truncate text-[11px] text-white/55">
                  {p.subtitle}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function PlaylistIcon({ row }: { row: PlaylistRow }) {
  if (row.icon === "pin") {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/[0.08]">
        <Pin className="h-[18px] w-[18px] text-white/85" strokeWidth={1.6} />
      </span>
    );
  }
  if (row.icon === "bookmark") {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/[0.08]">
        <Bookmark
          className="h-[18px] w-[18px] text-white/85"
          strokeWidth={1.6}
        />
      </span>
    );
  }
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-[13px] font-semibold text-white ${row.tint ?? "from-slate-500 to-slate-700"}`}
    >
      {row.subtitle.slice(0, 1).toUpperCase()}
    </span>
  );
}
