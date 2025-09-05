/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Layers, Cpu, Rocket, Globe, Code2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "@/i18n/use-translations";

gsap.registerPlugin(ScrollTrigger);

interface FeaturesTimelineSectionProps {
  lang: string;
}

export function FeaturesTimelineSection({
  lang,
}: FeaturesTimelineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const t = useTranslations("home");

  const features = [
    {
      icon: Rocket,
      title: t("featuresTimeline.features.oneLineSetup.title"),
      description: t("featuresTimeline.features.oneLineSetup.description"),
      color: "from-orange-500 to-yellow-500",
      code: `<Ssgoi config={{ defaultTransition: fade() }}>
  <App />
</Ssgoi>`,
    },
    {
      icon: Layers,
      title: t("featuresTimeline.features.frameworkAgnostic.title"),
      description: t("featuresTimeline.features.frameworkAgnostic.description"),
      color: "from-blue-500 to-cyan-500",
      frameworks: [
        { name: "react", available: true },
        { name: "svelte", available: true },
        { name: "vue", available: true },
        { name: "solidjs", available: false },
        { name: "qwik", available: false },
      ],
      code: `// Same API across all frameworks
import { Ssgoi } from '@ssgoi/react'
import { Ssgoi } from '@ssgoi/svelte'
import { Ssgoi } from '@ssgoi/vue'`,
    },
    {
      icon: Sparkles,
      title: t("featuresTimeline.features.sharedElements.title"),
      description: t("featuresTimeline.features.sharedElements.description"),
      color: "from-purple-500 to-pink-500",
      code: `config: {
  transitions: [
    {
      from: '/gallery',
      to: '/gallery/*',
      transition: hero(),
      symmetric: true
    }
  ]
}`,
    },
    {
      icon: Globe,
      title: t("featuresTimeline.features.ssrReady.title"),
      description: t("featuresTimeline.features.ssrReady.description"),
      color: "from-green-500 to-emerald-500",
      code: `// Works out of the box with:
// ✓ Next.js App Router
// ✓ SvelteKit
// ✓ Nuxt 3`,
    },
    {
      icon: Cpu,
      title: t("featuresTimeline.features.springPhysics.title"),
      description: t("featuresTimeline.features.springPhysics.description"),
      color: "from-red-500 to-pink-500",
      code: `spring: { 
  stiffness: 300,  // Responsiveness
  damping: 30      // Smoothness
}`,
    },
    {
      icon: Code2,
      title: t("featuresTimeline.features.typescriptFirst.title"),
      description: t("featuresTimeline.features.typescriptFirst.description"),
      color: "from-indigo-500 to-purple-500",
      code: `// Full type safety and autocomplete
config: SsgoiConfig = {
  defaultTransition: fade(),
  transitions: [...]
}`,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline progress line
      gsap.fromTo(
        ".timeline-progress",
        { height: "0%" },
        {
          height: "100%",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          },
        },
      );

      // Feature items animation
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const isLeft = index % 2 === 0;

        // Initial animation
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          x: isLeft ? -100 : 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });

        // Dot animation
        gsap.from(item.querySelector(".timeline-dot"), {
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          scale: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.3,
        });

        // Code block animation
        gsap.from(item.querySelector(".code-block"), {
          scrollTrigger: {
            trigger: item,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.5,
        });
      });

      // Floating elements parallax
      gsap.to(".float-element-feat-1", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
        y: -200,
        rotation: 360,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="float-element-feat-1 absolute left-10 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-vivid-purple/5 to-vivid-orange/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl mb-4">
            <span className="text-white">
              {t("featuresTimeline.title.line1")}
            </span>{" "}
            <span className="gradient-green">
              {t("featuresTimeline.title.line2")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("featuresTimeline.subtitle")}
          </p>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-700 -translate-x-1/2">
            <div className="timeline-progress absolute top-0 left-0 right-0 bg-gradient-to-b from-vivid-purple to-vivid-orange" />
          </div>

          {/* Feature items */}
          <div className="space-y-24">
            {features.map((feature, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={index}
                  ref={(el) => {
                    el && (itemsRef.current[index] = el);
                  }}
                  className={`relative flex items-center ${
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="timeline-dot absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-vivid-purple to-vivid-orange shadow-lg shadow-vivid-purple/50" />

                  {/* Content */}
                  <div
                    className={`w-full lg:w-1/2 ${isLeft ? "lg:pr-16" : "lg:pl-16"}`}
                  >
                    <div className="relative group">
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
                      />
                      <div className="relative rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-8">
                        <div
                          className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}
                        >
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {feature.description}
                        </p>

                        {/* Framework logos if applicable */}
                        {feature.frameworks && (
                          <div className="flex gap-4 mb-6">
                            {feature.frameworks.map((framework: any) => (
                              <div
                                key={framework.name}
                                className={`relative w-10 h-10 rounded-lg bg-gray-900 border ${framework.available ? "border-gray-700" : "border-gray-800"} flex items-center justify-center`}
                              >
                                <Image
                                  src={`/icons/${framework.name}.svg`}
                                  alt={framework.name}
                                  width={24}
                                  height={24}
                                  className={
                                    framework.available
                                      ? "opacity-80"
                                      : "opacity-30"
                                  }
                                />
                                {!framework.available && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[8px] text-gray-500 font-medium bg-gray-900 px-1 rounded">
                                      soon
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Code example */}
                        <div className="code-block">
                          <div className="rounded-lg bg-gray-900 border border-gray-700 p-4">
                            <pre className="text-sm text-gray-300 overflow-x-auto">
                              <code>{feature.code}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
