"use client";

import React, { memo } from "react";
import { film } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Home Page - SSGOI Film Studio
function HomePage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/film"
      className="bg-black min-h-full relative overflow-hidden"
    >
      {/* Film grain effect */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      </div>

      <div
        className={cn(
          "mx-auto relative z-10",
          isMobile ? "px-3 py-6" : "max-w-7xl px-4 py-16 sm:py-24",
        )}
      >
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold tracking-wider uppercase">
              Now Screening
            </span>
          </div>

          <div className="space-y-4">
            <h1
              className={cn(
                "font-black text-white tracking-tighter",
                isMobile ? "text-4xl" : "text-6xl sm:text-8xl",
              )}
            >
              <span className="block text-gray-400 text-lg sm:text-2xl font-light tracking-[0.2em] uppercase mb-4">
                SSGOI Studios Presents
              </span>
              <span className="inline-block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                FILM
              </span>
            </h1>
            <p
              className={cn(
                "text-gray-400 max-w-2xl mx-auto font-light tracking-wide",
                isMobile ? "text-sm" : "text-lg",
              )}
            >
              A revolutionary cinematic experience for web transitions.
              <span className="block mt-2 text-gray-500 italic">
                "Every frame tells a story, every transition creates magic."
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-wider overflow-hidden transition-all hover:scale-105">
              <span className="relative z-10">Start Production</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 translate-y-full group-hover:translate-y-0 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-gray-700 text-white font-bold uppercase tracking-wider hover:bg-gray-900 transition-all">
              View Screenplay
            </button>
          </div>
        </div>

        {/* Featured Films Grid */}
        <div className="mb-24">
          <h2 className="text-gray-400 font-light tracking-[0.3em] uppercase text-sm mb-8 text-center">
            Featured Productions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative aspect-[2/3] bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-white/80 text-xs uppercase tracking-wider mb-2">
                  Drama • 2024
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">The Fade</h3>
                <p className="text-gray-300 text-sm">
                  A smooth transition between parallel worlds
                </p>
              </div>
              <div className="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">
                PREMIERE
              </div>
            </div>

            <div className="group relative aspect-[2/3] bg-gradient-to-br from-blue-900 to-cyan-700 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-white/80 text-xs uppercase tracking-wider mb-2">
                  Action • 2024
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Drill Down
                </h3>
                <p className="text-gray-300 text-sm">
                  Dive deep into layered narratives
                </p>
              </div>
              <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                HOT
              </div>
            </div>

            <div className="group relative aspect-[2/3] bg-gradient-to-br from-pink-900 to-orange-700 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-white/80 text-xs uppercase tracking-wider mb-2">
                  Epic • 2024
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Hero's Journey
                </h3>
                <p className="text-gray-300 text-sm">
                  Shared elements across epic scenes
                </p>
              </div>
              <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 text-xs font-bold rounded">
                4K
              </div>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="text-center border-t border-gray-800 pt-16">
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500">
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-xs uppercase tracking-wider">
                Best Transition
              </div>
              <div className="text-xs">Webby Awards</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎭</div>
              <div className="text-xs uppercase tracking-wider">
                UX Excellence
              </div>
              <div className="text-xs">Awwwards</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-xs uppercase tracking-wider">Innovation</div>
              <div className="text-xs">FWA</div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Features Page - Production Tools
function FeaturesPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/film/features" className="bg-black min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-16",
        )}
      >
        <div className="mb-12">
          <h1
            className={cn(
              "font-black text-white tracking-tight mb-4",
              isMobile ? "text-3xl" : "text-5xl",
            )}
          >
            Production Tools
          </h1>
          <p className="text-gray-400 text-lg">
            Professional-grade equipment for cinematic web experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Cinematography Tools */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-600/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Cinematography</h3>
                <p className="text-gray-500 text-sm">
                  Visual storytelling essentials
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">Depth of Field</div>
                  <div className="text-gray-400 text-sm">
                    Layer-based focus transitions with blur effects
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">
                    Camera Movement
                  </div>
                  <div className="text-gray-400 text-sm">
                    Smooth panning, tilting, and tracking shots
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">Aspect Ratios</div>
                  <div className="text-gray-400 text-sm">
                    Cinematic widescreen to vertical mobile
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post-Production Suite */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-600/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 12h18M3 8h18M3 16h18"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Post-Production
                </h3>
                <p className="text-gray-500 text-sm">
                  Professional editing suite
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">Color Grading</div>
                  <div className="text-gray-400 text-sm">
                    Custom palettes for each transition
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">
                    Timeline Control
                  </div>
                  <div className="text-gray-400 text-sm">
                    Precise timing with spring physics
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />
                <div>
                  <div className="text-white font-semibold">
                    Special Effects
                  </div>
                  <div className="text-gray-400 text-sm">
                    Particle systems and visual enhancements
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transition Techniques */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            Signature Techniques
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "fade", status: "classic" },
              { name: "film", status: "signature" },
              { name: "scroll", status: "dynamic" },
              { name: "hero", status: "epic" },
              { name: "pinterest", status: "modern" },
              { name: "drill", status: "bold" },
            ].map((technique) => (
              <div
                key={technique.name}
                className={cn(
                  "relative p-4 rounded-lg text-center border transition-all hover:scale-105",
                  technique.name === "film"
                    ? "bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-600/50"
                    : "bg-gray-900 border-gray-800 hover:border-gray-700",
                )}
              >
                <div className="text-white font-mono text-sm mb-1">
                  {technique.name}()
                </div>
                <div
                  className={cn(
                    "text-xs uppercase tracking-wider",
                    technique.name === "film"
                      ? "text-red-400"
                      : "text-gray-500",
                  )}
                >
                  {technique.status}
                </div>
                {technique.name === "film" && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    NEW
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 rounded-lg border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Performance
              </div>
              <div className="text-3xl font-bold text-white">60 FPS</div>
              <div className="text-gray-500 text-sm">
                Buttery smooth animations
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Bundle Size
              </div>
              <div className="text-3xl font-bold text-white">&lt;15KB</div>
              <div className="text-gray-500 text-sm">Lightweight and fast</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Compatibility
              </div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-gray-500 text-sm">All modern browsers</div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Examples Page - Film Portfolio
function ExamplesPage() {
  const isMobile = useMobile();

  const films = [
    {
      title: "NOCTURNE",
      director: "Christopher Nolan",
      year: "2024",
      genre: "Psychological Thriller",
      rating: "9.2",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop",
      awards: ["🏆 Best Cinematography", "🎬 Directors Choice"],
    },
    {
      title: "ETHEREAL",
      director: "Denis Villeneuve",
      year: "2024",
      genre: "Science Fiction",
      rating: "8.9",
      image:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop",
      awards: ["✨ Visual Effects", "🎵 Best Score"],
    },
    {
      title: "REVERIE",
      director: "Wes Anderson",
      year: "2024",
      genre: "Art House",
      rating: "8.7",
      image:
        "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&h=750&fit=crop",
      awards: ["🎨 Art Direction", "📝 Original Screenplay"],
    },
    {
      title: "VELOCITY",
      director: "Jordan Peele",
      year: "2024",
      genre: "Action Thriller",
      rating: "8.5",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop",
      awards: ["💥 Best Action", "🎭 Supporting Actor"],
    },
  ];

  return (
    <DemoPage path="/film/examples" className="bg-black min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-7xl px-4 py-16",
        )}
      >
        <div className="mb-12">
          <h1
            className={cn(
              "font-black text-white tracking-tight mb-4",
              isMobile ? "text-3xl" : "text-5xl",
            )}
          >
            Featured Films
          </h1>
          <p className="text-gray-400 text-lg">
            Award-winning productions showcasing the power of FILM transitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {films.map((film, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-500"
            >
              {/* Film Poster */}
              <div className="relative aspect-[2/3] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${film.image})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded font-bold text-sm">
                  ★ {film.rating}
                </div>

                {/* Film Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    {film.genre} • {film.year}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {film.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Directed by {film.director}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {film.awards.map((award, i) => (
                      <span
                        key={i}
                        className="text-xs bg-black/50 backdrop-blur px-2 py-1 rounded text-gray-300"
                      >
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Behind the Scenes */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">
            Behind the Scenes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-purple-400 font-semibold mb-2">
                Pre-Production
              </div>
              <p className="text-gray-400 text-sm">
                Storyboarding transitions with precise timing and visual flow
              </p>
            </div>
            <div>
              <div className="text-purple-400 font-semibold mb-2">
                Production
              </div>
              <p className="text-gray-400 text-sm">
                Capturing smooth animations with 60fps performance
              </p>
            </div>
            <div>
              <div className="text-purple-400 font-semibold mb-2">
                Post-Production
              </div>
              <p className="text-gray-400 text-sm">
                Fine-tuning spring physics for natural motion
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Getting Started Page - Director's Guide
function GettingStartedPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/film/start" className="bg-black min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-5xl px-4 py-16",
        )}
      >
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full mb-6">
            <span className="text-red-400 text-xs font-bold tracking-wider uppercase">
              Director's Cut
            </span>
          </div>
          <h1
            className={cn(
              "font-black text-white tracking-tight mb-4",
              isMobile ? "text-3xl" : "text-5xl",
            )}
          >
            Director's Guide
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Master the art of cinematic transitions in your web productions
          </p>
        </div>

        <div className="space-y-8">
          {/* Scene 1 */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-purple-600" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold text-red-500">SCENE 1</div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  Installation
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Begin your journey with a simple installation
              </p>
              <div className="bg-black/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500 text-xs ml-2">terminal</span>
                </div>
                <pre className="text-green-400 font-mono text-sm">
                  <code>{`$ npm install @ssgoi/react
✓ Added 1 package in 2.3s`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Scene 2 */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold text-purple-500">
                  SCENE 2
                </div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  Configuration
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Set the stage with FILM transition
              </p>
              <div className="bg-black/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500 text-xs ml-2">App.tsx</span>
                </div>
                <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                  <code>{`import { Ssgoi } from '@ssgoi/react';
import { film } from '@ssgoi/react/view-transitions';

export default function App() {
  return (
    <Ssgoi
      config={{
        defaultTransition: film({
          // Optional: Fine-tune the animation
          spring: { stiffness: 150, damping: 25 }
        })
      }}
    >
      {/* Your cinematic experience */}
    </Ssgoi>
  );
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Scene 3 */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-600 to-orange-600" />
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold text-pink-500">SCENE 3</div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">
                  Action
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Wrap your scenes with transition magic
              </p>
              <div className="bg-black/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500 text-xs ml-2">
                    HomePage.tsx
                  </span>
                </div>
                <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                  <code>{`import { SsgoiTransition } from '@ssgoi/react';

export default function HomePage() {
  return (
    <SsgoiTransition id="/home">
      <div className="scene">
        {/* Your page content */}
      </div>
    </SsgoiTransition>
  );
}`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Final Cut */}
          <div className="relative bg-gradient-to-r from-red-900/20 to-purple-900/20 p-8 rounded-lg border border-purple-600/30">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                That's a Wrap!
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Your application now features cinematic FILM transitions. Every
                page change becomes a carefully crafted scene transition,
                creating an immersive experience for your audience.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="px-4 py-2 bg-black/50 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Runtime
                  </div>
                  <div className="text-white font-bold">60 FPS</div>
                </div>
                <div className="px-4 py-2 bg-black/50 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Format
                  </div>
                  <div className="text-white font-bold">Web</div>
                </div>
                <div className="px-4 py-2 bg-black/50 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Rating
                  </div>
                  <div className="text-white font-bold">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const filmRoutes: RouteConfig[] = [
  { path: "/film", component: HomePage, label: "Studio" },
  { path: "/film/features", component: FeaturesPage, label: "Tools" },
  { path: "/film/examples", component: ExamplesPage, label: "Films" },
  { path: "/film/start", component: GettingStartedPage, label: "Guide" },
];

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <a
        href="https://github.com/meursyphus/ssgoi"
        className="text-gray-300 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </a>
      <a
        href="https://www.npmjs.com/package/@ssgoi/react"
        className="text-gray-300 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
        </svg>
      </a>
    </>
  );
}

export function FilmDemo() {
  const config = {
    defaultTransition: film(),
  };

  // Custom layout with Film Studio branding
  function SSGOILayout({ children }: { children: React.ReactNode }) {
    return (
      <DemoLayout
        logo="🎬"
        title="FILM Studios"
        headerActions={<HeaderActions />}
      >
        {children}
      </DemoLayout>
    );
  }

  return (
    <BrowserMockup routes={filmRoutes} config={config} layout={SSGOILayout} />
  );
}

// Default Demo Layout Component
interface DemoLayoutProps {
  children: React.ReactNode;
  logo?: string;
  title?: string;
  headerActions?: React.ReactNode;
}

const DemoLayout = memo(
  ({
    children,
    logo = "🎬",
    title = "Film Demo",
    headerActions,
  }: DemoLayoutProps) => {
    const context = React.useContext(BrowserContext);
    const isMobile = useMobile();

    if (!context) return <>{children}</>;

    const { currentPath, navigate, routes } = context;

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className={cn("mx-auto", isMobile ? "px-3" : "max-w-6xl px-4")}>
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-4">
                <h1
                  className={cn(
                    "font-bold text-white flex items-center gap-2",
                    isMobile ? "text-base" : "text-xl",
                  )}
                >
                  <span>{logo}</span>
                  <span>{title}</span>
                </h1>
                <nav className="flex items-center gap-1">
                  {routes.map((route) => (
                    <button
                      key={route.path}
                      onClick={() => navigate(route.path)}
                      className={cn(
                        "rounded-md font-medium transition-all",
                        isMobile ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm",
                        currentPath === route.path
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      )}
                    >
                      {route.label}
                    </button>
                  ))}
                </nav>
              </div>
              {!isMobile && headerActions && (
                <div className="flex items-center gap-4">{headerActions}</div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative z-0">{children}</main>
      </div>
    );
  },
);

DemoLayout.displayName = "DemoLayout";
