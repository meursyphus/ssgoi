import Link from "next/link";
import { FileText } from "lucide-react";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-[#FAF8F6]">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img
            src="/gamja-market-logo.png"
            alt="감자마켓"
            className="h-6 w-auto"
          />
          <span className="text-[14px] font-semibold leading-[120%] text-gray-600">
            올림픽파크포레온점
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/demo/gamja-market/orders"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="주문내역"
          >
            <FileText className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
