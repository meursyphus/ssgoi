"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import type { NotificationItem } from "@/demo/google-photos/api/notification";
import { useNotification } from "@/demo/google-photos/state/notification";
import { BASE } from "@/demo/google-photos/page/shared/paths";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { NotificationRow } from "./notification-row";

function Group({ title, items }: { title: string; items: NotificationItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="pt-2">
      <h2 className="px-4 pb-2 pt-3 text-[13px] font-medium text-neutral-500">
        {title}
      </h2>
      <div className="divide-y divide-neutral-100">
        {items.map((item) => (
          <NotificationRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function NotificationsPage({
  items,
}: {
  items: NotificationItem[];
}) {
  const notification = useNotification((state) => ({
    actions: state.actions,
  }));
  // Opening the list clears the bell's dot for the rest of the visit.
  useEffect(() => {
    notification.actions.markAllRead();
  }, [notification.actions]);

  return (
    <div className="block min-h-full bg-white pb-10">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-2 bg-white px-2">
        <DemoBackLink
          fallback={BASE}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 active:bg-black/[0.05]"
        >
          <ArrowLeft className="h-5 w-5" />
        </DemoBackLink>
        <h1 className="text-[18px] font-medium text-neutral-900">
          Notifications
        </h1>
      </header>
      <Group title="New" items={items.filter((n) => n.unread)} />
      <Group title="Earlier" items={items.filter((n) => !n.unread)} />
    </div>
  );
}
