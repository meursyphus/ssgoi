"use client";

import { Zap, Globe, Layers, Smartphone } from "lucide-react";
import { messages } from "@/messages";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: messages.home.newHome.features.zeroConfig.title,
      description: messages.home.newHome.features.zeroConfig.description,
    },
    {
      icon: Globe,
      title: messages.home.newHome.features.allBrowsers.title,
      description: messages.home.newHome.features.allBrowsers.description,
    },
    {
      icon: Layers,
      title: messages.home.newHome.features.ssrSupport.title,
      description: messages.home.newHome.features.ssrSupport.description,
    },
    {
      icon: Smartphone,
      title: messages.home.newHome.features.smoothPerformance.title,
      description: messages.home.newHome.features.smoothPerformance.description,
    },
  ];

  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-3">
            {messages.home.newHome.features.sectionLabel}
          </p>
          <h2 className="text-xl font-light tracking-tight">
            {messages.home.newHome.features.title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {features.map((feature, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
