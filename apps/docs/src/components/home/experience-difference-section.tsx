"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Clock, Heart, User, AlertCircle, Brain, Sparkles } from "lucide-react";
import { useTranslations } from "@/i18n/use-translations";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceDifferenceSectionProps {
  lang: string;
}

export function ExperienceDifferenceSection({ lang }: ExperienceDifferenceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [traditionalActive, setTraditionalActive] = useState(false);
  const [ssgoiActive, setSsgoiActive] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [showTraditionalDetail, setShowTraditionalDetail] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("home");

  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      title: t("experienceDifference.demo.blogPosts.modernWeb.title"),
      excerpt: t("experienceDifference.demo.blogPosts.modernWeb.excerpt"),
      author: "Sarah Chen",
      date: "Dec 15",
      readTime: `5 ${t("experienceDifference.demo.readTime")}`,
      likes: 234,
      category: "Development",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      title: t("experienceDifference.demo.blogPosts.aiDevelopment.title"),
      excerpt: t("experienceDifference.demo.blogPosts.aiDevelopment.excerpt"),
      author: "Mike Johnson",
      date: "Dec 14",
      readTime: `8 ${t("experienceDifference.demo.readTime")}`,
      likes: 512,
      category: "AI & ML",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      title: t("experienceDifference.demo.blogPosts.typescriptPatterns.title"),
      excerpt: t("experienceDifference.demo.blogPosts.typescriptPatterns.excerpt"),
      author: "Emily Davis",
      date: "Dec 13",
      readTime: `12 ${t("experienceDifference.demo.readTime")}`,
      likes: 189,
      category: "TypeScript",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(".experience-title", {
        scrollTrigger: {
          trigger: ".experience-title",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Horizontal divider animation
      gsap.from(".horizontal-divider", {
        scrollTrigger: {
          trigger: ".comparison-container",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        scaleX: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      });


      // Demo sections animation
      gsap.from(".demo-section", {
        scrollTrigger: {
          trigger: ".comparison-container",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });

      // UX points animation
      gsap.from(".ux-point", {
        scrollTrigger: {
          trigger: ".comparison-container",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-animate transitions
  useEffect(() => {
    const startAnimation = () => {
      const nextIndex = (currentPostIndex + 1) % blogPosts.length;
      
      // Traditional: Show flickering and page transition
      setTraditionalActive(true);
      setTimeout(() => setTraditionalActive(false), 100);
      setTimeout(() => setTraditionalActive(true), 200);
      setTimeout(() => setTraditionalActive(false), 300);
      setTimeout(() => {
        setTraditionalActive(true);
        setShowTraditionalDetail(true);
      }, 400);
      setTimeout(() => {
        setTraditionalActive(false);
      }, 500);

      // Reset traditional after showing detail
      setTimeout(() => {
        setTraditionalActive(true);
        setTimeout(() => setTraditionalActive(false), 100);
        setTimeout(() => setTraditionalActive(true), 200);
        setTimeout(() => {
          setTraditionalActive(false);
          setShowTraditionalDetail(false);
        }, 300);
      }, 3000);

      // SSGOI: Smooth transition
      setSsgoiActive(true);
      setTimeout(() => {
        setSsgoiActive(false);
      }, 3000);

      // Update post index
      setTimeout(() => {
        setCurrentPostIndex(nextIndex);
      }, 4000);
    };

    // Start animation when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(startAnimation, 1500);
            intervalRef.current = setInterval(startAnimation, 6000);
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentPostIndex]);

  const currentPost = blogPosts[currentPostIndex];

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32 bg-gradient-to-b from-gray-800 to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="experience-title text-center mb-16">
          <h2 className="text-4xl font-black sm:text-5xl lg:text-6xl mb-4">
            <span className="gradient-orange">{t("experienceDifference.title.line1")}</span>{" "}
            <span className="text-white">{t("experienceDifference.title.line2")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("experienceDifference.subtitle")}
          </p>
        </div>

        {/* Comparison Container - Vertical Stack */}
        <div className="comparison-container space-y-12">
          
          {/* Traditional Web Section */}
          <div className="demo-section">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-400 mb-8 text-center">{t("experienceDifference.traditional.title")}</h3>
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center max-w-6xl mx-auto">
              {/* Description */}
              <div className="w-full lg:flex-1 lg:max-w-md">
                <div className="space-y-4">
                  <div className="ux-point flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-300">{t("experienceDifference.traditional.uxPoints.lossOfContext.title")}</p>
                      <p className="text-sm text-gray-500">{t("experienceDifference.traditional.uxPoints.lossOfContext.description")}</p>
                    </div>
                  </div>
                  <div className="ux-point flex items-start gap-3">
                    <Brain className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-300">{t("experienceDifference.traditional.uxPoints.highCognitiveLoad.title")}</p>
                      <p className="text-sm text-gray-500">{t("experienceDifference.traditional.uxPoints.highCognitiveLoad.description")}</p>
                    </div>
                  </div>
                  <div className="ux-point flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-300">{t("experienceDifference.traditional.uxPoints.jarringExperience.title")}</p>
                      <p className="text-sm text-gray-500">{t("experienceDifference.traditional.uxPoints.jarringExperience.description")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Browser Demo */}
              <div className="w-full lg:flex-1 lg:max-w-md">
                <div className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-800/80 px-3 py-2">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-500/80" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
                      <div className="h-2 w-2 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="inline-block rounded bg-gray-700/50 px-2 py-0.5 text-xs text-gray-400">
                        blog.example.com
                      </div>
                    </div>
                  </div>

                  <div className="relative h-[320px] bg-gray-900 overflow-hidden">
                    {/* Flicker effect */}
                    <div className={`absolute inset-0 bg-white z-50 transition-opacity duration-100 ${traditionalActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
                    
                    {/* List or Detail view */}
                    {!showTraditionalDetail ? (
                      <div className="p-4 space-y-3">
                        <h2 className="text-base font-bold text-white mb-3">{t("experienceDifference.demo.latestPosts")}</h2>
                        {blogPosts.map((post, index) => (
                          <article
                            key={post.id}
                            className={`rounded border border-gray-700 bg-gray-800/50 p-3 transition-all ${
                              index === currentPostIndex ? 'border-blue-500/50 bg-gray-800/70' : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              <img src={post.image} alt="" className="h-14 w-20 rounded object-cover" />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white truncate">{post.title}</h3>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{post.excerpt}</p>
                                <div className="mt-1 flex gap-2 text-xs text-gray-500">
                                  <span>{post.readTime}</span>
                                  <span>·</span>
                                  <span>{post.likes} {t("experienceDifference.demo.likes")}</span>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4">
                        <button className="text-xs text-blue-400 mb-3">{t("experienceDifference.demo.back")}</button>
                        <img src={currentPost.image} alt="" className="w-full h-32 object-cover rounded mb-3" />
                        <h1 className="text-lg font-bold text-white mb-2">{currentPost.title}</h1>
                        <div className="flex gap-3 text-xs text-gray-400 mb-2">
                          <span>{currentPost.author}</span>
                          <span>·</span>
                          <span>{currentPost.date}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-3">{currentPost.excerpt}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-8">
            <div className="horizontal-divider h-px bg-gray-600"></div>
          </div>

          {/* With SSGOI Section */}
          <div className="demo-section">
            <h3 className="text-2xl lg:text-3xl font-bold gradient-green mb-8 text-center">{t("experienceDifference.withSsgoi.title")}</h3>
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center max-w-6xl mx-auto">
              {/* Description */}
              <div className="w-full lg:flex-1 lg:max-w-md">
                <div className="space-y-4">
                  <div className="ux-point flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-300">{t("experienceDifference.withSsgoi.uxPoints.maintainsContext.title")}</p>
                      <p className="text-sm text-gray-500">{t("experienceDifference.withSsgoi.uxPoints.maintainsContext.description")}</p>
                    </div>
                  </div>
                  <div className="ux-point flex items-start gap-3">
                    <Brain className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-300">{t("experienceDifference.withSsgoi.uxPoints.lowCognitiveLoad.title")}</p>
                      <p className="text-sm text-gray-500">{t("experienceDifference.withSsgoi.uxPoints.lowCognitiveLoad.description")}</p>
                    </div>
                  </div>
                  <div className="ux-point flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-300">{t("experienceDifference.withSsgoi.uxPoints.delightfulExperience.title")}</p>
                      <p className="text-sm text-gray-500">{t("experienceDifference.withSsgoi.uxPoints.delightfulExperience.description")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Browser Demo */}
              <div className="w-full lg:flex-1 lg:max-w-md">
                <div className="relative overflow-hidden rounded-xl border border-green-500/30 bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-800/80 px-3 py-2">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-500/80" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
                      <div className="h-2 w-2 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <div className="inline-block rounded bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-xs text-gray-300">
                        blog.ssgoi.com
                      </div>
                    </div>
                  </div>

                  <div className="relative h-[320px] bg-gray-900 overflow-hidden">
                    {/* List view */}
                    <div 
                      className={`absolute inset-0 p-4 space-y-3 transition-transform duration-500 ease-out ${
                        ssgoiActive ? '-translate-x-full' : 'translate-x-0'
                      }`}
                    >
                      <h2 className="text-base font-bold text-white mb-3">Latest Posts</h2>
                      {blogPosts.map((post, index) => (
                        <article
                          key={post.id}
                          className={`rounded border border-gray-700 bg-gray-800/50 p-3 transition-all ${
                            index === currentPostIndex ? 'border-green-500/50 bg-gray-800/70' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <img src={post.image} alt="" className="h-14 w-20 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-white truncate">{post.title}</h3>
                              <p className="text-xs text-gray-400 truncate mt-0.5">{post.excerpt}</p>
                              <div className="mt-1 flex gap-2 text-xs text-gray-500">
                                <span>{post.readTime}</span>
                                <span>·</span>
                                <span>{post.likes} likes</span>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    {/* Detail view */}
                    <div 
                      className={`absolute inset-0 p-4 transition-transform duration-500 ease-out ${
                        ssgoiActive ? 'translate-x-0' : 'translate-x-full'
                      }`}
                    >
                      <button className="text-xs text-green-400 mb-3">{t("experienceDifference.demo.back")}</button>
                      <img src={currentPost.image} alt="" className="w-full h-32 object-cover rounded mb-3" />
                      <h1 className="text-lg font-bold text-white mb-2">{currentPost.title}</h1>
                      <div className="flex gap-3 text-xs text-gray-400 mb-2">
                        <span>{currentPost.author}</span>
                        <span>·</span>
                        <span>{currentPost.date}</span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-3">{currentPost.excerpt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}