import { Search, Heart, Plane, MessageCircle, User } from "lucide-react";

type Item = {
  key: "explore" | "wishlists" | "trips" | "messages" | "profile";
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

const ITEMS: Item[] = [
  {
    key: "explore",
    label: "Explore",
    icon: <Search className="h-5 w-5" strokeWidth={2.2} />,
    active: true,
  },
  {
    key: "wishlists",
    label: "Wishlists",
    icon: <Heart className="h-5 w-5" strokeWidth={2.2} />,
  },
  {
    key: "trips",
    label: "Trips",
    icon: <Plane className="h-5 w-5" strokeWidth={2.2} />,
  },
  {
    key: "messages",
    label: "Messages",
    icon: <MessageCircle className="h-5 w-5" strokeWidth={2.2} />,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <User className="h-5 w-5" strokeWidth={2.2} />,
  },
];

export function BottomNav() {
  return (
    <nav className="flex shrink-0 items-center justify-around border-t border-neutral-200 bg-white px-2 pb-3 pt-2">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          disabled
          className={`flex flex-col items-center gap-1 px-2 ${
            item.active ? "text-[#FF385C]" : "text-neutral-400"
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-semibold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
