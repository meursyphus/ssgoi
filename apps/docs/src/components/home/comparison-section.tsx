"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X, Zap, Globe, Package, Gauge } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ComparisonSectionProps {
  lang: string;
}

const comparisonData = [
  {
    feature: "Browser Support",
    browserAPI: { support: false, text: "Chrome only" },
    ssgoi: { support: true, text: "All modern browsers" },
    icon: Globe,
  },
  {
    feature: "Bundle Size",
    browserAPI: { support: true, text: "Native (0KB)" },
    ssgoi: { support: true, text: "< 20KB gzipped" },
    icon: Package,
  },
  {
    feature: "SSR Support",
    browserAPI: { support: false, text: "Limited" },
    ssgoi: { support: true, text: "Full support" },
    icon: Zap,
  },
  {
    feature: "Performance",
    browserAPI: { support: true, text: "Native speed" },
    ssgoi: { support: true, text: "60 FPS optimized" },
    icon: Gauge,
  },
  {
    feature: "Custom Transitions",
    browserAPI: { support: false, text: "CSS only" },
    ssgoi: { support: true, text: "Fully customizable" },
    icon: Zap,
  },
  {
    feature: "State Persistence",
    browserAPI: { support: false, text: "Manual handling" },
    ssgoi: { support: true, text: "Automatic" },
    icon: Zap,
  },
];

export function ComparisonSection({ lang }: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeDemo, setActiveDemo] = useState<"browser" | "ssgoi" | null>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(".comparison-title", {
        scrollTrigger: {
          trigger: ".comparison-title",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Table rows animation
      rowsRef.current.forEach((row, index) => {
        if (!row) return;

        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          x: index % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out",
        });
      });

      // Demo browsers animation
      gsap.from(".demo-browser-left", {
        scrollTrigger: {
          trigger: ".demo-browsers",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".demo-browser-right", {
        scrollTrigger: {
          trigger: ".demo-browsers",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Floating badges
      gsap.to(".float-badge-1", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -50,
        rotation: 5,
      });

      gsap.to(".float-badge-2", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -30,
        rotation: -5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="comparison-title text-center mb-16">
          <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl mb-4">
            <span className="text-white">Why Choose</span>{" "}
            <span className="gradient-orange">SSGOI?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how SSGOI compares to the native browser View Transitions API
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="grid grid-cols-3 border-b border-gray-700 bg-gray-800/80">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-400">Feature</h3>
            </div>
            <div className="p-6 text-center border-x border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300">Browser API</h3>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold gradient-green">SSGOI</h3>
            </div>
          </div>

          {comparisonData.map((item, index) => (
            <div
              key={item.feature}
              ref={(el) => (rowsRef.current[index] = el)}
              className="grid grid-cols-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-800/50 transition-colors"
            >
              <div className="p-6 flex items-center gap-3">
                <item.icon className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-white">{item.feature}</span>
              </div>
              <div className="p-6 text-center border-x border-gray-700">
                <div className="flex items-center justify-center gap-2">
                  {item.browserAPI.support ? (
                    <Check className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-gray-400">{item.browserAPI.text}</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  {item.ssgoi.support ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-gray-300">{item.ssgoi.text}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Demo Comparison */}
        <div className="demo-browsers">
          <h3 className="text-2xl font-bold text-center text-white mb-8">
            See the Difference in Action
          </h3>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Browser API Demo */}
            <div className="demo-browser-left relative">
              <div className="float-badge-1 absolute -top-4 -right-4 z-10 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                Chrome Only
              </div>
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-gray-700 rounded px-3 py-0.5 text-xs text-gray-400">
                      Browser View Transitions API
                    </div>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 text-yellow-500">
                      <X className="h-8 w-8" />
                      <span className="text-lg">Not supported in Firefox/Safari</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDemo("browser")}
                    className="px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    Try Demo (Chrome Only)
                  </button>
                </div>
              </div>
            </div>

            {/* SSGOI Demo */}
            <div className="demo-browser-right relative">
              <div className="float-badge-2 absolute -top-4 -right-4 z-10 rounded-lg bg-green-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
                All Browsers
              </div>
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-gray-700 rounded px-3 py-0.5 text-xs text-gray-400">
                      SSGOI Transitions
                    </div>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 text-green-500">
                      <Check className="h-8 w-8" />
                      <span className="text-lg">Works everywhere</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveDemo("ssgoi")}
                    className="px-6 py-3 bg-gradient-to-r from-vivid-orange to-vivid-purple rounded-lg text-white hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Try Demo (All Browsers)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}