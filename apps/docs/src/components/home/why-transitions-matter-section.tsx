"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Sparkles, TrendingUp, MousePointer } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface WhyTransitionsMatterSectionProps {
  lang: string;
}

const reasons = [
  {
    icon: Eye,
    title: "Visual Context",
    description: "Provide visual cues about navigation and user location",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "Brand Value",
    description: "Elevate your brand from 'just a website' to premium experience",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "User Engagement",
    description: "Keep users engaged and reduce perceived loading time",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: MousePointer,
    title: "Native Feel",
    description: "Bridge the gap between web and native apps",
    gradient: "from-orange-500 to-yellow-500",
  },
];

export function WhyTransitionsMatterSection({ lang }: WhyTransitionsMatterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(".why-matter-title", {
        scrollTrigger: {
          trigger: ".why-matter-title",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Quote animation
      if (quoteRef.current) {
        gsap.from(quoteRef.current, {
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          scale: 0.9,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      }

      // Cards stagger animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power2.out",
        });

        // Icon rotation on hover
        card.addEventListener("mouseenter", () => {
          gsap.to(card.querySelector(".reason-icon"), {
            rotation: 360,
            duration: 0.8,
            ease: "power2.inOut",
          });
        });
      });

      // Background parallax
      gsap.to(".parallax-quote-bg", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
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
        <div className="parallax-quote-bg absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-vivid-purple/5 to-vivid-orange/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="why-matter-title text-center mb-16">
          <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl mb-4">
            <span className="text-white">Transitions are not just</span>{" "}
            <span className="gradient-purple">Pretty Effects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            They're essential for creating intuitive, engaging web experiences
          </p>
        </div>

        {/* Main Quote */}
        <div ref={quoteRef} className="mb-16 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-12 text-center">
          <blockquote className="text-2xl font-medium text-white mb-4">
            "Motion provides <span className="gradient-orange">meaning</span>. 
            It transforms a simple page change into a 
            <span className="gradient-green"> journey</span> that users understand."
          </blockquote>
          <p className="text-gray-400">— The Psychology of Web Motion</p>
        </div>

        {/* Reason Cards - 2 column grid with fixed height */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              ref={(el) => {el && (cardsRef.current[index] = el)}}
              className="group relative h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${reason.gradient} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`} />
              <div className="relative h-full min-h-[200px] rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-8 hover:border-gray-600 transition-colors flex flex-col">
                <div className={`reason-icon inline-flex p-3 rounded-lg bg-gradient-to-r ${reason.gradient} mb-4 w-fit`}>
                  <reason.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{reason.title}</h3>
                <p className="text-base text-gray-400 flex-1">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Simplified comparison */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-8">
              <h3 className="text-xl font-bold text-white mb-4">Traditional Web</h3>
              <p className="text-base text-gray-400">
                Jarring page changes that break user flow and feel disconnected
              </p>
            </div>
            
            <div className="rounded-xl border border-vivid-purple/30 bg-gradient-to-br from-vivid-purple/10 to-vivid-orange/10 p-8">
              <h3 className="text-xl font-bold text-white mb-4">With SSGOI</h3>
              <p className="text-base text-gray-300">
                Smooth, contextual navigation that feels natural and keeps users engaged
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}