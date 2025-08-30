"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download, Star, Users, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface StatsSectionProps {
  lang: string;
}

const stats = [
  {
    icon: Download,
    value: 50000,
    suffix: "+",
    label: "Downloads",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Star,
    value: 2500,
    suffix: "+",
    label: "GitHub Stars",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    value: 100,
    suffix: "+",
    label: "Contributors",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    value: 60,
    suffix: " FPS",
    label: "Performance",
    color: "from-purple-500 to-pink-500",
  },
];

export function StatsSection({ lang }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stats when they come into view
      statsRef.current.forEach((stat, index) => {
        if (!stat) return;

        // Card animation
        gsap.from(stat, {
          scrollTrigger: {
            trigger: stat,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
        });

        // Counter animation
        const counter = stat.querySelector(".stat-counter");
        if (counter) {
          const target = stats[index].value;
          
          const obj = { value: 0 };
          gsap.to(obj, {
            value: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stat,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
            onUpdate: () => {
              counter.textContent = Math.floor(obj.value).toLocaleString();
            }
          });
        }

        // Icon pulse animation
        gsap.to(stat.querySelector(".stat-icon"), {
          scale: 1.1,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      });

      // Background gradient animation
      gsap.to(".stats-gradient", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        backgroundPosition: "100% 100%",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div 
        className="stats-gradient absolute inset-0 -z-10 bg-gradient-to-br from-vivid-purple/10 via-transparent to-vivid-orange/10 bg-[size:200%_200%] bg-[position:0%_0%]" 
      />

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl mb-4">
            <span className="text-white">Trusted by Developers</span>{" "}
            <span className="gradient-purple">Worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of developers building better web experiences
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => {el && (statsRef.current[index] = el)}}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative rounded-2xl border border-gray-700 bg-gray-800/80 backdrop-blur-sm p-8 text-center hover:border-gray-600 transition-colors">
                <div className={`stat-icon inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  <span className="stat-counter">0</span>
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}