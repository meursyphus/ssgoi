"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X, Zap, Globe, Router, Palette } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ComparisonSectionProps {
  lang: string;
}

const comparisonData = [
  {
    feature: "Browser Support",
    browserAPI: { support: false, text: "Chrome only" },
    otherLibs: { support: false, text: "Varies" },
    ssgoi: { support: true, text: "All modern browsers" },
    icon: Globe,
  },
  {
    feature: "Framework Support",
    browserAPI: { support: true, text: "Any" },
    otherLibs: { support: false, text: "Framework specific" },
    ssgoi: { support: true, text: "React, Svelte, Vue, Solid" },
    icon: Zap,
  },
  {
    feature: "SSR/SSG Support",
    browserAPI: { support: true, text: "Basic support" },
    otherLibs: { support: false, text: "Often broken" },
    ssgoi: { support: true, text: "Full support" },
    icon: Zap,
  },
  {
    feature: "Routing System",
    browserAPI: { support: true, text: "Any router" },
    otherLibs: { support: false, text: "Custom router required" },
    ssgoi: { support: true, text: "Keep your router" },
    icon: Router,
  },
  {
    feature: "Physics Animations",
    browserAPI: { support: false, text: "CSS only" },
    otherLibs: { support: false, text: "Limited" },
    ssgoi: { support: true, text: "Spring physics" },
    icon: Palette,
  },
  {
    feature: "Customization",
    browserAPI: { support: false, text: "CSS only" },
    otherLibs: { support: false, text: "Preset only" },
    ssgoi: { support: true, text: "Fully customizable" },
    icon: Palette,
  },
];

export function ComparisonSection({ lang }: ComparisonSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
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

      // Desktop table header animation
      gsap.from(".table-header", {
        scrollTrigger: {
          trigger: ".comparison-table",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // Desktop table rows animation
      const desktopRows = gsap.utils.toArray<HTMLElement>(".comparison-table .grid-cols-4");
      desktopRows.forEach((row, index) => {
        // Skip header row
        if (row.classList.contains("table-header")) return;
        
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

        // Animate check/X icons separately
        const icons = row.querySelectorAll(".lucide");
        icons.forEach((icon, i) => {
          gsap.from(icon, {
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            scale: 0,
            rotation: 180,
            duration: 0.5,
            delay: index * 0.1 + 0.3 + (i * 0.1),
            ease: "back.out(2)",
          });
        });
      });

      // Mobile cards animation
      rowsRef.current.forEach((row, index) => {
        if (!row) return;
        
        // Only animate mobile cards (not desktop rows)
        if (row.classList.contains("grid-cols-4")) return;
        
        // Mobile card animation - scale up with bounce
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.7,
          delay: index * 0.15,
          ease: "back.out(1.7)",
        });

        // Animate inner elements of mobile cards
        const icon = row.querySelector(".lucide");
        const comparisons = row.querySelectorAll(".space-y-3 > div");
        
        if (icon) {
          gsap.from(icon, {
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            rotate: 360,
            scale: 0,
            duration: 0.6,
            delay: index * 0.15 + 0.2,
            ease: "back.out(2)",
          });
        }

        // Stagger the comparison items within each card
        comparisons.forEach((comp, i) => {
          gsap.from(comp, {
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            x: i % 2 === 0 ? -30 : 30,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.15 + 0.3 + (i * 0.1),
            ease: "power2.out",
          });
        });
      });

      // Floating elements
      gsap.to(".float-element-comp-1", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -50,
        rotation: 5,
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
            The only transition library that works with your existing code
          </p>
        </div>

        {/* Comparison Table - Desktop */}
        <div className="comparison-table mb-16 hidden lg:block overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="table-header grid grid-cols-4 border-b border-gray-700 bg-gray-800/80">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-400">Feature</h3>
            </div>
            <div className="p-6 text-center border-x border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300">Browser API</h3>
              <p className="text-sm text-gray-500 mt-1">View Transitions</p>
            </div>
            <div className="p-6 text-center border-r border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300">Other Libraries</h3>
              <p className="text-sm text-gray-500 mt-1">Framer, Auto-Animate, etc</p>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold gradient-green">SSGOI</h3>
              <p className="text-sm text-gray-400 mt-1">Universal solution</p>
            </div>
          </div>

          {comparisonData.map((item, index) => (
            <div
              key={item.feature}
              ref={(el) => {el && (rowsRef.current[index] = el)}}
              className="grid grid-cols-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-800/50 transition-colors"
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
                  <span className="text-gray-400 text-sm">{item.browserAPI.text}</span>
                </div>
              </div>
              <div className="p-6 text-center border-r border-gray-700">
                <div className="flex items-center justify-center gap-2">
                  {item.otherLibs.support ? (
                    <Check className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-gray-400 text-sm">{item.otherLibs.text}</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  {item.ssgoi.support ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-gray-300 text-sm">{item.ssgoi.text}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison - Mobile/Tablet */}
        <div className="mb-16 lg:hidden space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Feature Comparison</h3>
            <p className="text-gray-400">Swipe to see how SSGOI stands out</p>
          </div>
          
          {/* Mobile comparison cards */}
          {comparisonData.map((item, index) => (
            <div
              key={item.feature}
              ref={(el) => {el && (rowsRef.current[index] = el)}}
              className="rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 transition-all hover:bg-gray-800/70 hover:border-gray-600 hover:shadow-lg"
            >
              {/* Feature Title */}
              <div className="flex items-center gap-3 mb-6">
                <item.icon className="h-6 w-6 text-gray-400" />
                <h4 className="text-lg font-bold text-white">{item.feature}</h4>
              </div>
              
              {/* Comparison Grid */}
              <div className="space-y-3">
                {/* Browser API */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                  <span className="text-sm font-medium text-gray-400">Browser API</span>
                  <div className="flex items-center gap-2">
                    {item.browserAPI.support ? (
                      <Check className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-500">{item.browserAPI.text}</span>
                  </div>
                </div>
                
                {/* Other Libraries */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
                  <span className="text-sm font-medium text-gray-400">Other Libs</span>
                  <div className="flex items-center gap-2">
                    {item.otherLibs.support ? (
                      <Check className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-500">{item.otherLibs.text}</span>
                  </div>
                </div>
                
                {/* SSGOI - Highlighted */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-vivid-purple/10 to-vivid-orange/10 border border-vivid-purple/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-vivid-purple/5 to-vivid-orange/5 animate-pulse" />
                  <span className="relative z-10 text-sm font-bold gradient-green">SSGOI</span>
                  <div className="relative z-10 flex items-center gap-2">
                    {item.ssgoi.support ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-300 font-medium">{item.ssgoi.text}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key advantages */}
        <div className="float-element-comp-1 grid gap-4 md:grid-cols-3 mt-12">
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="font-bold text-white mb-2">🚀 Keep Your Stack</h3>
            <p className="text-base text-gray-400">
              No need to change your router or framework. Works with Next.js, SvelteKit, Nuxt, and more.
            </p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="font-bold text-white mb-2">🎨 True Customization</h3>
            <p className="text-base text-gray-400">
              Spring-based physics animations with full control over timing, easing, and behavior.
            </p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
            <h3 className="font-bold text-white mb-2">🌍 Universal Support</h3>
            <p className="text-base text-gray-400">
              Works in all browsers, all frameworks, with SSR/SSG. One library for everything.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}