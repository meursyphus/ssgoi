"use client";

import React from "react";
import { FadeDemo } from "./fade-demo";
import { ScrollDemo } from "./scroll-demo";

export interface ViewTransitionDemoProps {
  type: "fade" | "hero" | "pinterest" | "slide" | "scale" | "blur" | "scroll";
}

export function ViewTransitionDemo({ type }: ViewTransitionDemoProps) {
  switch (type) {
    case "fade":
      return <FadeDemo />;
    case "scroll":
      return <ScrollDemo />;
    // TODO: Add other transition types
    case "hero":
    case "pinterest":
    case "slide":
    case "scale":
    case "blur":
      return (
        <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            {type} transition demo coming soon...
          </p>
        </div>
      );
    default:
      return null;
  }
}