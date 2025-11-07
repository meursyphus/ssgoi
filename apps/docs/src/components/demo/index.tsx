"use client";

import React, { useState, useEffect, useRef } from "react";
import { RouterProvider } from "./router-provider";
import DemoLayout from "./layout";
import PostsList from "./posts";
import PostDetail from "./posts/detail";
import ProductsList from "./products";
import ProductDetail from "./products/detail";
import PinterestList from "./pinterest";
import PinterestDetail from "./pinterest/detail";
import Profile from "./profile";
import FeedDetail from "./profile/feed-detail";

interface DemoProps {
  autoPlay?: boolean;
}

export default function Demo({ autoPlay = true }: DemoProps) {
  const [currentPath, setCurrentPath] = useState("/demo/posts");
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMobile();
  const layoutRef = useRef<HTMLDivElement>(null);

  // Define routing paths
  const routingPaths = [
    "/demo/posts",
    "/demo/posts/svelte-5-runes",
    "/demo/posts",
    "/demo/products",
    "/demo/products/prod-2",
    "/demo/products",
    "/demo/pinterest",
    "/demo/pinterest/pin-1",
    "/demo/pinterest",
    "/demo/profile",
    "/demo/profile/post-1",
  ];
  const currentRouteIndex = useRef(0);

  // Auto-routing effect
  useEffect(() => {
    if (!autoPlay || isHovered || isMobile) return;

    const intervalId = setInterval(() => {
      // Move to next route
      currentRouteIndex.current =
        (currentRouteIndex.current + 1) % routingPaths.length;
      setCurrentPath(routingPaths[currentRouteIndex.current]);
    }, 5000); // 3 seconds interval

    return () => clearInterval(intervalId);
  }, [autoPlay, isHovered, isMobile, routingPaths]);

  // Mouse event handlers
  useEffect(() => {
    if (!layoutRef.current) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const element = layoutRef.current;
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Custom router implementation
  const customRouter = {
    goto: (path: string) => {
      setCurrentPath(path);
    },
    currentPath,
  };

  // Render component based on current path
  const renderContent = () => {
    // Extract the path segments
    const pathSegments = currentPath.split("/").filter(Boolean);
    const section = pathSegments[1]; // posts, products, pinterest, profile
    const id = pathSegments[2]; // detail page id if exists

    // Posts routes
    if (section === "posts") {
      if (id) {
        return <PostDetail />;
      }
      return <PostsList />;
    }

    // Products routes
    if (section === "products") {
      if (id) {
        return <ProductDetail />;
      }
      return <ProductsList />;
    }

    // Pinterest routes
    if (section === "pinterest") {
      if (id) {
        return <PinterestDetail />;
      }
      return <PinterestList />;
    }

    // Profile route
    if (section === "profile") {
      if (id) {
        return <FeedDetail />;
      }
      return <Profile />;
    }

    // Default to posts
    return <PostsList />;
  };

  return (
    <div ref={layoutRef} className="h-full">
      <RouterProvider currentPath={currentPath} customRouter={customRouter}>
        <DemoLayout>{renderContent()}</DemoLayout>
      </RouterProvider>
    </div>
  );
}

function useMobile() {
  const [isMobile, setIsMobile] = useState(true); // Default to true for SSR

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    // Set initial value
    setIsMobile(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
}
