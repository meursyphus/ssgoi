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
                <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
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
                      <reason.icon className="relative h-40 w-40 lg:h-48 lg:w-48 text-white drop-shadow-2xl" />
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
                <div className="text-left px-4 lg:px-0">
                  <span className={`inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r ${reason.gradient} text-white mb-6 sm:mb-8 shadow-2xl`}>
                    Reason #{index + 1}
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

      {/* Enhanced Comparison Section */}
      <div className="comparison-section relative px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
              Experience the <span className="gradient-orange">Difference</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">See how SSGOI transforms your web experience</p>
          </div>

          {/* Comparison Cards - Vertical layout */}
          <div className="space-y-8 lg:space-y-12">
            {/* Traditional Web Card */}
            <div className="traditional-card relative">
              <div className="rounded-2xl border-2 border-gray-800 bg-gray-900/80 backdrop-blur-sm p-8 sm:p-12 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
                  }} />
                </div>
                
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Left side - Visual Demo */}
                  <div className="order-2 lg:order-1">
                    <div className="relative rounded-xl bg-gray-950 p-4 border border-gray-800">
                      {/* Simulated browser */}
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-800">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <div className="flex-1 mx-4">
                          <div className="h-6 bg-gray-850 rounded-full px-3 flex items-center">
                            <span className="text-[10px] text-gray-600">example.com</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Realistic page layouts that blink */}
                      <div className="relative h-64">
                        {/* Layout 1 - Blog Post List */}
                        <div className="absolute inset-0 p-3 animate-page-switch">
                          {/* Header */}
                          <div className="mb-4">
                            <div className="h-10 bg-gray-800 rounded w-1/3 mb-2" />
                            <div className="h-3 bg-gray-850 rounded w-2/3" />
                          </div>
                          
                          {/* Post List */}
                          <div className="space-y-3">
                            {/* Post 1 */}
                            <div className="flex gap-3 p-3 bg-gray-850/50 rounded">
                              <div className="w-20 h-20 bg-gray-800 rounded" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-800 rounded w-3/4" />
                                <div className="h-3 bg-gray-850 rounded" />
                                <div className="h-3 bg-gray-850 rounded w-5/6" />
                                <div className="flex gap-2 mt-2">
                                  <div className="h-2 w-12 bg-gray-700 rounded" />
                                  <div className="h-2 w-16 bg-gray-700 rounded" />
                                </div>
                              </div>
                            </div>
                            
                            {/* Post 2 */}
                            <div className="flex gap-3 p-3 bg-gray-850/50 rounded">
                              <div className="w-20 h-20 bg-gray-800 rounded" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-800 rounded w-2/3" />
                                <div className="h-3 bg-gray-850 rounded" />
                                <div className="h-3 bg-gray-850 rounded w-4/5" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Layout 2 - Blog Post Detail */}
                        <div className="absolute inset-0 p-3 animate-page-switch" style={{ animationDelay: "1.5s" }}>
                          {/* Article Header */}
                          <div className="mb-4">
                            <div className="h-8 bg-gray-800 rounded w-4/5 mb-2" />
                            <div className="flex gap-2 mb-3">
                              <div className="h-3 w-16 bg-gray-700 rounded" />
                              <div className="h-3 w-20 bg-gray-700 rounded" />
                              <div className="h-3 w-16 bg-gray-700 rounded" />
                            </div>
                          </div>
                          
                          {/* Hero Image */}
                          <div className="h-32 bg-gray-850 rounded mb-4" />
                          
                          {/* Article Content */}
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-850 rounded" />
                            <div className="h-3 bg-gray-850 rounded" />
                            <div className="h-3 bg-gray-850 rounded w-5/6" />
                            <div className="h-3 bg-gray-850 rounded w-4/5" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Flash effect overlay */}
                      <div className="absolute inset-0 bg-white rounded-lg animate-flash-overlay" />
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="order-1 lg:order-2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-gray-600" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-400">Traditional Web</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl mt-0.5">✕</span>
                        <p className="text-white font-semibold">Jarring Transitions</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl mt-0.5">✕</span>
                        <p className="text-white font-semibold">Lost Context</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl mt-0.5">✕</span>
                        <p className="text-white font-semibold">Poor Performance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VS Divider */}
            <div className="vs-divider relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-700" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-vivid-purple to-vivid-orange rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <span className="text-xl sm:text-2xl font-black text-white">VS</span>
                </div>
              </div>
            </div>

            {/* SSGOI Card */}
            <div className="ssgoi-card relative">
              <div className="rounded-2xl border-2 border-vivid-purple/30 bg-gradient-to-br from-vivid-purple/10 to-vivid-orange/10 backdrop-blur-sm p-8 sm:p-12 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-vivid-purple/20 to-vivid-orange/20 animate-gradient" />
                </div>
                
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Left side - Visual Demo */}
                  <div className="order-2 lg:order-1">
                    <div className="relative rounded-xl bg-gray-900/50 p-6 border border-vivid-purple/30 shadow-2xl">
                      {/* Simulated browser */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "0.1s" }} />
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
                      </div>
                      
                      {/* Smooth sliding transitions - like native app */}
                      <div className="relative h-64 overflow-hidden rounded-lg">
                        {/* Container for sliding pages */}
                        <div className="flex animate-slow-slide">
                          {/* Page 1 - Blog Post List */}
                          <div className="min-w-full p-3">
                            {/* Header */}
                            <div className="mb-4">
                              <div className="h-10 bg-gradient-to-r from-vivid-purple/30 to-vivid-orange/30 rounded w-1/3 mb-2" />
                              <div className="h-3 bg-vivid-purple/20 rounded w-2/3" />
                            </div>
                            
                            {/* Post List with SSGOI colors */}
                            <div className="space-y-3">
                              {/* Post 1 */}
                              <div className="flex gap-3 p-3 bg-gradient-to-r from-vivid-purple/10 to-vivid-orange/10 rounded">
                                <div className="w-20 h-20 bg-gradient-to-br from-vivid-purple/30 to-vivid-orange/30 rounded" />
                                <div className="flex-1 space-y-2">
                                  <div className="h-4 bg-vivid-purple/25 rounded w-3/4" />
                                  <div className="h-3 bg-vivid-orange/20 rounded" />
                                  <div className="h-3 bg-vivid-purple/20 rounded w-5/6" />
                                  <div className="flex gap-2 mt-2">
                                    <div className="h-2 w-12 bg-vivid-orange/30 rounded" />
                                    <div className="h-2 w-16 bg-vivid-purple/30 rounded" />
                                  </div>
                                </div>
                              </div>
                              
                              {/* Post 2 */}
                              <div className="flex gap-3 p-3 bg-gradient-to-r from-vivid-orange/10 to-vivid-purple/10 rounded">
                                <div className="w-20 h-20 bg-gradient-to-br from-vivid-orange/30 to-vivid-purple/30 rounded" />
                                <div className="flex-1 space-y-2">
                                  <div className="h-4 bg-vivid-orange/25 rounded w-2/3" />
                                  <div className="h-3 bg-vivid-purple/20 rounded" />
                                  <div className="h-3 bg-vivid-orange/20 rounded w-4/5" />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Page 2 - Blog Post Detail */}
                          <div className="min-w-full p-3">
                            {/* Article Header */}
                            <div className="mb-4">
                              <div className="h-8 bg-gradient-to-r from-vivid-purple/30 to-vivid-orange/30 rounded w-4/5 mb-2" />
                              <div className="flex gap-2 mb-3">
                                <div className="h-3 w-16 bg-vivid-purple/25 rounded" />
                                <div className="h-3 w-20 bg-vivid-orange/25 rounded" />
                                <div className="h-3 w-16 bg-vivid-purple/25 rounded" />
                              </div>
                            </div>
                            
                            {/* Hero Image */}
                            <div className="h-32 bg-gradient-to-br from-vivid-purple/20 to-vivid-orange/20 rounded mb-4" />
                            
                            {/* Article Content */}
                            <div className="space-y-2">
                              <div className="h-3 bg-vivid-purple/20 rounded" />
                              <div className="h-3 bg-vivid-orange/20 rounded" />
                              <div className="h-3 bg-vivid-purple/20 rounded w-5/6" />
                              <div className="h-3 bg-vivid-orange/20 rounded w-4/5" />
                            </div>
                          </div>
                          
                          {/* Page 3 - duplicate for smooth loop */}
                          <div className="min-w-full p-3">
                            {/* Header */}
                            <div className="mb-4">
                              <div className="h-10 bg-gradient-to-r from-vivid-purple/30 to-vivid-orange/30 rounded w-1/3 mb-2" />
                              <div className="h-3 bg-vivid-purple/20 rounded w-2/3" />
                            </div>
                            
                            {/* Post List duplicate */}
                            <div className="space-y-3">
                              <div className="flex gap-3 p-3 bg-gradient-to-r from-vivid-purple/10 to-vivid-orange/10 rounded">
                                <div className="w-20 h-20 bg-gradient-to-br from-vivid-purple/30 to-vivid-orange/30 rounded" />
                                <div className="flex-1 space-y-2">
                                  <div className="h-4 bg-vivid-purple/25 rounded w-3/4" />
                                  <div className="h-3 bg-vivid-orange/20 rounded" />
                                  <div className="h-3 bg-vivid-purple/20 rounded w-5/6" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Context preservation indicator */}
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-green-500 font-medium">Context Preserved</span>
                        </div>
                        
                        {/* Page dots indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-vivid-purple rounded-full animate-dot-1" />
                          <div className="w-1.5 h-1.5 bg-vivid-purple/40 rounded-full animate-dot-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="order-1 lg:order-2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-vivid-purple to-vivid-orange flex items-center justify-center shadow-lg">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">With SSGOI</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="text-green-500 text-xl mt-0.5">✓</span>
                        <p className="text-white font-semibold">Smooth Transitions</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-green-500 text-xl mt-0.5">✓</span>
                        <p className="text-white font-semibold">Maintained Context</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-green-500 text-xl mt-0.5">✓</span>
                        <p className="text-white font-semibold">Native-like Feel</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
      `}</style>
    </section>
  );
}