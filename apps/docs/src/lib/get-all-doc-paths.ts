import { promises as fs } from "fs";
import path from "path";

export async function getAllDocPaths(): Promise<string[]> {
  const contentDir = path.join(process.cwd(), "content", "en");
  const docPaths: string[] = [];

  async function traverseDir(dir: string, relativePath: string = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively traverse subdirectories
        const newRelativePath = relativePath
          ? `${relativePath}/${entry.name.replace(/^\d+\./, "")}`
          : entry.name.replace(/^\d+\./, "");
        await traverseDir(fullPath, newRelativePath);
      } else if (entry.name.endsWith(".mdx")) {
        // Process MDX files
        const fileName = entry.name
          .replace(/^\d+-?/, "") // Remove number prefix
          .replace(".mdx", ""); // Remove extension

        const docPath = relativePath ? `${relativePath}/${fileName}` : fileName;

        docPaths.push(docPath);
      }
    }
  }

  await traverseDir(contentDir);
  return docPaths;
}
