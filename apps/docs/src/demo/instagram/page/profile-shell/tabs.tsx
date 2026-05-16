"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProfileTabs({ id }: { id: string }) {
  const pathname = usePathname();
  const base = `/demo/instagram/profile/${id}`;

  const tabs: { href: string; key: string; icon: React.ReactNode }[] = [
    { href: base, key: "grid", icon: <GridIcon /> },
    { href: `${base}/reels`, key: "reels", icon: <ReelIcon /> },
    { href: `${base}/remix`, key: "remix", icon: <RemixIcon /> },
    { href: `${base}/tagged`, key: "tagged", icon: <TaggedIcon /> },
  ];

  return (
    <div className="sticky top-[52px] z-20 grid grid-cols-4 border-t border-neutral-200 bg-white">
      {tabs.map((t) => {
        const isActive =
          t.key === "grid" ? pathname === base : pathname === t.href;
        return (
          <Link
            key={t.key}
            href={t.href}
            scroll={false}
            className={`grid h-11 place-items-center border-b-[1.5px] ${
              isActive
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400"
            }`}
          >
            {t.icon}
          </Link>
        );
      })}
    </div>
  );
}

function GridIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="3" width="6" height="6" />
      <rect x="3" y="15" width="6" height="6" />
      <rect x="15" y="3" width="6" height="6" />
      <rect x="15" y="15" width="6" height="6" />
      <rect x="9" y="9" width="6" height="6" />
    </svg>
  );
}

function ReelIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function RemixIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M15 4l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 9H8a4 4 0 0 0-4 4v0" strokeLinecap="round" />
      <path d="M9 20l-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 15h12a4 4 0 0 0 4-4v0" strokeLinecap="round" />
    </svg>
  );
}

function TaggedIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}
