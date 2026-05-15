import type { NavigationItem } from "@/app/docs/sidebar";

interface NavigationLink {
  title: string;
  path: string;
}

interface NavigationLinks {
  prev: NavigationLink | null;
  next: NavigationLink | null;
}

function flattenNavigation(items: NavigationItem[]): NavigationLink[] {
  const flattened: NavigationLink[] = [];

  function traverse(items: NavigationItem[]) {
    for (const item of items) {
      // Skip group headers - items that have children are categories, not actual pages
      if (item.children && item.children.length > 0) {
        traverse(item.children);
        continue;
      }

      // Only add leaf nodes (actual content pages)
      if (item.path) {
        flattened.push({
          title: item.navTitle,
          path: item.path,
        });
      }
    }
  }

  traverse(items);
  return flattened;
}

export function findNavigationLinks(
  navigation: NavigationItem[],
  currentPath: string,
): NavigationLinks {
  const flattened = flattenNavigation(navigation);

  // Remove the docs prefix from the current path for comparison
  const normalizedCurrentPath = currentPath.replace(`/docs/`, "");

  // Find the current page index
  const currentIndex = flattened.findIndex(
    (item) => item.path === normalizedCurrentPath,
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // Get previous and next items
  const prev = currentIndex > 0 ? flattened[currentIndex - 1] : null;
  const next =
    currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null;

  return { prev, next };
}
