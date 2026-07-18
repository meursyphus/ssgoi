import { Home, Newspaper, MapPin, MessageCircle, User } from "lucide-react";

type Item = {
  key: "home" | "life" | "near" | "chat" | "my";
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

const ITEMS: Item[] = [
  {
    key: "home",
    label: "홈",
    icon: <Home className="h-5 w-5" strokeWidth={2.2} />,
    active: true,
  },
  {
    key: "life",
    label: "동네생활",
    icon: <Newspaper className="h-5 w-5" strokeWidth={2.2} />,
  },
  {
    key: "near",
    label: "내근처",
    icon: <MapPin className="h-5 w-5" strokeWidth={2.2} />,
  },
  {
    key: "chat",
    label: "채팅",
    icon: <MessageCircle className="h-5 w-5" strokeWidth={2.2} />,
  },
  {
    key: "my",
    label: "나의당근",
    icon: <User className="h-5 w-5" strokeWidth={2.2} />,
  },
];

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 flex shrink-0 items-center justify-around border-t border-gray-200 bg-white px-2 pb-3 pt-2">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          disabled
          className={`flex flex-col items-center gap-1 px-2 ${
            item.active ? "text-[#2db400]" : "text-gray-400"
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-semibold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
