"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Sparkles, TrendingUp, MousePointer, ArrowRight, Zap, Heart, Globe } from "lucide-react";

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
    color: "#0EA5E9",
    bgImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    icon: Sparkles,
    title: "Brand Value",
    description: "Elevate your brand from 'just a website' to premium experience",
    gradient: "from-purple-500 to-pink-500",
    color: "#A855F7",
    bgImage: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    icon: TrendingUp,
    title: "User Engagement",
    description: "Keep users engaged and reduce perceived loading time",
    gradient: "from-green-500 to-emerald-500",
    color: "#10B981",
    bgImage: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    icon: MousePointer,
    title: "Native Feel",
    description: "Bridge the gap between web and native apps",
    gradient: "from-orange-500 to-yellow-500",
    color: "#F97316",
    bgImage: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
];

const floatingIcons = [
  { icon: Zap, delay: 0 },
  { icon: Heart, delay: 0.5 },
  { icon: Globe, delay: 1 },
  { icon: ArrowRight, delay: 1.5 },
];

export function WhyTransitionsMatterSection({ lang }: WhyTransitionsMatterSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const textRevealRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Get all cards
      const cards = gsap.utils.toArray<HTMLElement>(".reason-card");
      if (cards.length === 0) return;

      // Create a timeline for the sticky section
      // Increase scroll distance to allow for pause time
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyRef.current,
          start: "top top",
          end: `+=${cards.length * 200}%`, // Doubled the scroll distance
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Animate cards sequentially with pause time
      cards.forEach((card, index) => {
        // Set initial state
        gsap.set(card, {
          position: "absolute",
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          rotateY: 90,
          z: -500,
          transformStyle: "preserve-3d",
        });

        // Create animation sequence for each card with pause
        // Timeline breakdown per card:
        // 15% - Card entrance animation
        // 60% - Card stays visible (pause/read time)
        // 15% - Card exit animation
        // 10% - Gap before next card
        const segmentDuration = 1 / cards.length;
        const startTime = index * segmentDuration;
        const pauseStart = startTime + segmentDuration * 0.15; // After entrance
        const pauseEnd = startTime + segmentDuration * 0.75;   // Long pause for reading
        const exitTime = startTime + segmentDuration * 0.75;   // Start exit after pause
        const exitEnd = startTime + segmentDuration * 0.9;     // Complete exit
        
        // Card entrance
        tl.to(
          card,
          {
            opacity: 1,
            rotateY: 0,
            z: 0,
            duration: segmentDuration * 0.15,
            ease: "power3.out",
          },
          startTime
        );

        // Card stays visible (no animation, just holds position)
        tl.to(
          card,
          {
            opacity: 1,
            duration: segmentDuration * 0.6, // Long pause duration
          },
          pauseStart
        );

        // Card exits (except last card)
        if (index < cards.length - 1) {
          tl.to(
            card,
            {
              opacity: 0,
              rotateY: -90,
              z: 500,
              duration: segmentDuration * 0.15,
              ease: "power3.in",
            },
            exitTime
          );
        }

        // Update indicators
        tl.call(() => {
          indicatorsRef.current.forEach((indicator, i) => {
            if (indicator) {
              if (i === index) {
                indicator.classList.add("bg-white", "scale-150");
                indicator.classList.remove("bg-gray-600", "scale-100");
              } else {
                indicator.classList.remove("bg-white", "scale-150");
                indicator.classList.add("bg-gray-600", "scale-100");
              }
            }
          });
        }, undefined, startTime);
      });

      // Progress bar
      gsap.to(".progress-bar", {
        scrollTrigger: {
          trigger: stickyRef.current,
          start: "top top",
          end: `+=${cards.length * 200}%`, // Match the timeline scroll distance
          scrub: true,
        },
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
      });

      // Floating icons parallax
      gsap.utils.toArray<HTMLElement>(".floating-icon").forEach((icon, index) => {
        gsap.to(icon, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
          y: -200 * (1 + index * 0.3),
          x: Math.sin(index) * 100,
          rotation: 360 * (index % 2 === 0 ? 1 : -1),
        });
      });

      // Text reveal with morph effect
      const chars = gsap.utils.toArray<HTMLElement>(".char");
      chars.forEach((char, index) => {
        gsap.from(char, {
          scrollTrigger: {
            trigger: textRevealRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
          opacity: 0,
          scale: 0,
          rotation: (index % 2 === 0 ? 180 : -180),
          y: (index % 2 === 0 ? 100 : -100),
          ease: "back.out(1.7)",
        });
      });

      // Comparison section with split screen effect
      const leftPanel = document.querySelector(".left-panel");
      const rightPanel = document.querySelector(".right-panel");

      if (leftPanel && rightPanel) {
        gsap.from(leftPanel, {
          scrollTrigger: {
            trigger: ".comparison-section",
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
          x: "-100%",
          rotation: -5,
          opacity: 0,
        });

        gsap.from(rightPanel, {
          scrollTrigger: {
            trigger: ".comparison-section",
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
          x: "100%",
          rotation: 5,
          opacity: 0,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Floating background icons */}
      <div className="absolute inset-0 -z-10">
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className="floating-icon absolute opacity-10"
            style={{
              left: `${20 + index * 20}%`,
              top: `${10 + index * 15}%`,
            }}
          >
            <item.icon className="h-24 w-24 text-gray-600" />
          </div>
        ))}
      </div>

      {/* Text reveal section with character animation */}
      <div ref={textRevealRef} className="px-4 py-24 text-center">
        <h2 className="text-5xl font-black sm:text-6xl lg:text-7xl mb-8">
          <span className="inline-block">
            {"Transitions are not just".split("").map((char, i) => (
              <span key={i} className="char inline-block text-white">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <br />
          <span className="inline-block mt-2">
            {"Pretty Effects".split("").map((char, i) => (
              <span key={i} className="char inline-block gradient-purple">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          They're essential for creating intuitive, engaging web experiences
        </p>
      </div>

      {/* Sticky scroll section with 3D cards */}
      <div ref={stickyRef} className="relative h-screen flex items-center justify-center">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 z-50">
          <div className="progress-bar h-full bg-gradient-to-r from-vivid-purple to-vivid-orange transform scale-x-0" />
        </div>

        {/* Card indicator dots */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4 z-40">
          {reasons.map((_, index) => (
            <div
              key={index}
              ref={(el) => { indicatorsRef.current[index] = el }}
              className="w-3 h-3 rounded-full transition-all duration-300 bg-gray-600 scale-100"
            />
          ))}
        </div>

        {/* 3D Cards Container */}
        <div
          ref={cardsContainerRef}
          className="relative w-full h-full max-w-6xl px-4 sm:px-6 lg:px-8"
          style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="reason-card w-full"
            >
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                {/* Left side - Visual */}
                <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl">
                  <div
                    className="absolute inset-0"
                    style={{ background: reason.bgImage }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 blur-3xl opacity-50">
                        <div
                          className="w-48 h-48 rounded-full"
                          style={{ backgroundColor: reason.color }}
                        />
                      </div>
                      <reason.icon className="relative h-32 w-32 text-white drop-shadow-2xl" />
                    </div>
                  </div>
                  {/* Animated particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/80 rounded-full"
                        style={{
                          left: `${(i * 17 + 10) % 90}%`,
                          top: `${(i * 23 + 15) % 85}%`,
                          animation: `float ${3 + i}s ease-in-out infinite`,
                          animationDelay: `${i * 0.5}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="text-left px-4">
                  <span className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r ${reason.gradient} text-white mb-4 sm:mb-6 shadow-lg`}>
                    Reason #{index + 1}
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-6">
                    {reason.title}
                  </h3>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
                    {reason.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split screen comparison */}
      <div className="comparison-section relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 flex">
          {/* Left Panel - Traditional */}
          <div className="left-panel relative w-1/2 h-full bg-gray-900 flex items-center justify-center border-r-4 border-gray-700">
            <div className="text-center px-12">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="w-12 h-1 bg-gray-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-500 mb-4">
                Traditional Web
              </h3>
              <p className="text-lg text-gray-600 max-w-md">
                Jarring page changes that break user flow and feel disconnected
              </p>
              <div className="mt-8 space-y-2">
                <div className="h-2 bg-gray-800 rounded" />
                <div className="h-2 bg-gray-800 rounded w-4/5" />
                <div className="h-2 bg-gray-800 rounded w-3/5" />
              </div>
            </div>
          </div>

          {/* Right Panel - With SSGOI */}
          <div className="right-panel relative w-1/2 h-full bg-gradient-to-br from-vivid-purple/20 to-vivid-orange/20 flex items-center justify-center">
            <div className="text-center px-12">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-vivid-purple to-vivid-orange rounded-lg flex items-center justify-center shadow-2xl">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                With SSGOI
              </h3>
              <p className="text-lg text-gray-200 max-w-md">
                Smooth, contextual navigation that feels natural and keeps users engaged
              </p>
              <div className="mt-8 space-y-2">
                <div className="h-2 bg-gradient-to-r from-vivid-purple to-vivid-orange rounded shadow-lg" 
                     style={{ animation: "pulse 2s ease-in-out infinite" }} />
                <div className="h-2 bg-gradient-to-r from-vivid-orange to-vivid-purple rounded w-4/5 shadow-lg" 
                     style={{ animation: "pulse 2s ease-in-out infinite", animationDelay: "0.2s" }} />
                <div className="h-2 bg-gradient-to-r from-vivid-purple to-vivid-orange rounded w-3/5 shadow-lg" 
                     style={{ animation: "pulse 2s ease-in-out infinite", animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Center divider with VS */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-2xl">
            <span className="text-2xl font-black text-white">VS</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}