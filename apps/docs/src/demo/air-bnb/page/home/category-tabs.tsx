type Tab = {
  key: "homes" | "experiences" | "services";
  label: string;
  emoji: string;
  badge?: "NEW";
  active?: boolean;
};

const TABS: Tab[] = [
  { key: "homes", label: "Homes", emoji: "🏡", active: true },
  { key: "experiences", label: "Experiences", emoji: "🎈", badge: "NEW" },
  { key: "services", label: "Services", emoji: "🛎", badge: "NEW" },
];

export function CategoryTabs() {
  return (
    <div className="border-b border-neutral-100">
      <div className="flex items-end justify-around px-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            disabled={!tab.active}
            className={`relative flex flex-1 flex-col items-center gap-1 pt-1 pb-2.5 ${
              tab.active ? "text-neutral-900" : "text-neutral-400"
            }`}
          >
            <span className="text-[34px] leading-none">{tab.emoji}</span>
            <span className="text-[12px] font-medium">{tab.label}</span>
            {tab.badge && (
              <span className="absolute right-2 top-0 rounded-full bg-[#FF385C] px-1.5 py-px text-[8px] font-bold tracking-wider text-white">
                {tab.badge}
              </span>
            )}
            {tab.active && (
              <span className="absolute -bottom-px left-1/2 h-[2px] w-12 -translate-x-1/2 rounded-full bg-neutral-900" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
