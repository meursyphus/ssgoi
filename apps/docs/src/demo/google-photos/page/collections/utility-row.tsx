"use client";

import { Heart, Trash2, Film, Archive } from "lucide-react";
import { Link } from "@/lib/link";
import { BASE } from "@/demo/google-photos/page/shared/paths";

/**
 * 2x2 utility buttons at the top of the Collections tab. Each one drills into
 * its collection like the cards below (Videos and Archive are kept out of the
 * card grid and only reachable from here).
 */
const ITEMS = [
  { Icon: Heart, label: "Favorites", id: "col-favorite" },
  { Icon: Trash2, label: "Trash", id: "col-trash" },
  { Icon: Film, label: "Videos", id: "col-video" },
  { Icon: Archive, label: "Archive", id: "col-archive" },
] as const;

export function UtilityRow() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ITEMS.map(({ Icon, label, id }) => (
        <Link
          key={label}
          href={`${BASE}/c/${id}`}
          scroll={false}
          className="flex items-center gap-3 rounded-full bg-neutral-100 px-4 py-3 text-left text-[13px] font-medium text-neutral-800 active:bg-neutral-200"
        >
          <Icon className="h-4 w-4 text-neutral-600" />
          {label}
        </Link>
      ))}
    </div>
  );
}
