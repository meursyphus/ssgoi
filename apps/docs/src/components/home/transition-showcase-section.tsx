"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ViewTransitionDemo from "@/components/mdx/mdx-components/view-transition-demo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface TransitionShowcaseSectionProps {
  lang: string;
}

const transitions = [
  {
    type: "fade",
    title: "Fade Transition",
    description: "Smooth opacity transition perfect for context changes and top-level navigation",
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    accentColor: "text-purple-400",
  },
  {
    type: "hero",
    title: "Hero Transition",
    description: "Shared element animation that creates seamless transitions for detail views",
    gradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    accentColor: "text-green-400",
  },
  {
    type: "scroll",
    title: "Scroll Transition",
    description: "Vertical scrolling effect ideal for sequential content and storytelling",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-400",
  },
];

export function TransitionShowcaseSection({ lang }: TransitionShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(".showcase-title", {
        scrollTrigger: {
          trigger: ".showcase-title",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Cards stagger animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power2.out",
        });

        // Demo animation on scroll
        const demo = card.querySelector(".demo-container");
        if (demo) {
          gsap.from(demo, {
            scrollTrigger: {
              trigger: demo,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
            scale: 0.95,
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: "power2.out",
          });
        }
      });

      // Parallax background elements
      gsap.to(".parallax-showcase-1", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -150,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="parallax-showcase-1 absolute left-1/4 top-0 h-96 w-96 rounded-full bg-gradient-to-r from-vivid-purple/10 to-vivid-orange/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="showcase-title text-center mb-16">
          <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl mb-4">
            <span className="gradient-purple">Experience</span>{" "}
            <span className="text-white">Every Transition</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Preview our most popular transitions. Each one is optimized for performance and works across all browsers.
          </p>
        </div>

        {/* Single column layout with max width */}
        <div className="max-w-5xl mx-auto space-y-20">
          {transitions.map((transition, index) => (
            <div
              key={transition.type}
              ref={(el) => {el && (cardsRef.current[index] = el)}}
              className={`group relative overflow-hidden rounded-3xl border ${transition.borderColor} bg-card/50 backdrop-blur-sm`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${transition.gradient} opacity-30`} />
              
              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{transition.title}</h3>
                      <p className="text-base sm:text-lg text-muted-foreground">{transition.description}</p>
                    </div>
                    {/* View documentation link - desktop */}
                    <Link 
                      href={`/${lang}/docs/view-transitions/${transition.type === "hero" ? "03-hero" : transition.type === "scroll" ? "02-scroll" : "01-fade"}`}
                      className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 bg-gray-800/50 transition-all hover:bg-gray-800/70 whitespace-nowrap`}
                    >
                      <span className={`text-base font-medium ${transition.accentColor}`}>View docs</span>
                      <ArrowRight className={`h-4 w-4 ${transition.accentColor}`} />
                    </Link>
                  </div>
                </div>
                
                {/* Large Browser mockup with demo */}
                <div className="px-4 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
                  <div className="demo-container relative rounded-xl shadow-2xl">
                    {/* ViewTransitionDemo handles its own aspect ratio and overflow */}
                    <ViewTransitionDemo type={transition.type as any} />
                  </div>
                </div>

                {/* Mobile view documentation link */}
                <div className="px-6 pb-6 sm:hidden">
                  <Link 
                    href={`/${lang}/docs/view-transitions/${transition.type === "hero" ? "03-hero" : transition.type === "scroll" ? "02-scroll" : "01-fade"}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-vivid-purple to-vivid-orange text-white font-medium"
                  >
                    <span>View documentation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Transitions Button */}
        <div className="mt-16 text-center">
          <Link 
            href={`/${lang}/docs/view-transitions/01-fade`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-vivid-purple to-vivid-orange text-white text-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
          >
            <span>Explore All Transitions</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}