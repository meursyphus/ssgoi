"use client";

export { SsgoiTransition } from "@ssgoi/react";

import { useMemo } from "react";
import { NavigationItem } from "@/lib/post";
import { Ssgoi as _Ssgoi } from "@ssgoi/react";
import { scroll } from "@ssgoi/react/view-transitions";
import { SsgoiConfig } from "@ssgoi/core";
import { useMobile } from "@/lib/use-mobile";

// Helper function to create transitions between adjacent pages
function createAdjacentTransitions(
  navigation: NavigationItem[]
): SsgoiConfig["transitions"] {
  // Extract leaf nodes
  const leafNodes: NavigationItem[] = [];

  function traverse(item: NavigationItem) {
    if (!item.children || item.children.length === 0) {
      leafNodes.push(item);
    } else {
      item.children.forEach(traverse);
    }
  }

  navigation.forEach(traverse);

  // Create transitions
  const transitions: SsgoiConfig["transitions"] = [];

  for (let i = 0; i < leafNodes.length - 1; i++) {
    const current = leafNodes[i];
    const next = leafNodes[i + 1];

    // Forward transition (current -> next)
    transitions.push({
      from: current.path,
      to: next.path,
      transition: scroll({
        direction: "up",
        spring: { stiffness: 20, damping: 7 },
      }),
    });

    // Backward transition (next -> current)
    transitions.push({
      from: next.path,
      to: current.path,
      transition: scroll({
        direction: "down",
        spring: { stiffness: 20, damping: 7 },
      }),
    });
  }

  return transitions;
}

export function DocsSsgoi({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation: NavigationItem[];
}) {
  const isMobile = useMobile();
  const transitions = useMemo(
    () => createAdjacentTransitions(navigation),
    [navigation]
  );

  return (
    <_Ssgoi
      config={{
        transitions: isMobile ? [] : transitions,
      }}
    >
      {children}
    </_Ssgoi>
  );
}
