"use client";

/**
 * Card with a "Create" white pill centered on a purple gradient.
 * No handlers wired up — display only.
 */
export function HeroCard() {
  return (
    <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#8E5BE8] via-[#7B5BE8] to-[#5F76F5]">
      <span className="rounded-full bg-white/95 px-5 py-2 text-[14px] font-semibold text-neutral-900 shadow">
        Create
      </span>
      <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <span className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/15" />
    </div>
  );
}
