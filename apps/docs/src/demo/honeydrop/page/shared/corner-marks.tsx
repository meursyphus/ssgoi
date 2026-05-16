"use client";

export function CornerMarks() {
  return (
    <>
      {/* bottom-left: court diagram */}
      <svg
        viewBox="0 0 48 32"
        aria-hidden
        className="pointer-events-none fixed bottom-5 left-5 z-40 h-7 w-10 stroke-[#f0b500] fill-none opacity-90"
        strokeWidth="1.5"
      >
        <path d="M3 28 L24 6 L45 28" />
        <path d="M3 28 L45 28" strokeOpacity="0.4" />
        <path d="M16 28 L24 16 L32 28" className="fill-[#f0b500]/35" />
      </svg>
      {/* bottom-right: sneaker */}
      <svg
        viewBox="0 0 56 32"
        aria-hidden
        className="pointer-events-none fixed right-5 bottom-5 z-40 h-7 w-12 stroke-[#f0b500] fill-none opacity-90"
        strokeWidth="1.5"
      >
        <path d="M4 22 L4 14 L16 14 L22 8 L36 8 L40 14 L52 14 L52 24 L8 24 Z" />
        <path d="M4 22 L52 22" strokeOpacity="0.4" />
      </svg>
    </>
  );
}
