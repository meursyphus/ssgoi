"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ViewTransitionDemo from "@/components/mdx/mdx-components/view-transition-demo";

gsap.registerPlugin(ScrollTrigger);

interface TransitionShowcaseSectionProps {
  lang: string;
}

const transitions = [
  {
    type: "fade",
    title: "Fade",
    description: "Smooth opacity transition",
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    type: "scroll",
    title: "Scroll",
    description: "Vertical scrolling effect",
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    type: "hero",
    title: "Hero",
    description: "Shared element animation",
    gradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
  },
  {
    type: "pinterest",
    title: "Pinterest",
    description: "Pinterest-style expansion",
    gradient: "from-orange-500/20 to-yellow-500/20",
    borderColor: "border-orange-500/30",
  },
  {
    type: "drill",
    title: "Drill",
    description: "Drill in/out effect",
    gradient: "from-red-500/20 to-pink-500/20",
    borderColor: "border-red-500/30",
  },
  {
    type: "slide",
    title: "Slide",
    description: "Horizontal sliding",
    gradient: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
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
          delay: index * 0.1,
          ease: "power2.out",
        });

        // Hover effect
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Parallax background elements
      gsap.to(".parallax-bg-1", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -150,
      });

      gsap.to(".parallax-bg-2", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -100,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="parallax-bg-1 absolute left-1/4 top-0 h-96 w-96 rounded-full bg-gradient-to-r from-vivid-purple/10 to-vivid-orange/10 blur-3xl" />
        <div className="parallax-bg-2 absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-gradient-to-r from-vivid-green/10 to-vivid-blue/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="showcase-title text-center mb-16">
          <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl mb-4">
            <span className="gradient-purple">Experience</span>{" "}
            <span className="text-white">Every Transition</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Click on any card to see the transition in action. Each effect is optimized for performance and works across all browsers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transitions.map((transition, index) => (
            <div
              key={transition.type}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`group relative overflow-hidden rounded-2xl border ${transition.borderColor} bg-card/50 backdrop-blur-sm transition-all duration-300 cursor-pointer`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${transition.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
              
              {/* Content */}
              <div className="relative p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{transition.title}</h3>
                <p className="text-muted-foreground mb-4">{transition.description}</p>
                
                {/* Browser mockup with demo */}
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
                  {/* Browser header */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gray-700 rounded px-3 py-0.5 text-xs text-gray-400">
                        ssgoi.com/demo
                      </div>
                    </div>
                  </div>
                  
                  {/* Demo content */}
                  <div className="relative h-[calc(100%-32px)] overflow-hidden">
                    <div className="scale-[0.5] origin-top-left w-[200%] h-[200%]">
                      <ViewTransitionDemo type={transition.type} />
                    </div>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-white">
                    Click to explore →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}