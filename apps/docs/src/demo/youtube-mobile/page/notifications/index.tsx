"use client";

import { ArrowLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { BASE, notificationSections } from "../../mock-data";
import { NotificationRow } from "./notification-row";

/** /notifications: pushed like the channel page (shared drill scope). */
export default function NotificationsPage() {
  return (
    <main className="min-h-full grow bg-white pb-6 text-neutral-950">
      <header className="sticky top-0 z-20 flex h-12 items-center gap-1 bg-white px-1">
        <DemoBackLink
          fallback={BASE}
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-neutral-100"
        >
          <ArrowLeft className="h-6 w-6" />
        </DemoBackLink>
        <h1 className="text-[20px] font-bold">Notifications</h1>
      </header>

      {notificationSections.map((section) => (
        <section key={section.title} className="pt-2">
          <h2 className="px-4 pb-1 pt-2 text-[15px] font-semibold">
            {section.title}
          </h2>
          {section.items.map((item) => (
            <NotificationRow key={item.id} item={item} />
          ))}
        </section>
      ))}
    </main>
  );
}
