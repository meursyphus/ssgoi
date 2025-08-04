"use client";

export { SsgoiTransition } from "@ssgoi/react";

import { useMemo } from "react";
import { NavigationItem } from "@/lib/post";
import { Ssgoi as _Ssgoi } from "@ssgoi/react";
import { scroll } from "@ssgoi/react/view-transitions";
import { SsgoiConfig } from "@ssgoi/core";
import { useMobile } from "@/lib/use-mobile";

// Helper function to extract all leaf nodes from navigation tree
function extractLeafNodes(navigation: NavigationItem[]): NavigationItem[] {
  const leafNodes: NavigationItem[] = [];

  function traverse(item: NavigationItem) {
    if (!item.children || item.children.length === 0) {
      leafNodes.push(item);
    } else {
      item.children.forEach(traverse);
    }
  }

  navigation.forEach(traverse);
  return leafNodes;
}

// Create middleware that determines navigation direction based on order
function createNavigationMiddleware(navigation: NavigationItem[]) {
  const leafNodes = extractLeafNodes(navigation);
  
  // Create a map of path to index for quick lookup
  const pathToIndex = new Map<string, number>();
  leafNodes.forEach((node, index) => {
    pathToIndex.set(node.path, index);
  });

  return (from: string, to: string) => {
    const fromIndex = pathToIndex.get(from) ?? -1;
    const toIndex = pathToIndex.get(to) ?? -1;

    // If both paths are in our navigation
    if (fromIndex !== -1 && toIndex !== -1) {
      // Transform to use the demo routes for transition matching
      if (fromIndex < toIndex) {
        // Going forward in navigation
        return { from: "/demo/previous", to: "/demo/after" };
      } else {
        // Going backward in navigation
        return { from: "/demo/after", to: "/demo/previous" };
      }
    }

    // For non-adjacent or unknown paths, return as-is
    return { from, to };
  };
}

export function DocsSsgoi({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation: NavigationItem[];
}) {
  const isMobile = useMobile();
  
  const config = useMemo(() => {
    // Define the core transitions using generic paths
    const transitions: NonNullable<SsgoiConfig["transitions"]> = [
      {
        from: "/demo/previous",
        to: "/demo/after",
        transition: scroll({
          direction: "up",
          spring: { stiffness: 30, damping: 7 },
        }),
      },
      {
        from: "/demo/after",
        to: "/demo/previous",
        transition: scroll({
          direction: "down",
          spring: { stiffness: 30, damping: 7 },
        }),
      },
    ];

    return {
      transitions: isMobile ? [] : transitions,
      middleware: isMobile ? undefined : createNavigationMiddleware(navigation),
    };
  }, [navigation, isMobile]);

  return (
    <_Ssgoi config={config}>
      {children}
    </_Ssgoi>
  );
}
