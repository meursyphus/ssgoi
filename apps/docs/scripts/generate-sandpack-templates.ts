/**
 * Generate Sandpack Templates
 *
 * This script reads demo files from view-transition-demo/ and converts them to
 * string templates for use with Sandpack. It also bundles local SSGOI package
 * dist files so Sandpack doesn't need to fetch from npm.
 *
 * Usage: pnpm generate:sandpack
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "../../..");
const DOCS_DIR = path.resolve(__dirname, "..");
const DEMO_DIR = path.join(
  DOCS_DIR,
  "src/components/mdx/mdx-components/view-transition-demo",
);
const OUTPUT_DIR = path.join(
  DOCS_DIR,
  "src/components/mdx/mdx-components/demo-templates",
);

// Demo files to process
const DEMO_FILES = [
  "fade-demo",
  "scroll-demo",
  "hero-demo",
  "drill-demo",
  "slide-demo",
  "blind-demo",
  "strip-demo",
  "jaemin-demo",
  "rotate-demo",
  "sheet-demo",
  "pinterest-demo",
  "instagram-demo",
];

// SSGOI package paths for local dependencies
const SSGOI_PACKAGES = {
  "@ssgoi/core": path.join(ROOT_DIR, "packages/core/dist/index.js"),
  "@ssgoi/core/transitions": path.join(
    ROOT_DIR,
    "packages/core/dist/transitions/index.js",
  ),
  "@ssgoi/core/view-transitions": path.join(
    ROOT_DIR,
    "packages/core/dist/view-transitions/index.js",
  ),
  "@ssgoi/react": path.join(ROOT_DIR, "packages/react/dist/index.js"),
  "@ssgoi/react/view-transitions": path.join(
    ROOT_DIR,
    "packages/react/dist/view-transitions/index.js",
  ),
  "@ssgoi/react/transitions": path.join(
    ROOT_DIR,
    "packages/react/dist/transitions/index.js",
  ),
};

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readFileIfExists(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function generateDemoTemplate(demoName: string): string | null {
  // First, check for a self-contained -sandpack.tsx version
  const sandpackFilePath = path.join(
    DEMO_DIR,
    `${demoName.replace("-demo", "")}-sandpack.tsx`,
  );
  let content = readFileIfExists(sandpackFilePath);

  if (content) {
    console.log(`  Using sandpack version: ${sandpackFilePath}`);
    return content;
  }

  // Fall back to regular demo file
  const filePath = path.join(DEMO_DIR, `${demoName}.tsx`);
  content = readFileIfExists(filePath);

  if (!content) {
    console.warn(`Warning: Demo file not found: ${filePath}`);
    return null;
  }

  console.log(
    `  Warning: ${demoName} has no -sandpack.tsx version, using original (may not work in Sandpack)`,
  );
  return content;
}

function loadSsgoiPackages(): Record<string, string> {
  const packages: Record<string, string> = {};

  for (const [pkgName, pkgPath] of Object.entries(SSGOI_PACKAGES)) {
    const content = readFileIfExists(pkgPath);
    if (content) {
      // Convert to node_modules path format
      const nodeModulesPath = `/node_modules/${pkgName}/index.js`;
      packages[nodeModulesPath] = content;
    } else {
      console.warn(`Warning: Package dist not found: ${pkgPath}`);
      console.warn(
        `  Run 'pnpm build' in the root directory to build packages first.`,
      );
    }
  }

  return packages;
}

function generateTemplateFile(
  demoName: string,
  demoContent: string,
  ssgoiPackages: Record<string, string>,
): string {
  const varName = demoName.replace(/-/g, "");

  return `// Auto-generated from ${demoName}.tsx
// Do not edit manually! Run 'pnpm generate:sandpack' to regenerate.

export const ${varName}Files = {
  "/App.tsx": ${JSON.stringify(demoContent)},
  "/styles.css": \`
/* Styles are loaded via Tailwind CDN */
body {
  margin: 0;
  padding: 0;
  background: #121212;
  min-height: 100vh;
}
\`,
};

// Local SSGOI package files (no npm fetch required)
export const ssgoiLocalPackages = ${JSON.stringify(ssgoiPackages, null, 2)};
`;
}

function generateIndexFile(demos: string[]): string {
  const imports = demos
    .map((demo) => {
      const varName = demo.replace(/-/g, "");
      return `export { ${varName}Files } from './${demo}-template';`;
    })
    .join("\n");

  // Export ssgoiLocalPackages only once from the first demo
  const firstDemo = demos[0].replace(/-/g, "");

  return `// Auto-generated index file
// Do not edit manually!

${imports}

// Export local packages only once (same for all demos)
export { ssgoiLocalPackages } from './${demos[0]}-template';

export type DemoType = ${demos.map((d) => `'${d.replace("-demo", "")}'`).join(" | ")};
`;
}

async function main() {
  console.log("Generating Sandpack templates...\n");

  // Ensure output directory exists
  ensureDir(OUTPUT_DIR);

  // Load SSGOI packages
  console.log("Loading SSGOI package dist files...");
  const ssgoiPackages = loadSsgoiPackages();
  const loadedCount = Object.keys(ssgoiPackages).length;
  console.log(
    `  Loaded ${loadedCount}/${Object.keys(SSGOI_PACKAGES).length} packages\n`,
  );

  // Process demo files
  const processedDemos: string[] = [];

  for (const demoName of DEMO_FILES) {
    const demoContent = generateDemoTemplate(demoName);
    if (!demoContent) continue;

    const templateContent = generateTemplateFile(
      demoName,
      demoContent,
      ssgoiPackages,
    );
    const outputPath = path.join(OUTPUT_DIR, `${demoName}-template.ts`);

    fs.writeFileSync(outputPath, templateContent);
    console.log(`  Generated: ${demoName}-template.ts`);
    processedDemos.push(demoName);
  }

  // Generate index file
  if (processedDemos.length > 0) {
    const indexContent = generateIndexFile(processedDemos);
    fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), indexContent);
    console.log(`  Generated: index.ts`);
  }

  console.log(`\nDone! Generated ${processedDemos.length} templates.`);

  if (loadedCount === 0) {
    console.log("\nNote: No SSGOI packages were loaded.");
    console.log(
      "Run 'pnpm build' in the root directory to build packages first.",
    );
  }
}

main().catch(console.error);
