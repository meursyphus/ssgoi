"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { pinterest } from "@ssgoi/react/view-transitions";
import {
  BrowserMockup,
  DemoPage,
  DemoLink,
  useBrowserNavigation,
} from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Mock Pinterest data with local images
const pinterestItems = [
  {
    id: "pin-1",
    image: "/images/john-towner-JgOeRuGD_Y4-unsplash.jpg",
    title: "Mountain Vista",
    author: "John Towner",
    likes: 234,
    height: "h-48",
  },
  {
    id: "pin-2",
    image: "/images/jeremy-bishop-8xznAGy4HcY-unsplash.jpg",
    title: "Ocean Waves",
    author: "Jeremy Bishop",
    likes: 512,
    height: "h-64",
  },
  {
    id: "pin-3",
    image: "/images/stormseeker-rX12B5uX7QM-unsplash.jpg",
    title: "Storm Chasing",
    author: "Stormseeker",
    likes: 189,
    height: "h-72",
  },
  {
    id: "pin-4",
    image: "/images/rosie-sun-1L71sPT5XKc-unsplash.jpg",
    title: "Golden Hour",
    author: "Rosie Sun",
    likes: 892,
    height: "h-56",
  },
  {
    id: "pin-5",
    image: "/images/leonardo-yip-NcWnJmeVtcw-unsplash.jpg",
    title: "Nature Walk",
    author: "Leonardo Yip",
    likes: 445,
    height: "h-80",
  },
  {
    id: "pin-6",
    image: "/images/m-wrona-pCgxm-HDMNs-unsplash.jpg",
    title: "Urban Exploration",
    author: "M. Wrona",
    likes: 667,
    height: "h-72",
  },
  {
    id: "pin-7",
    image: "/images/jeremy-bishop-G9i_plbfDgk-unsplash.jpg",
    title: "Sunset Beach",
    author: "Jeremy Bishop",
    likes: 334,
    height: "h-60",
  },
  {
    id: "pin-8",
    image: "/images/karsten-wurth-7BjhtdogU3A-unsplash.jpg",
    title: "Road Trip",
    author: "Karsten Wurth",
    likes: 778,
    height: "h-64",
  },
  {
    id: "pin-9",
    image: "/images/elliott-engelmann-DjlKxYFJlTc-unsplash.jpg",
    title: "Winter Wonderland",
    author: "Elliott Engelmann",
    likes: 223,
    height: "h-48",
  },
  {
    id: "pin-10",
    image: "/images/clay-banks-u27Rrbs9Dwc-unsplash.jpg",
    title: "Forest Path",
    author: "Clay Banks",
    likes: 556,
    height: "h-64",
  },
];

// Pinterest Grid Page Component
function PinterestGridPage() {
  return (
    <DemoPage path="/pinterest/gallery">
      {/* Preload detail images (hidden) */}
      <div className="hidden">
        {pinterestItems.map((item) => (
          <Image
            key={`preload-${item.id}`}
            src={item.image}
            alt=""
            width={800}
            height={1200}
            priority
          />
        ))}
      </div>
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-2">
            Discover Ideas
          </h1>
          <p className="text-neutral-400 text-sm">
            Click any pin to see the Pinterest-style expand effect
          </p>
        </div>

        {/* Pinterest Masonry Grid */}
        <div className="columns-2 gap-3 space-y-3">
          {pinterestItems.map((item) => (
            <DemoLink
              key={item.id}
              to={`/pinterest/gallery/${item.id}`}
              className="break-inside-avoid block no-underline"
            >
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                  data-pinterest-gallery-key={item.id}
                  priority
                />
              </div>
            </DemoLink>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Pinterest Detail Page Component
function PinterestDetailPage({ item }: { item: (typeof pinterestItems)[0] }) {
  const { navigate } = useBrowserNavigation();

  // Add keyboard navigation (ESC to go back)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/pinterest/gallery");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return (
    <DemoPage path={`/pinterest/gallery/${item.id}`}>
      <div className="min-h-screen bg-[#121212]">
        {/* Content */}
        <div>
          {/* Image with overlays */}
          <div className="relative">
            <Image
              src={item.image}
              alt={item.title}
              width={800}
              height={1200}
              className="w-full h-auto"
              data-pinterest-detail-key={item.id}
            />

            {/* Back button overlay */}
            <DemoLink
              to="/pinterest/gallery"
              className="absolute top-3 left-3 p-2 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full transition-colors no-underline"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-200"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </DemoLink>

            {/* Save button overlay */}
            <button className="absolute top-3 right-3 px-4 py-1.5 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-neutral-200 text-sm font-medium rounded-full transition-colors">
              Save
            </button>
          </div>

          {/* Details below image */}
          <div className="p-4">
            <h1 className="text-lg font-semibold text-neutral-100 mb-3">
              {item.title}
            </h1>

            {/* Author section */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm text-white font-medium">
                  {item.author.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-neutral-200 font-medium text-sm">
                  {item.author}
                </p>
                <p className="text-neutral-500 text-xs">2.3k followers</p>
              </div>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-medium rounded-full transition-colors">
                Follow
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-5 text-xs text-neutral-500">
              <span>{item.likes} likes</span>
              <span>42 comments</span>
              <span>15 shares</span>
            </div>

            {/* Comments section */}
            <div className="space-y-3 mb-5">
              <h3 className="text-neutral-300 font-medium text-sm">Comments</h3>
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-white font-medium">
                      S
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-300 text-xs">
                      <span className="font-medium text-neutral-200">
                        Sarah M.
                      </span>{" "}
                      Beautiful composition!
                    </p>
                    <p className="text-neutral-600 text-[10px] mt-0.5">
                      2h ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] text-white font-medium">
                      M
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-300 text-xs">
                      <span className="font-medium text-neutral-200">
                        Mike J.
                      </span>{" "}
                      Where was this taken?
                    </p>
                    <p className="text-neutral-600 text-[10px] mt-0.5">
                      5h ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related pins */}
            <div>
              <h3 className="text-neutral-300 font-medium text-sm mb-3">
                More like this
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/[0.03] rounded-lg aspect-[4/5]"></div>
                <div className="bg-white/[0.03] rounded-lg aspect-[4/5]"></div>
                <div className="bg-white/[0.03] rounded-lg aspect-[4/5]"></div>
                <div className="bg-white/[0.03] rounded-lg aspect-[4/5]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Create route configuration for detail pages
const detailPages = pinterestItems.map((item) => ({
  path: `/pinterest/gallery/${item.id}`,
  component: () => <PinterestDetailPage item={item} />,
  label: item.title,
}));

// Route configuration
const pinterestRoutes: RouteConfig[] = [
  {
    path: "/pinterest/gallery",
    component: PinterestGridPage,
    label: "Pinterest",
  },
  ...detailPages,
];

// Custom layout for Pinterest demo
function PinterestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#121212] min-h-full">
      {/* Constrain width at layout level */}
      <div className="max-w-md mx-auto overflow-hidden">
        {/* Critical: relative z-0 wrapper for proper transition layering */}

        <div className="relative z-0 w-full">{children}</div>
      </div>
    </div>
  );
}

// Main Pinterest Demo Component
export function PinterestDemo() {
  const config = {
    transitions: [
      {
        from: "/pinterest/gallery",
        to: "/pinterest/gallery/*",
        transition: pinterest({ spring: { stiffness: 150, damping: 20 } }),
        symmetric: true,
      },
    ],
  };

  return (
    <BrowserMockup
      routes={pinterestRoutes}
      config={config}
      layout={PinterestLayout}
      initialPath="/pinterest/gallery"
      deviceType="mobile"
    />
  );
}
