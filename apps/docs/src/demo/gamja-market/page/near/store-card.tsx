import { Clock, MapPin } from "lucide-react";

export function StoreCard({ productCount }: { productCount: number }) {
  return (
    <section className="bg-white px-4 py-5">
      <div className="flex items-center gap-3">
        <img
          src="/gamja-market-icon.svg"
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 rounded-xl"
        />
        <div className="min-w-0">
          <p className="text-[16px] font-bold text-gray-900">
            감자마켓 올림픽파크포레온점
          </p>
          <p className="mt-0.5 text-[12px] text-gray-500">
            둔촌동 · 오늘의 공구 {productCount}개
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-[13px] text-gray-700">
        <li className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-[#2db400]" />
          올림픽파크포레온 상가 1층 픽업존
        </li>
        <li className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-[#2db400]" />
          <span>
            <span className="font-semibold text-[#2db400]">영업 중</span> · 오늘
            10:00 – 20:00
          </span>
        </li>
      </ul>
    </section>
  );
}
