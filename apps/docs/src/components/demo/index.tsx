"use client";

import React, { useState } from "react";
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
