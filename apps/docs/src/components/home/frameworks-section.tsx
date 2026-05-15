"use client";

import {
  SiReact,
  SiSvelte,
  SiVuedotjs,
  SiAngular,
  SiSolid,
  SiQwik,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { messages } from "@/messages";

type FrameworkStatus = "available" | "soon";

const frameworks: {
  name: string;
  status: FrameworkStatus;
  Icon: IconType;
  color: string;
}[] = [
  { name: "React", status: "available", Icon: SiReact, color: "#61DAFB" },
  { name: "Svelte", status: "available", Icon: SiSvelte, color: "#FF3E00" },
  { name: "Vue", status: "available", Icon: SiVuedotjs, color: "#42B883" },
  { name: "Angular", status: "available", Icon: SiAngular, color: "#DD0031" },
  { name: "SolidJS", status: "available", Icon: SiSolid, color: "#2C4F7C" },
  { name: "Qwik", status: "soon", Icon: SiQwik, color: "#AC7EF4" },
];

export function FrameworksSection() {
  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-3">
            {messages.home.newHome.frameworks.sectionLabel}
          </p>
          <h2 className="text-xl font-light tracking-tight mb-2">
            {messages.home.newHome.frameworks.title}
          </h2>
          <p className="text-xs text-neutral-400">
            {messages.home.newHome.frameworks.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {frameworks.map(({ name, status, Icon, color }) => {
            const available = status === "available";
            return (
              <div
                key={name}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded border text-xs transition-colors ${
                  available
                    ? "bg-white/[0.02] border-white/10 text-neutral-200 hover:border-white/20"
                    : "border-white/5 text-neutral-500"
                }`}
              >
                <Icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: available ? color : undefined }}
                  aria-hidden
                />
                <span>{name}</span>
                {!available && (
                  <span className="text-[10px] text-neutral-500">
                    {messages.home.newHome.frameworks.soon}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
