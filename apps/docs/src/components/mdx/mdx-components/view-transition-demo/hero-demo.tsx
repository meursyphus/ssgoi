/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { hero } from "@ssgoi/react/view-transitions";
import {
  BrowserMockup,
  DemoPage,
  DemoLink,
  useBrowserNavigation,
} from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Mock data for gallery
const galleryItems = [
  {
    id: "hero-1",
    title: "Mountain Vista",
    category: "Nature",
    image: "/images/john-towner-JgOeRuGD_Y4-unsplash.jpg",
    description:
      "Breathtaking mountain peaks covered in snow, reaching towards the clear blue sky.",
    photographer: "John Towner",
    location: "Swiss Alps",
    tags: ["mountain", "snow", "landscape"],
  },
  {
    id: "hero-2",
    title: "Ocean Waves",
    category: "Seascape",
    image: "/images/jeremy-bishop-8xznAGy4HcY-unsplash.jpg",
    description:
      "Powerful ocean waves crashing against rocky cliffs during golden hour.",
    photographer: "Jeremy Bishop",
    location: "Big Sur, California",
    tags: ["ocean", "waves", "sunset"],
  },
  {
    id: "hero-3",
    title: "Storm Clouds",
    category: "Sky",
    image: "/images/stormseeker-rX12B5uX7QM-unsplash.jpg",
    description:
      "Dramatic storm clouds gathering over the horizon, creating a powerful atmosphere.",
    photographer: "Stormseeker",
    location: "Midwest, USA",
    tags: ["storm", "clouds", "sky"],
  },
  {
    id: "hero-4",
    title: "Golden Hour",
    category: "Landscape",
    image: "/images/rosie-sun-1L71sPT5XKc-unsplash.jpg",
    description:
      "Warm golden light spreading across the landscape during sunset.",
    photographer: "Rosie Sun",
    location: "California",
    tags: ["sunset", "golden", "landscape"],
  },
  {
    id: "hero-5",
    title: "Forest Path",
    category: "Nature",
    image: "/images/clay-banks-u27Rrbs9Dwc-unsplash.jpg",
    description:
      "A mysterious path winding through an ancient forest filled with towering trees.",
    photographer: "Clay Banks",
    location: "Black Forest, Germany",
    tags: ["forest", "trees", "path"],
  },
  {
    id: "hero-6",
    title: "Winter Road",
    category: "Road",
    image: "/images/karsten-wurth-7BjhtdogU3A-unsplash.jpg",
    description:
      "An endless road stretching through a winter landscape under dramatic skies.",
    photographer: "Karsten Wurth",
    location: "Iceland",
    tags: ["road", "winter", "journey"],
  },
];

// Gallery List Page Component
function GalleryListPage() {
  return (
    <DemoPage path="/gallery">
      <div className="min-h-screen bg-[#121212] p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">
            Photo Gallery
          </h1>
          <p className="text-neutral-400">
            Click any image to see the hero transition effect
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {galleryItems.map((item) => (
            <DemoLink
              key={item.id}
              to={`/gallery/${item.id}`}
              className="group cursor-pointer block no-underline"
            >
              <article>
                <div className="relative bg-white/[0.02] border border-white/5 rounded-lg transition-all duration-300 hover:bg-white/5">
                  {/* Hero transition element - no overflow hidden here */}
                  <div
                    data-hero-key={item.id}
                    className="relative aspect-[4/3]"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                      priority
                    />
                    {/* Overlay on hover with rounded corners */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h3 className="text-neutral-100 font-semibold text-lg mt-1">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </DemoLink>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Gallery Detail Page Component
function GalleryDetailPage({ item }: { item: (typeof galleryItems)[0] }) {
  const { navigate } = useBrowserNavigation();

  // Add keyboard navigation (ESC to go back)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/gallery");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return (
    <DemoPage path={`/gallery/${item.id}`}>
      <div className="min-h-screen bg-black relative">
        {/* Full screen image with hero transition */}
        <div data-hero-key={item.id} className="relative h-screen">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />

          {/* Top navigation bar overlaying the image */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <DemoLink
                to="/hero/gallery"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-neutral-100 hover:bg-white/20 transition-all no-underline"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Gallery</span>
              </DemoLink>

              {/* Close button with ESC hint */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 hidden md:block">
                  Press ESC
                </span>
                <DemoLink
                  to="/hero/gallery"
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full text-neutral-100 hover:bg-white/20 transition-all no-underline"
                  aria-label="Close"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </DemoLink>
              </div>
            </div>
          </div>

          {/* Image info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8">
            <div className="max-w-4xl mx-auto">
              <span className="text-sm text-neutral-400 font-medium uppercase tracking-wider">
                {item.category}
              </span>
              <h1 className="text-4xl font-bold text-neutral-100 mt-2 mb-4">
                {item.title}
              </h1>
              <p className="text-neutral-300 text-lg mb-6 max-w-2xl">
                {item.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-neutral-500">Photographer</span>
                  <p className="text-neutral-100 font-medium">
                    {item.photographer}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Location</span>
                  <p className="text-neutral-100 font-medium">
                    {item.location}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-500">Tags</span>
                  <div className="flex gap-2 mt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 rounded text-xs text-neutral-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Create route configuration for detail pages
const detailPages = galleryItems.map((item) => ({
  path: `/gallery/${item.id}`,
  component: () => <GalleryDetailPage item={item} />,
  label: item.title,
}));

// Route configuration
const heroRoutes: RouteConfig[] = [
  { path: "/gallery", component: GalleryListPage, label: "Gallery" },
  ...detailPages,
];

// Main Hero Demo Component
export function HeroDemo() {
  const config = {
    defaultTransition: hero(),
  };

  return <BrowserMockup routes={heroRoutes} config={config} />;
}
