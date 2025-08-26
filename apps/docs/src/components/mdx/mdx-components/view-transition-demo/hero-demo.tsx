"use client";

import React from "react";
import { hero } from "@ssgoi/react/view-transitions";
import { BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Mock data for gallery
const galleryItems = [
  {
    id: "hero-1",
    title: "Mountain Vista",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    description:
      "Breathtaking mountain peaks covered in snow, reaching towards the clear blue sky.",
    photographer: "Samuel Ferrara",
    location: "Swiss Alps",
    tags: ["mountain", "snow", "landscape"],
  },
  {
    id: "hero-2",
    title: "Urban Nights",
    category: "City",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop",
    description:
      "City lights reflecting on wet streets after an evening rain, creating a vibrant urban tapestry.",
    photographer: "Alex Knight",
    location: "Tokyo, Japan",
    tags: ["city", "night", "lights"],
  },
  {
    id: "hero-3",
    title: "Ocean Waves",
    category: "Seascape",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop",
    description:
      "Powerful ocean waves crashing against rocky cliffs during golden hour.",
    photographer: "Maria Chen",
    location: "Big Sur, California",
    tags: ["ocean", "waves", "sunset"],
  },
  {
    id: "hero-4",
    title: "Desert Dunes",
    category: "Landscape",
    image:
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&h=600&fit=crop",
    description:
      "Endless sand dunes creating mesmerizing patterns under the desert sun.",
    photographer: "Robert Lee",
    location: "Sahara Desert",
    tags: ["desert", "sand", "dunes"],
  },
  {
    id: "hero-5",
    title: "Forest Path",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    description:
      "A mysterious path winding through an ancient forest filled with towering trees.",
    photographer: "Elena Woods",
    location: "Black Forest, Germany",
    tags: ["forest", "trees", "path"],
  },
  {
    id: "hero-6",
    title: "Aurora Sky",
    category: "Sky",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop",
    description:
      "Northern lights dancing across the Arctic sky in brilliant greens and blues.",
    photographer: "Nordic Vision",
    location: "Iceland",
    tags: ["aurora", "northern lights", "sky"],
  },
];

// Gallery List Page Component
function GalleryListPage() {
  return (
    <DemoPage path="/gallery" title="Photo Gallery">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Photo Gallery</h1>
          <p className="text-gray-400">
            Click any image to see the hero transition effect
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {galleryItems.map((item) => (
            <a
              key={item.id}
              href={`/gallery/${item.id}`}
              className="group cursor-pointer block"
            >
              <article>
                <div className="relative overflow-hidden rounded-lg bg-gray-800 transition-transform duration-300 hover:scale-105">
                  {/* Hero transition element */}
                  <div
                    data-hero-key={item.id}
                    className="relative aspect-[4/3]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="text-xs text-teal-400 font-medium uppercase tracking-wider">
                          {item.category}
                        </span>
                        <h3 className="text-white font-semibold text-lg mt-1">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Gallery Detail Page Components
const detailPages = galleryItems.map((item) => ({
  path: `/gallery/${item.id}`,
  component: () => (
    <DemoPage path={`/gallery/${item.id}`} title={item.title}>
      <div className="min-h-screen bg-black">
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <a
            href="/gallery"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors"
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
            <span>Back</span>
          </a>
        </div>

        {/* Full screen image with hero transition */}
        <div data-hero-key={item.id} className="relative h-screen">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain"
          />

          {/* Image info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8">
            <div className="max-w-4xl mx-auto">
              <span className="text-sm text-teal-400 font-medium uppercase tracking-wider">
                {item.category}
              </span>
              <h1 className="text-4xl font-bold text-white mt-2 mb-4">
                {item.title}
              </h1>
              <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                {item.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Photographer</span>
                  <p className="text-white font-medium">{item.photographer}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location</span>
                  <p className="text-white font-medium">{item.location}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tags</span>
                  <div className="flex gap-2 mt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 rounded text-xs text-white"
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
  ),
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
