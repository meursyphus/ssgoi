"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Layers, Cpu, Rocket, Globe, Code2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface FeaturesTimelineSectionProps {
  lang: string;
}

const features = [
  {
    icon: Sparkles,
    title: "Beautiful Transitions",
    description: "Choose from 15+ pre-built transition effects or create your own custom animations",
    color: "from-purple-500 to-pink-500",
    code: `fade({ spring: { stiffness: 300 } })`,
  },
  {
    icon: Layers,
    title: "Framework Agnostic",
    description: "Works seamlessly with React, Svelte, Vue, and more. Use your existing routing system",
    color: "from-blue-500 to-cyan-500",
    code: `<Ssgoi config={config}>\n  <App />\n</Ssgoi>`,
  },
  {
    icon: Cpu,
    title: "Performance First",
    description: "Hardware-accelerated animations with 60 FPS. Spring-based physics for natural motion",
    color: "from-green-500 to-emerald-500",
    code: `spring: { stiffness: 150, damping: 25 }`,
  },
  {
    icon: Rocket,
    title: "Zero Configuration",
    description: "Get started in minutes with sensible defaults. Progressively customize as needed",
    color: "from-orange-500 to-yellow-500",
    code: `defaultTransition: fade()`,
  },
  {
    icon: Globe,
    title: "SSR Ready",
    description: "Full server-side rendering support with Next.js, Nuxt, and SvelteKit. SEO friendly",
    color: "from-red-500 to-pink-500",
    code: `// Works out of the box\nexport default App`,
  },
  {
    icon: Code2,
    title: "Developer Experience",
    description: "TypeScript support, detailed docs, and helpful error messages. Build with confidence",
    color: "from-indigo-500 to-purple-500",
    code: `transition: hero({ element: '.card' })`,
  },
];

export function FeaturesTimelineSection({ lang }: FeaturesTimelineSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

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
        }
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
      gsap.to(".float-element-1", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
        y: -200,
        rotation: 360,
      });

      gsap.to(".float-element-2", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 3,
        },
        y: -150,
        rotation: -360,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* Floating background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="float-element-1 absolute left-10 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-vivid-purple/5 to-vivid-orange/5 blur-3xl" />
        <div className="float-element-2 absolute right-10 bottom-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-vivid-green/5 to-vivid-blue/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl mb-4">
            <span className="text-white">Everything You Need for</span>{" "}
            <span className="gradient-green">Delightful Transitions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Scroll to explore the features that make SSGOI the perfect choice for your next project
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
                  ref={(el) => (itemsRef.current[index] = el)}
                  className={`relative flex items-center ${
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="timeline-dot absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-vivid-purple to-vivid-orange shadow-lg shadow-vivid-purple/50" />

                  {/* Content */}
                  <div className={`w-full lg:w-1/2 ${isLeft ? "lg:pr-16" : "lg:pl-16"}`}>
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                      <div className="relative rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-8">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground mb-6">{feature.description}</p>
                        
                        {/* Code example */}
                        <div className="code-block">
                          <div className="rounded-lg bg-gray-900 border border-gray-700 p-4">
                            <pre className="text-sm text-gray-300">
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