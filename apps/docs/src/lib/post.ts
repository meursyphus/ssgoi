import { readdir, readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { messages } from "@/messages";

/**
 * Navigation data and post content utilities for documentation
 *
 * Usage examples:
 *
 * 1. Get navigation structure:
 *    const nav = await getNavigationData()
 *
 * 2. Get specific post by path:
 *    const post = await getPost('getting-started/what-is-ssgoi')
 *    const post = await getPost('core-concepts/dom-lifecycle')
 *
 * Note: Numeric prefixes in folder/file names (e.g., "01.getting-started") are automatically removed
 *       File extensions (.md, .mdx) are also handled automatically
 */

export interface NavigationItem {
  title: string;
  navTitle: string;
  description?: string;
  path: string;
  children?: NavigationItem[];
}

interface PostContent {
  title: string;
  description?: string;
  navTitle: string;
  content: string;
}

function removeNumberPrefix(name: string): string {
  return name.replace(/^\d+\./, "");
}

// Get the content directory path relative to the project root
function getContentPath(): string {
  return path.join(process.cwd(), "content");
}

async function processDirectory(
  dirPath: string,
  basePath: string = "",
): Promise<NavigationItem[]> {
  const items = await readdir(dirPath, { withFileTypes: true });
  const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));

  const navigation: NavigationItem[] = [];

  for (const item of sortedItems) {
    const itemPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      const folderName = removeNumberPrefix(item.name);
      const children = await processDirectory(
        itemPath,
        path.join(basePath, folderName),
      );

      if (children.length > 0) {
        navigation.push({
          title: folderName,
          navTitle: folderName,
          path: path.join(basePath, folderName),
          children,
        });
      }
    } else if (
      item.isFile() &&
      (item.name.endsWith(".md") || item.name.endsWith(".mdx"))
    ) {
      const content = await readFile(itemPath, "utf-8");
      const { data } = matter(content);

      const fileName = removeNumberPrefix(item.name).replace(/\.(md|mdx)$/, "");
      const filePath = path.join(basePath, fileName);

      navigation.push({
        title: data.title || fileName,
        navTitle: data["nav-title"] || data.navTitle || data.title || fileName,
        description: data.description,
        path: filePath,
      });
    }
  }

  return navigation;
}

/**
 * Get navigation structure
 * @returns Array of navigation items with hierarchical structure
 */
export async function getNavigationData(): Promise<NavigationItem[]> {
  try {
    const contentPath = getContentPath();
    const navigation = await processDirectory(contentPath);

    function applyTranslations(items: NavigationItem[]): NavigationItem[] {
      return items.map((item) => {
        if (item.children && item.children.length > 0) {
          // This is a category - apply translation
          const categoryTitle =
            messages.sidebar.categories[
              item.title as keyof typeof messages.sidebar.categories
            ];
          const titleString =
            typeof categoryTitle === "string" ? categoryTitle : item.title;

          return {
            ...item,
            title: titleString,
            navTitle: titleString,
            children: applyTranslations(item.children),
          };
        }
        return item;
      });
    }

    return applyTranslations(navigation);
  } catch (error) {
    console.error("Error processing navigation data:", error);
    return [];
  }
}

async function findFileByPath(
  basePath: string,
  targetPath: string,
): Promise<string | null> {
  const pathSegments = targetPath.split("/").filter(Boolean);
  let currentPath = basePath;

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    const isLastSegment = i === pathSegments.length - 1;

    try {
      const items = await readdir(currentPath, { withFileTypes: true });

      // Find matching item (folder or file)
      const matchingItem = items.find((item) => {
        const nameWithoutNumber = removeNumberPrefix(item.name);

        if (isLastSegment && item.isFile()) {
          // For the last segment, match file name without extension
          const fileNameWithoutExt = nameWithoutNumber.replace(
            /\.(md|mdx)$/,
            "",
          );
          return fileNameWithoutExt === segment;
        } else if (!isLastSegment && item.isDirectory()) {
          // For non-last segments, match folder name
          return nameWithoutNumber === segment;
        }

        return false;
      });

      if (!matchingItem) {
        return null;
      }

      currentPath = path.join(currentPath, matchingItem.name);
    } catch (error) {
      console.error("Error finding file:", error);
      return null;
    }
  }

  return currentPath;
}

/**
 * Get post content by path
 * @param postPath - Path to post without numeric prefixes or extensions (e.g., 'getting-started/what-is-ssgoi')
 * @returns Post content with metadata or null if not found
 *
 * Example:
 *   // File structure: content/01.getting-started/01.what-is-ssgoi.md
 *   const post = await getPost('getting-started/what-is-ssgoi')
 */
export async function getPost(postPath: string): Promise<PostContent | null> {
  try {
    const contentPath = getContentPath();
    const filePath = await findFileByPath(contentPath, postPath);

    if (!filePath) {
      console.error(`Post not found: ${postPath}`);
      return null;
    }

    const content = await readFile(filePath, "utf-8");
    const { data, content: markdownContent } = matter(content);

    return {
      title: data.title || "Untitled",
      description: data.description,
      navTitle: data["nav-title"] || data.navTitle || data.title || "Untitled",
      content: markdownContent,
    };
  } catch (error) {
    console.error("Error reading post:", error);
    return null;
  }
}
