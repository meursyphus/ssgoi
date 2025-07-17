"use client";

import React, { useState, useRef } from "react";
import { RouterProvider } from "./router-provider";
import DemoLayout from "./layout";
import PostsList from "./posts";
import PostDetail from "./posts/detail";
import ProductsList from "./products";
import ProductDetail from "./products/detail";
import PinterestList from "./pinterest";
import PinterestDetail from "./pinterest/detail";
import Profile from "./profile";

export default function Demo() {
  const [currentPath, setCurrentPath] = useState("/demo/posts");
  const scrollPositions = useRef<Record<string, number>>({});

  // Find scrollable element by ID
  const findScrollableElement = () => {
    return document.getElementById("demo-content");
  };

  // Save scroll position for current path
  const saveScrollPosition = () => {
    const scrollableEl = findScrollableElement();
    if (scrollableEl) {
      scrollPositions.current[currentPath] = scrollableEl.scrollTop;
    }
  };

  // Restore scroll position for a given path
  const restoreScrollPosition = (path: string) => {
    const scrollableEl = findScrollableElement();
    if (scrollableEl) {
      const savedPosition = scrollPositions.current[path] || 0;
      // Use requestAnimationFrame to ensure DOM is updated
      scrollableEl.scrollTop = savedPosition;
    }
  };

  // Custom router implementation
  const customRouter = {
    goto: (path: string) => {
      // Save current scroll position before navigation
      saveScrollPosition();

      // Update path
      setCurrentPath(path);

      // Restore scroll position after navigation
      // Use setTimeout to ensure React has updated the DOM
      restoreScrollPosition(path);
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
      return <Profile />;
    }

    // Default to posts
    return <PostsList />;
  };

  return (
    <RouterProvider currentPath={currentPath} customRouter={customRouter}>
      <DemoLayout>{renderContent()}</DemoLayout>
    </RouterProvider>
  );
}
