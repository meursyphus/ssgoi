import { Search } from "lucide-react";
import { Link } from "@/lib/link";

export function SearchBottomBar({
  href,
  onClear,
}: {
  href: string;
  onClear: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-neutral-200 bg-white px-5 pt-3 pb-5">
      <button
        type="button"
        onClick={onClear}
        className="text-[15px] font-semibold text-neutral-900 underline underline-offset-2"
      >
        Clear all
      </button>
      <Link
        href={href}
        scroll={false}
        className="flex items-center gap-2 rounded-xl bg-[#FF385C] px-6 py-3.5 text-[15px] font-semibold text-white active:opacity-90"
      >
        <Search className="h-4 w-4" strokeWidth={2.6} />
        Search
      </Link>
    </div>
  );
}
