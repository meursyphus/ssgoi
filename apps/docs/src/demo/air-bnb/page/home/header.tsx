import { Search } from "lucide-react";
import { Link } from "@/lib/link";
import { routes } from "@/demo/air-bnb/page/shared/routes";

export function HomeHeader() {
  return (
    <div className="px-4 pt-3 pb-3">
      <Link
        href={routes.search}
        scroll={false}
        className="flex h-14 w-full items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 text-left shadow-[0_4px_14px_-6px_rgba(0,0,0,0.18)] transition-transform duration-150 active:scale-[0.98]"
      >
        <Search className="h-5 w-5 text-neutral-700" />
        <span className="flex-1 truncate text-[15px] font-medium text-neutral-700">
          Start your search
        </span>
      </Link>
    </div>
  );
}
