"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Sparkles, TrendingUp, MousePointer, ArrowRight, Zap, Heart, Globe } from "lucide-react";
import { useTranslations } from "@/i18n/use-translations";

gsap.registerPlugin(ScrollTrigger);

interface WhyTransitionsMatterSectionProps {
  lang: string;
}


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
  const t = useTranslations("home");

  const reasons = [
    {
      icon: MousePointer,
      title: t("whyTransitionsMatter.reasons.nativeLike.title"),
      description: t("whyTransitionsMatter.reasons.nativeLike.description"),
      gradient: "from-orange-500 to-yellow-500",
      color: "#F97316",
      bgImage: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      icon: Sparkles,
      title: t("whyTransitionsMatter.reasons.brandIdentity.title"),
      description: t("whyTransitionsMatter.reasons.brandIdentity.description"),
      gradient: "from-purple-500 to-pink-500",
      color: "#A855F7",
      bgImage: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: Eye,
      title: t("whyTransitionsMatter.reasons.visualContext.title"),
      description: t("whyTransitionsMatter.reasons.visualContext.description"),
      gradient: "from-blue-500 to-cyan-500",
      color: "#0EA5E9",
      bgImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  ];

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

      // Comparison cards entrance animations
      gsap.from(".traditional-card", {
        scrollTrigger: {
          trigger: ".traditional-card",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".ssgoi-card", {
        scrollTrigger: {
          trigger: ".ssgoi-card", 
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // VS divider animation
      gsap.from(".vs-divider", {
        scrollTrigger: {
          trigger: ".vs-divider",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        scale: 0,
        rotation: 180,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
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
            {t("whyTransitionsMatter.title.line1").split("").map((char, i) => (
              <span key={i} className="char inline-block text-white">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <br />
          <span className="inline-block mt-2">
            {t("whyTransitionsMatter.title.line2").split("").map((char, i) => (
              <span key={i} className="char inline-block gradient-purple">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t("whyTransitionsMatter.subtitle")}
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
          className="relative w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-center"
          style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="reason-card w-full max-w-7xl"
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left side - Visual */}
                <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-800">
                  {/* Background gradient subtle */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ background: reason.bgImage }}
                  />
                  
                  {/* Different UI mockup for each reason */}
                  <div className="absolute inset-0 p-6 flex items-center justify-center">
                    {index === 0 && (
                      /* Native-like Experience - Mobile app-like interface */
                      <div className="w-full flex justify-center">
                        {/* Phone mockup */}
                        <div className="relative w-72 h-[500px] bg-gray-800 rounded-[3rem] p-2 border-2 border-gray-700 shadow-2xl">
                          <div className="bg-gray-900 rounded-[2.75rem] h-full overflow-hidden">
                            {/* Phone notch */}
                            <div className="h-6 bg-gray-800 flex justify-center items-center">
                              <div className="w-24 h-3 bg-gray-900 rounded-full" />
                            </div>
                            {/* Screen content with native transitions */}
                            <div className="relative h-full p-4">
                              {/* App cards sliding in */}
                              <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl p-4 backdrop-blur border border-orange-500/20"
                                    style={{
                                      animation: `slideInFromRight 0.6s ease-out`,
                                      animationDelay: `${i * 0.15}s`,
                                      animationFillMode: 'both'
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl animate-pulse" />
                                      <div className="flex-1">
                                        <div className="h-3 bg-orange-400/50 rounded w-3/4 mb-2" />
                                        <div className="h-2 bg-yellow-400/30 rounded w-1/2" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {/* Floating action button */}
                              <div className="absolute bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full shadow-lg flex items-center justify-center animate-bounce-slow">
                                <MousePointer className="w-6 h-6 text-white" />
                              </div>
                              {/* Tab bar */}
                              <div className="absolute bottom-4 left-4 right-4 bg-gray-800/90 backdrop-blur rounded-2xl p-3 flex justify-around">
                                {[...Array(4)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                      background: i === 1 ? 'linear-gradient(135deg, #F97316, #FCD34D)' : '',
                                      backgroundColor: i !== 1 ? '#374151' : ''
                                    }}
                                  >
                                    <div className="w-4 h-4 bg-white/20 rounded" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {index === 1 && (
                      /* Brand Identity - Unique motion signatures */
                      <div className="w-full flex items-center justify-center">
                        <div className="relative">
                          {/* Pulsing rings */}
                          <div className="absolute inset-0 -m-32">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute inset-0 border-2 border-purple-500/30 rounded-full"
                                style={{
                                  animation: `brandPulse 3s ease-out infinite`,
                                  animationDelay: `${i * 1}s`
                                }}
                              />
                            ))}
                          </div>
                          {/* Main brand container */}
                          <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-3xl shadow-2xl">
                            {/* Animated brand icon */}
                            <div className="w-32 h-32 relative">
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl" />
                              <Sparkles className="w-full h-full text-white p-6" style={{
                                animation: 'brandRotate 8s linear infinite'
                              }} />
                            </div>
                          </div>
                          {/* Orbiting elements */}
                          <div className="absolute inset-0" style={{
                            animation: 'orbitRotate 10s linear infinite'
                          }}>
                            {[0, 120, 240].map((deg, i) => (
                              <div
                                key={i}
                                className="absolute w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl shadow-lg"
                                style={{
                                  top: '50%',
                                  left: '50%',
                                  transform: `rotate(${deg}deg) translateX(120px) translateY(-50%)`,
                                }}
                              >
                                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-white/30 to-transparent flex items-center justify-center">
                                  <div className="w-6 h-6 bg-white/50 rounded" />
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Brand tagline */}
                          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-48">
                            <div className="h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg mb-2" style={{
                              animation: 'fadeInUp 1s ease-out 0.5s both'
                            }} />
                            <div className="h-4 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg w-32 mx-auto" style={{
                              animation: 'fadeInUp 1s ease-out 0.7s both'
                            }} />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {index === 2 && (
                      /* Visual Context - Spatial navigation awareness */
                      <div className="w-full flex items-center justify-center">
                        <div className="relative h-[400px] w-full" style={{ perspective: '1000px' }}>
                          {/* Navigation path */}
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" style={{
                            animation: 'pathGlow 2s ease-in-out infinite'
                          }} />
                          
                          {/* Page cards in 3D space */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            {/* Previous page */}
                            <div 
                              className="absolute w-48 h-64 bg-gray-800/80 backdrop-blur rounded-xl border border-gray-700 p-4"
                              style={{
                                transform: 'translateX(-250px) translateZ(-100px) rotateY(25deg)',
                                animation: 'floatPage 4s ease-in-out infinite'
                              }}
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <ArrowRight className="w-4 h-4 text-gray-500 rotate-180" />
                                <span className="text-sm text-gray-400">{t("whyTransitionsMatter.previous")}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="h-3 bg-gray-700/50 rounded" />
                                <div className="h-3 bg-gray-700/50 rounded w-3/4" />
                              </div>
                            </div>
                            
                            {/* Current page (highlighted) */}
                            <div 
                              className="absolute w-56 h-72 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur rounded-xl border-2 border-blue-500 p-4 shadow-2xl z-10"
                              style={{
                                transform: 'translateZ(50px)',
                                animation: 'pulseGlow 2s ease-in-out infinite'
                              }}
                            >
                              <div className="flex items-center justify-center mb-4">
                                <Eye className="w-8 h-8 text-blue-400" />
                              </div>
                              <div className="text-center mb-4">
                                <span className="text-blue-400 font-semibold">{t("whyTransitionsMatter.youAreHere")}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="h-4 bg-blue-500/30 rounded" />
                                <div className="h-4 bg-cyan-500/30 rounded" />
                                <div className="h-4 bg-blue-500/30 rounded w-3/4" />
                              </div>
                            </div>
                            
                            {/* Next page */}
                            <div 
                              className="absolute w-48 h-64 bg-gray-800/80 backdrop-blur rounded-xl border border-gray-700 p-4"
                              style={{
                                transform: 'translateX(250px) translateZ(-100px) rotateY(-25deg)',
                                animation: 'floatPage 4s ease-in-out infinite',
                                animationDelay: '2s'
                              }}
                            >
                              <div className="flex items-center gap-2 mb-4 justify-end">
                                <span className="text-sm text-gray-400">{t("whyTransitionsMatter.next")}</span>
                                <ArrowRight className="w-4 h-4 text-gray-500" />
                              </div>
                              <div className="space-y-2">
                                <div className="h-3 bg-gray-700/50 rounded" />
                                <div className="h-3 bg-gray-700/50 rounded w-3/4" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Breadcrumb trail */}
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-3">
                            <div className="w-2 h-2 bg-gray-600 rounded-full" />
                            <div className="w-2 h-2 bg-gray-600 rounded-full" />
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-gray-600 rounded-full" />
                            <div className="w-2 h-2 bg-gray-600 rounded-full" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="text-left px-4 lg:px-0">
                  <span className={`inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r ${reason.gradient} text-white mb-6 sm:mb-8 shadow-2xl`}>
                    {t("whyTransitionsMatter.reasonBadge")}{index + 1}
                  </span>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-8">
                    {reason.title}
                  </h3>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8 sm:mb-10">
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

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes brandPulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes brandRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes orbitRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pathGlow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes floatPage {
          0%, 100% {
            transform: translateY(0) translateX(var(--translate-x, -250px)) translateZ(var(--translate-z, -100px)) rotateY(var(--rotate-y, 25deg));
          }
          50% {
            transform: translateY(-10px) translateX(var(--translate-x, -250px)) translateZ(var(--translate-z, -100px)) rotateY(var(--rotate-y, 25deg));
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slidePages {
          0%, 45% {
            transform: translateX(0);
          }
          50%, 95% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
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
        
        @keyframes page-switch {
          0%, 45% {
            opacity: 1;
          }
          50%, 95% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes flash-overlay {
          0%, 90% {
            opacity: 0;
          }
          95% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
          }
        }
        
        @keyframes slow-slide {
          0% {
            transform: translateX(0);
          }
          48% {
            transform: translateX(0);
          }
          52% {
            transform: translateX(-33.33%);
          }
          98% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(-66.66%);
          }
        }
        
        @keyframes dot-1 {
          0%, 48% {
            opacity: 1;
          }
          52%, 100% {
            opacity: 0.4;
          }
        }
        
        @keyframes dot-2 {
          0%, 48% {
            opacity: 0.4;
          }
          52%, 98% {
            opacity: 1;
          }
          100% {
            opacity: 0.4;
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-page-switch {
          animation: page-switch 2s ease-in-out infinite;
        }
        
        .animate-flash-overlay {
          animation: flash-overlay 2s ease-in-out infinite;
        }
        
        .animate-slow-slide {
          animation: slow-slide 8s ease-in-out infinite;
        }
        
        .animate-dot-1 {
          animation: dot-1 8s ease-in-out infinite;
        }
        
        .animate-dot-2 {
          animation: dot-2 8s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}