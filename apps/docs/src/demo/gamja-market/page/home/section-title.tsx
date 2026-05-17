export function SectionTitle() {
  return (
    <div className="flex items-center gap-2 px-4 pt-5 pb-2">
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e9f5e0] text-[#2db400]"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path
            d="M4.5 19.5c0-7.5 5.5-13.5 15-14.5-1 9.5-7.5 14.5-15 14.5z"
            fill="currentColor"
            fillOpacity="0.35"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[16px] font-bold text-gray-900">오늘의 공구</span>
    </div>
  );
}
