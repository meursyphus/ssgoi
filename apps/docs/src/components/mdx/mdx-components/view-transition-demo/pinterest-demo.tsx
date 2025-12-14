"use client";

import React, { useEffect } from "react";
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
    image: "/demo/pinterest/10-400x400.jpg",
    title: "Modern Architecture",
    author: "Alex Chen",
    authorAvatar: "/demo/pinterest/avatar-1.jpg",
    likes: 234,
    height: "h-48",
  },
  {
    id: "pin-2",
    image: "/demo/pinterest/11-400x667.jpg",
    title: "Nature Photography",
    author: "Sarah Miller",
    authorAvatar: "/demo/pinterest/avatar-2.jpg",
    likes: 512,
    height: "h-64",
  },
  {
    id: "pin-3",
    image: "/demo/pinterest/12-400x800.jpg",
    title: "Urban Exploration",
    author: "Mike Johnson",
    authorAvatar: "/demo/pinterest/avatar-3.jpg",
    likes: 189,
    height: "h-72",
  },
  {
    id: "pin-4",
    image: "/demo/pinterest/13-400x533.jpg",
    title: "Minimalist Design",
    author: "Emily Davis",
    authorAvatar: "/demo/pinterest/avatar-4.jpg",
    likes: 892,
    height: "h-56",
  },
  {
    id: "pin-5",
    image: "/demo/pinterest/14-400x1000.jpg",
    title: "Abstract Art",
    author: "David Lee",
    authorAvatar: "/demo/pinterest/avatar-5.jpg",
    likes: 445,
    height: "h-80",
  },
  {
    id: "pin-6",
    image: "/demo/pinterest/15-400x800.jpg",
    title: "Street Photography",
    author: "Alex Chen",
    authorAvatar: "/demo/pinterest/avatar-1.jpg",
    likes: 667,
    height: "h-72",
  },
  {
    id: "pin-7",
    image: "/demo/pinterest/16-400x600.jpg",
    title: "Landscape Vista",
    author: "Sarah Miller",
    authorAvatar: "/demo/pinterest/avatar-2.jpg",
    likes: 334,
    height: "h-60",
  },
  {
    id: "pin-8",
    image: "/demo/pinterest/17-400x667.jpg",
    title: "Creative Spaces",
    author: "Mike Johnson",
    authorAvatar: "/demo/pinterest/avatar-3.jpg",
    likes: 778,
    height: "h-64",
  },
  {
    id: "pin-9",
    image: "/demo/pinterest/18-400x400.jpg",
    title: "Geometric Patterns",
    author: "Emily Davis",
    authorAvatar: "/demo/pinterest/avatar-4.jpg",
    likes: 223,
    height: "h-48",
  },
  {
    id: "pin-10",
    image: "/demo/pinterest/19-400x667.jpg",
    title: "Color Theory",
    author: "David Lee",
    authorAvatar: "/demo/pinterest/avatar-5.jpg",
    likes: 556,
    height: "h-64",
  },
];

// Pinterest Grid Page Component
function PinterestGridPage() {
  return (
    <DemoPage path="/pinterest/gallery">
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
              <article className="relative group cursor-pointer">
                {/* Pin container with Pinterest transition */}
                <div className="relative bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:bg-white/5">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover"
                    data-pinterest-gallery-key={item.id}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Save button visual (not clickable since parent is a link) */}
                    <div className="absolute top-2 right-2 px-3 py-1.5 bg-white/10 border border-white/20 text-neutral-100 text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                      Save
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h3 className="text-neutral-100 font-semibold text-xs mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <img
                          src={item.authorAvatar}
                          alt={item.author}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-neutral-300 text-[10px]">
                          {item.author}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Like count (always visible) */}
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded">
                    <span className="text-neutral-100 text-[10px] font-medium">
                      ❤️ {item.likes}
                    </span>
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
      <div className="min-h-screen">
        {/* Content */}
        <div>
          {/* Image with overlays */}
          <div className="relative bg-gray-800">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-auto"
              data-pinterest-detail-key={item.id}
            />

            {/* Back button overlay */}
            <DemoLink
              to="/pinterest/gallery"
              className="absolute top-3 left-3 p-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full transition-colors no-underline"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-100"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </DemoLink>

            {/* Save button overlay */}
            <button className="absolute top-3 right-3 px-4 py-1.5 bg-white/10 border border-white/20 hover:bg-white/20 text-neutral-100 text-sm font-semibold rounded-full transition-colors">
              Save
            </button>

            {/* Like count overlay */}
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
              <span className="text-neutral-100 text-sm font-medium">
                ❤️ {item.likes}
              </span>
            </div>
          </div>

          {/* Details below image */}
          <div className="p-4">
            <h1 className="text-xl font-bold text-neutral-100 mb-3">
              {item.title}
            </h1>

            {/* Author section */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
              <img
                src={item.authorAvatar}
                alt={item.author}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="text-neutral-100 font-medium">{item.author}</p>
                <p className="text-neutral-400 text-sm">2.3k followers</p>
              </div>
              <button className="px-4 py-1.5 bg-white/5 border border-white/10 text-neutral-100 text-sm font-medium rounded-full hover:bg-white/10 transition-colors">
                Follow
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-6 text-sm text-neutral-400">
              <span>💬 42 comments</span>
              <span>🔗 15 shares</span>
              <span>👁 1.2k views</span>
            </div>

            {/* Comments section */}
            <div className="space-y-4 mb-6">
              <h3 className="text-neutral-100 font-semibold">Comments</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <img
                    src="/demo/pinterest/avatar-2.jpg"
                    alt="Commenter"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-neutral-100 text-sm">
                      <span className="font-semibold">Sarah M.</span> Beautiful
                      composition! Love the colors 🎨
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">2h ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img
                    src="/demo/pinterest/avatar-3.jpg"
                    alt="Commenter"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-neutral-100 text-sm">
                      <span className="font-semibold">Mike J.</span> Where was
                      this taken? Stunning view!
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">5h ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related pins */}
            <div>
              <h3 className="text-neutral-100 font-semibold mb-4">
                More like this
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.02] border border-white/5 rounded-lg aspect-[4/5]"></div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg aspect-[4/5]"></div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg aspect-[4/5]"></div>
                <div className="bg-white/[0.02] border border-white/5 rounded-lg aspect-[4/5]"></div>
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
    />
  );
}
