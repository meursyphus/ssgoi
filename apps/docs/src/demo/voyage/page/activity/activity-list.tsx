"use client";

import type { ActivitySection } from "@/demo/voyage/state/story";
import { ActivityRow } from "./activity-row";

export function ActivityList({ sections }: { sections: ActivitySection[] }) {
  return (
    <div className="flex-1 pb-8">
      {sections.map((section) => (
        <section key={section.title} aria-label={section.title}>
          <h2 className="px-5 pt-5 pb-1 text-[15px] font-bold tracking-tight text-neutral-900">
            {section.title}
          </h2>
          <ul>
            {section.items.map((item) => (
              <li key={item.id}>
                <ActivityRow item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
