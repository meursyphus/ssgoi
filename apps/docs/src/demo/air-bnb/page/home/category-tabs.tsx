import { useState } from "react";
import { motion } from "motion/react";
import type { ExploreVertical } from "@/demo/air-bnb/state/listing";

type Tab = {
  key: ExploreVertical;
  label: string;
  emoji: string;
  badge?: "NEW";
};

const TABS: Tab[] = [
  { key: "homes", label: "Homes", emoji: "🏡" },
  { key: "experiences", label: "Experiences", emoji: "🎈", badge: "NEW" },
  { key: "services", label: "Services", emoji: "🛎", badge: "NEW" },
];

export function CategoryTabs({
  active,
  onSelect,
}: {
  active: ExploreVertical;
  onSelect: (vertical: ExploreVertical) => void;
}) {
  // Bounce the emoji of a tapped tab only — not on every return to Explore.
  const [tapped, setTapped] = useState<ExploreVertical | null>(null);
  return (
    <div className="border-b border-neutral-100">
      <div className="flex items-end justify-around px-2">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setTapped(tab.key);
                onSelect(tab.key);
              }}
              className={`relative flex flex-1 flex-col items-center gap-1 pt-1 pb-2.5 transition-colors ${
                isActive ? "text-neutral-900" : "text-neutral-400"
              }`}
            >
              <motion.span
                key={isActive ? "on" : "off"}
                initial={
                  isActive && tapped === tab.key ? { scale: 0.7, y: 6 } : false
                }
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 480, damping: 13 }}
                className="text-[34px] leading-none"
              >
                {tab.emoji}
              </motion.span>
              <span className="text-[12px] font-medium">{tab.label}</span>
              {tab.badge && (
                <span className="absolute right-2 top-0 rounded-full bg-[#FF385C] px-1.5 py-px text-[8px] font-bold tracking-wider text-white">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.span
                  layoutId="air-bnb-category-underline"
                  transition={{ type: "spring", stiffness: 520, damping: 40 }}
                  className="absolute -bottom-px left-1/2 h-[2px] w-12 -translate-x-1/2 rounded-full bg-neutral-900"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
