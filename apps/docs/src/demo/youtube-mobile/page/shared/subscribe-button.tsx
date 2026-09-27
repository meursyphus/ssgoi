"use client";

import { Bell, ChevronDown } from "lucide-react";
import { useRememberedState } from "./remembered-state";

/**
 * Subscribe ↔ Subscribed toggle (in-page state, no route). Remembered per
 * channel, so the watch page and the channel page agree.
 */
export function SubscribeButton({
  channelId,
  tone = "light",
  className = "",
}: {
  channelId: string;
  tone?: "light" | "overlay";
  className?: string;
}) {
  const [subscribed, setSubscribed] = useRememberedState(
    `subscribed:${channelId}`,
    false,
  );
  const toggle = () => setSubscribed(!subscribed);

  if (tone === "overlay") {
    return (
      <button
        type="button"
        aria-pressed={subscribed}
        onClick={toggle}
        className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors duration-150 active:scale-95 ${
          subscribed ? "bg-white/20 text-white" : "bg-white text-neutral-950"
        } ${className}`}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={subscribed}
      onClick={toggle}
      className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-colors duration-150 active:scale-95 ${
        subscribed
          ? "bg-neutral-100 text-neutral-950"
          : "bg-neutral-950 text-white"
      } ${className}`}
    >
      {subscribed && <Bell className="h-4 w-4" />}
      {subscribed ? "Subscribed" : "Subscribe"}
      {subscribed && <ChevronDown className="h-4 w-4" />}
    </button>
  );
}
