import type { ReactNode } from "react";

/** Title bar for the bottom-tab roots (홈 keeps its logo header). */
export function TabHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-[#FAF8F6]">
      <div className="flex h-14 items-center justify-between px-4">
        <h1 className="text-[18px] font-bold text-gray-900">{title}</h1>
        {children}
      </div>
    </header>
  );
}
