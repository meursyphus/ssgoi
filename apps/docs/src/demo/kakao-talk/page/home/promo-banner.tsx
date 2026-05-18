export function PromoBanner() {
  return (
    <div className="mx-4 mb-2 mt-1 flex items-center gap-3 overflow-hidden rounded-2xl bg-neutral-100 px-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[15px] font-bold leading-tight text-neutral-900">
          Plans this weekend?
        </p>
        <p className="mt-0.5 text-[12px] text-neutral-500">
          Catch up with someone you haven&apos;t seen in a while
        </p>
      </div>
      <img
        src="https://picsum.photos/seed/kakao-promo/120/120"
        alt=""
        className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover"
      />
    </div>
  );
}
