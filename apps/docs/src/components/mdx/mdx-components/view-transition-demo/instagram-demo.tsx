"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { instagram } from "@ssgoi/react/view-transitions";
import {
  BrowserMockup,
  DemoPage,
  DemoLink,
  useBrowserNavigation,
} from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Mock Instagram data with local images
const instagramItems = [
  {
    id: "post-1",
    image: "/images/john-towner-JgOeRuGD_Y4-unsplash.jpg",
    likes: 1234,
  },
  {
    id: "post-2",
    image: "/images/jeremy-bishop-8xznAGy4HcY-unsplash.jpg",
    likes: 892,
  },
  {
    id: "post-3",
    image: "/images/stormseeker-rX12B5uX7QM-unsplash.jpg",
    likes: 2341,
  },
  {
    id: "post-4",
    image: "/images/rosie-sun-1L71sPT5XKc-unsplash.jpg",
    likes: 567,
  },
  {
    id: "post-5",
    image: "/images/leonardo-yip-NcWnJmeVtcw-unsplash.jpg",
    likes: 1789,
  },
  {
    id: "post-6",
    image: "/images/m-wrona-pCgxm-HDMNs-unsplash.jpg",
    likes: 3421,
  },
  {
    id: "post-7",
    image: "/images/jeremy-bishop-G9i_plbfDgk-unsplash.jpg",
    likes: 945,
  },
  {
    id: "post-8",
    image: "/images/karsten-wurth-7BjhtdogU3A-unsplash.jpg",
    likes: 2156,
  },
  {
    id: "post-9",
    image: "/images/elliott-engelmann-DjlKxYFJlTc-unsplash.jpg",
    likes: 1678,
  },
  {
    id: "post-10",
    image: "/images/clay-banks-u27Rrbs9Dwc-unsplash.jpg",
    likes: 4321,
  },
  {
    id: "post-11",
    image: "/images/breno-machado-in9-n0JwgZ0-unsplash.jpg",
    likes: 876,
  },
  {
    id: "post-12",
    image: "/images/mike-yukhtenko-wfh8dDlNFOk-unsplash.jpg",
    likes: 2987,
  },
];

// Instagram Grid Page Component
function InstagramGridPage() {
  return (
    <DemoPage path="/instagram/gallery">
      {/* Preload detail images (hidden) */}
      <div className="hidden">
        {instagramItems.map((item) => (
          <Image
            key={`preload-${item.id}`}
            src={item.image}
            alt=""
            width={800}
            height={800}
            priority
          />
        ))}
      </div>
      <div className="min-h-screen bg-[#121212] p-1">
        {/* Header */}
        <div className="mb-3 px-3 pt-3 text-center">
          <h1 className="text-base font-medium text-neutral-100 mb-1">
            Gallery
          </h1>
          <p className="text-neutral-500 text-xs">
            Tap any photo to view details
          </p>
        </div>

        {/* Instagram 3-Column Masonry Grid */}
        <div className="columns-3 gap-1">
          {instagramItems.map((item) => (
            <DemoLink
              key={item.id}
              to={`/instagram/gallery/${item.id}`}
              className="break-inside-avoid block no-underline mb-1"
            >
              <Image
                src={item.image}
                alt={`Post ${item.id}`}
                width={400}
                height={400}
                className="w-full h-auto object-cover"
                data-instagram-gallery-key={item.id}
                priority
              />
            </DemoLink>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Instagram Detail Page Component
function InstagramDetailPage({ item }: { item: (typeof instagramItems)[0] }) {
  const { navigate } = useBrowserNavigation();

  // Add keyboard navigation (ESC to go back)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/instagram/gallery");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return (
    <DemoPage path={`/instagram/gallery/${item.id}`}>
      <div className="min-h-screen bg-[#121212]">
        {/* Content */}
        <div>
          {/* Image with overlays */}
          <div className="relative">
            <Image
              src={item.image}
              alt={`Post ${item.id}`}
              width={800}
              height={800}
              className="w-full h-auto"
              data-instagram-detail-key={item.id}
            />

            {/* Back button overlay */}
            <DemoLink
              to="/instagram/gallery"
              className="absolute top-3 left-3 p-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full transition-colors no-underline"
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
          </div>

          {/* Details below image */}
          <div className="p-4">
            {/* Like section */}
            <div className="flex items-center gap-3 mb-3">
              <button className="text-neutral-200 hover:text-neutral-400 transition-colors">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button className="text-neutral-200 hover:text-neutral-400 transition-colors">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>
              <button className="text-neutral-200 hover:text-neutral-400 transition-colors">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>

            <p className="text-neutral-200 font-medium text-sm mb-2">
              {item.likes.toLocaleString()} likes
            </p>

            {/* Caption */}
            <div className="mb-3">
              <p className="text-neutral-300 text-sm">
                <span className="font-medium text-neutral-200">username</span>{" "}
                Beautiful moment captured! ✨
              </p>
            </div>

            {/* Comments */}
            <div className="space-y-2 mb-4">
              <p className="text-neutral-500 text-xs">View all 23 comments</p>
              <div className="space-y-1.5">
                <p className="text-neutral-300 text-sm">
                  <span className="font-medium text-neutral-200">user1</span>{" "}
                  Amazing! 😍
                </p>
                <p className="text-neutral-300 text-sm">
                  <span className="font-medium text-neutral-200">user2</span>{" "}
                  Love this!
                </p>
              </div>
            </div>

            {/* Time */}
            <p className="text-neutral-600 text-xs uppercase">2 hours ago</p>

            {/* Comment input */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-neutral-200 text-sm outline-none placeholder-neutral-600"
              />
              <button className="text-neutral-400 text-sm font-medium hover:text-neutral-200 transition-colors">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Create route configuration for detail pages
const detailPages = instagramItems.map((item) => ({
  path: `/instagram/gallery/${item.id}`,
  component: () => <InstagramDetailPage item={item} />,
  label: `Post ${item.id}`,
}));

// Route configuration
const instagramRoutes: RouteConfig[] = [
  {
    path: "/instagram/gallery",
    component: InstagramGridPage,
    label: "Instagram",
  },
  ...detailPages,
];

// Custom layout for Instagram demo
function InstagramLayout({ children }: { children: React.ReactNode }) {
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

// Main Instagram Demo Component
export function InstagramDemo() {
  const config = {
    transitions: [
      {
        from: "/instagram/gallery",
        to: "/instagram/gallery/*",
        transition: instagram(),
        symmetric: true,
      },
    ],
  };

  return (
    <BrowserMockup
      routes={instagramRoutes}
      config={config}
      layout={InstagramLayout}
      initialPath="/instagram/gallery"
      deviceType="mobile"
    />
  );
}
