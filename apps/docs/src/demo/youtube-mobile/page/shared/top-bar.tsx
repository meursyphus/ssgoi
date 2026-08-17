import { Bell, Search, Settings } from "lucide-react";
import { YouTubeBrand } from "./brand";

export function YouTubeTopBar({ profile = false }: { profile?: boolean }) {
  return (
    <header className="flex h-[58px] items-center justify-between bg-white px-4">
      {profile ? (
        <button
          type="button"
          className="rounded-full border border-neutral-300 px-4 py-2 text-[14px] font-medium"
        >
          Switch account
        </button>
      ) : (
        <YouTubeBrand />
      )}
      <div className="flex items-center gap-4 text-neutral-950">
        <span className="relative">
          <Bell className="h-[23px] w-[23px]" strokeWidth={2} />
          <span className="absolute -right-2 -top-2 rounded-full bg-[#e9002b] px-1.5 text-[9px] font-bold leading-[16px] text-white">
            9+
          </span>
        </span>
        <Search className="h-[24px] w-[24px]" strokeWidth={2} />
        {profile && <Settings className="h-[23px] w-[23px]" strokeWidth={2} />}
      </div>
    </header>
  );
}
