"use client";

import { useEffect } from "react";
import { usePin, type InboxUpdate } from "@/demo/pinterest/state/pin";
import { InboxHeader } from "./inbox-header";
import { UpdateList } from "./update-list";

export default function InboxPage({ updates }: { updates: InboxUpdate[] }) {
  const pin = usePin((state) => ({ actions: state.actions }));
  // Opening the inbox clears the red dot on the home header.
  useEffect(() => {
    pin.actions.readUpdates();
  }, [pin.actions]);
  return (
    <div className="flex min-h-full flex-col bg-white">
      <InboxHeader />
      <UpdateList updates={updates} />
    </div>
  );
}
