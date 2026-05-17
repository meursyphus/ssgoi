import { MessageCircle, Phone } from "lucide-react";

const ACTIONS = [
  { key: "chat", label: "1:1 채팅", Icon: MessageCircle },
  { key: "call", label: "통화", Icon: Phone },
] as const;

export function ProfileActions() {
  return (
    <div className="px-4 pb-5 pt-2">
      <div className="flex items-stretch overflow-hidden rounded-2xl bg-white/15 backdrop-blur">
        {ACTIONS.map(({ key, label, Icon }, i) => (
          <div key={key} className="flex flex-1 items-center">
            {i > 0 && <div className="h-6 w-px bg-white/20" />}
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 py-3 text-white active:bg-white/10"
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="text-[14px] font-medium">{label}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
