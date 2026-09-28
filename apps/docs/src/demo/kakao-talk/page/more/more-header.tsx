import { Search } from "lucide-react";
import { Link } from "@/lib/link";

export function MoreHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center justify-between bg-white pl-4 pr-2">
      <h1 className="text-[22px] font-bold leading-none text-neutral-900">
        더보기
      </h1>
      <Link
        href="/demo/kakao-talk/search"
        scroll={false}
        aria-label="검색"
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 hover:bg-black/5 active:bg-black/5"
      >
        <Search className="h-[20px] w-[20px]" strokeWidth={1.8} />
      </Link>
    </header>
  );
}
