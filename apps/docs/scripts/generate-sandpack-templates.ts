/**
 * Generate Sandpack Templates
 *
 * This script reads demo files from view-transition-demo/[demo-name]/ folders
 * and generates Sandpack-compatible templates.
 *
 * Each demo folder should contain:
 * - content.ts: Data/text content
 * - config.ts: Ssgoi transition config
 * - pages.tsx: Page components
 * - layout.tsx: Layout component
 * - routes.ts: Route definitions
 *
 * The script will:
 * 1. Read these files
 * 2. Transform import paths for Sandpack
 * 3. Generate App.tsx wrapper (mirrors browser-mockup logic)
 * 4. Output to demo-templates/
 *
 * Usage:
 *   pnpm generate:sandpack              # Generate all demos
 *   pnpm generate:sandpack jaemin-demo  # Generate specific demo
 *   pnpm generate:sandpack jaemin-demo fade-demo  # Generate multiple demos
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SANDPACK_HELPERS_CODE } from "./sandpack-helpers";

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

/**
 * Load demo list from sandpack.config.ts
 */
function loadDemoConfig(): string[] {
  const configPath = path.join(DEMO_DIR, "sandpack.config.ts");
  if (!fs.existsSync(configPath)) {
    console.warn("Warning: sandpack.config.ts not found");
    return [];
  }

  const content = fs.readFileSync(configPath, "utf-8");
  // Extract array from SANDPACK_DEMOS = [...]
  const match = content.match(/SANDPACK_DEMOS\s*=\s*\[([\s\S]*?)\]/);
  if (!match) {
    console.warn("Warning: Could not parse SANDPACK_DEMOS from config");
    return [];
  }

  // Parse the array items
  const items = match[1]
    .split(",")
    .map((s) => s.trim().replace(/["']/g, ""))
    .filter((s) => s && !s.startsWith("//"));

  return items;
}

// SSGOI package directories
const SSGOI_PACKAGE_DIRS = {
  "@ssgoi/core": path.join(ROOT_DIR, "packages/core/dist"),
  "@ssgoi/react": path.join(ROOT_DIR, "packages/react/dist"),
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

/**
 * Transform import paths for Sandpack environment
 */
function transformImportsForSandpack(content: string): string {
  let transformed = content;

  // Remove "use client" directive
  transformed = transformed.replace(/^["']use client["'];?\s*/m, "");

  // Transform utils import
  transformed = transformed.replace(
    /import\s*\{\s*cn\s*\}\s*from\s*["'][^"']*\/utils["'];?/g,
    'import { cn } from "./helpers";',
  );

  // Transform useMobile import
  transformed = transformed.replace(
    /import\s*\{\s*useMobile\s*\}\s*from\s*["'][^"']*\/use-mobile["'];?/g,
    'import { useMobile } from "./helpers";',
  );

  // Transform browser-mockup imports
  transformed = transformed.replace(
    /import\s*\{([^}]+)\}\s*from\s*["'][^"']*browser-mockup["'];?/g,
    (match, imports) => {
      const importList = imports
        .split(",")
        .map((s: string) => s.trim())
        .filter(
          (s: string) =>
            s && !s.includes("BrowserMockup") && !s.startsWith("type "),
        );

      if (importList.length === 0) return "";
      return `import { ${importList.join(", ")} } from "./helpers";`;
    },
  );

  // Remove type imports from browser-mockup
  transformed = transformed.replace(
    /import\s+type\s*\{[^}]+\}\s*from\s*["'][^"']*browser-mockup["'];?/g,
    "",
  );

  // Transform @ssgoi/react/view-transitions to @ssgoi/core/view-transitions
  transformed = transformed.replace(
    /@ssgoi\/react\/view-transitions/g,
    "@ssgoi/core/view-transitions",
  );

  // Transform relative imports within demo folder
  transformed = transformed.replace(
    /from\s*["']\.\/content["']/g,
    'from "./content"',
  );
  transformed = transformed.replace(
    /from\s*["']\.\/config["']/g,
    'from "./config"',
  );
  transformed = transformed.replace(
    /from\s*["']\.\/pages["']/g,
    'from "./pages"',
  );
  transformed = transformed.replace(
    /from\s*["']\.\/layout["']/g,
    'from "./layout"',
  );
  transformed = transformed.replace(
    /from\s*["']\.\/routes["']/g,
    'from "./routes"',
  );

  // Clean up multiple empty lines
  transformed = transformed.replace(/\n{3,}/g, "\n\n");

  return transformed;
}

/**
 * Generate App.tsx wrapper that mirrors browser-mockup logic
 */
function generateAppWrapper(demoName: string): string {
  const configImport = demoName.replace(/-demo$/, "Config");
  const routesImport = demoName.replace(/-demo$/, "Routes");

  return `/**
 * Sandpack App Entry - Auto-generated
 * Mirrors browser-mockup.tsx logic for Sandpack environment
 */

import React, { useState, useRef, memo } from "react";
import { Ssgoi, SsgoiTransition } from "@ssgoi/react";
import { BrowserContext, cn } from "./helpers";
import { config } from "./config";
import { routes } from "./routes";
import { DemoLayout } from "./layout";

// RouteContent component
interface RouteContentProps {
  route: typeof routes[0] | undefined;
}

const RouteContent = memo(({ route }: RouteContentProps) => {
  if (!route) return null;
  const Component = route.component;
  return <Component />;
});

RouteContent.displayName = "RouteContent";

// App component - mirrors browser-mockup internal logic
export default function App() {
  const [currentPath, setCurrentPath] = useState(routes[0]?.path || "/");
  const contentRef = useRef<HTMLDivElement>(null);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    setCurrentPath(path);
    // Notify parent window of navigation (for address bar sync)
    window.parent?.postMessage({ type: "SSGOI_NAVIGATION", path }, "*");
    // Force scroll to top
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const currentRoute = routes.find((r) => r.path === currentPath) || routes[0];

  return (
    <BrowserContext.Provider value={{ currentPath, navigate, routes }}>
      <div
        ref={contentRef}
        className="browser-content z-0 relative bg-[#121212] flex-1 overflow-auto min-h-screen"
      >
        <Ssgoi config={config}>
          <DemoLayout>
            <RouteContent route={currentRoute} />
          </DemoLayout>
        </Ssgoi>
      </div>
    </BrowserContext.Provider>
  );
}
`;
}

/**
 * Get all JS files from a directory recursively
 */
function getAllJsFiles(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllJsFiles(fullPath, files);
    } else if (entry.name.endsWith(".js")) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Load SSGOI packages from dist directories
 */
function loadSsgoiPackages(): Record<string, string> {
  const packages: Record<string, string> = {};
  let totalFiles = 0;

  for (const [pkgName, distDir] of Object.entries(SSGOI_PACKAGE_DIRS)) {
    if (!fs.existsSync(distDir)) {
      console.warn(`Warning: Package dist not found: ${distDir}`);
      console.warn(`  Run 'pnpm build' in the root directory first.`);
      continue;
    }

    // Add package.json for Sandpack module resolution
    const subExports: Record<string, { import: string }> = {
      ".": { import: "./index.js" },
    };

    const entries = fs.readdirSync(distDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subIndexPath = path.join(distDir, entry.name, "index.js");
        if (fs.existsSync(subIndexPath)) {
          subExports[`./${entry.name}`] = {
            import: `./${entry.name}/index.js`,
          };
        }
      }
    }

    packages[`/node_modules/${pkgName}/package.json`] = JSON.stringify({
      name: pkgName,
      type: "module",
      main: "./index.js",
      module: "./index.js",
      exports: subExports,
    });

    const jsFiles = getAllJsFiles(distDir);
    for (const filePath of jsFiles) {
      const relativePath = path.relative(distDir, filePath);
      const nodeModulesPath = `/node_modules/${pkgName}/${relativePath}`;
      const content = readFileIfExists(filePath);
      if (content) {
        packages[nodeModulesPath] = content;
        totalFiles++;
      }
    }
  }

  console.log(`  Loaded ${totalFiles} files from SSGOI packages`);
  return packages;
}

/**
 * Process a demo folder with the new structure
 */
function processDemoFolder(demoName: string): Record<string, string> | null {
  const demoDir = path.join(DEMO_DIR, demoName);

  if (!fs.existsSync(demoDir)) {
    console.warn(`Warning: Demo folder not found: ${demoDir}`);
    return null;
  }

  const requiredFiles = [
    "content.ts",
    "config.ts",
    "pages.tsx",
    "layout.tsx",
    "routes.ts",
  ];
  const files: Record<string, string> = {};

  // Check and read required files
  for (const fileName of requiredFiles) {
    const filePath = path.join(demoDir, fileName);
    const content = readFileIfExists(filePath);

    if (!content) {
      console.warn(`Warning: Required file not found: ${filePath}`);
      return null;
    }

    // Transform imports and add to files
    const transformed = transformImportsForSandpack(content);
    const sandpackPath = `/${fileName.replace(".ts", ".tsx").replace(".tsx", ".tsx")}`;
    files[`/${fileName}`] = transformed;
  }

  // Generate App.tsx wrapper
  files["/App.tsx"] = generateAppWrapper(demoName);

  // Add helpers
  files["/helpers.tsx"] = SANDPACK_HELPERS_CODE;

  // Add styles
  files["/styles.css"] = `
/* Styles are loaded via Tailwind CDN */
body {
  margin: 0;
  padding: 0;
  background: #121212;
  min-height: 100vh;
}
`;

  return files;
}

/**
 * Generate template file for a demo
 */
function generateTemplateFile(
  demoName: string,
  demoFiles: Record<string, string>,
  ssgoiPackages: Record<string, string>,
): string {
  const varName = demoName.replace(/-/g, "");

  return `// Auto-generated from ${demoName}/ folder
// Do not edit manually! Run 'pnpm generate:sandpack' to regenerate.

export const ${varName}Files: Record<string, string> = ${JSON.stringify(demoFiles, null, 2)};

// Local SSGOI package files (no npm fetch required)
export const ssgoiLocalPackages: Record<string, string> = ${JSON.stringify(ssgoiPackages, null, 2)};
`;
}

/**
 * Generate index file for demo-templates
 */
function generateIndexFile(demos: string[]): string {
  const imports = demos
    .map((demo) => {
      const varName = demo.replace(/-/g, "");
      return `export { ${varName}Files } from './${demo}-template';`;
    })
    .join("\n");

  return `// Auto-generated index file
// Do not edit manually!

${imports}

// Export local packages only once (same for all demos)
export { ssgoiLocalPackages } from './${demos[0]}-template';

export type DemoType = ${demos.map((d) => `'${d.replace("-demo", "")}'`).join(" | ")};
`;
}

async function main() {
  // Load demo list from config
  const DEMO_FOLDERS = loadDemoConfig();

  if (DEMO_FOLDERS.length === 0) {
    console.log("No demos configured in sandpack.config.ts");
    return;
  }

  // Parse command line arguments
  const args = process.argv.slice(2);
  const targetDemos = args.length > 0 ? args : DEMO_FOLDERS;

  // Validate target demos
  const validDemos = targetDemos.filter((demo) => {
    if (!DEMO_FOLDERS.includes(demo)) {
      console.warn(
        `Warning: '${demo}' is not in sandpack.config.ts, skipping.`,
      );
      return false;
    }
    return true;
  });

  if (validDemos.length === 0) {
    console.log("No valid demos to process.");
    console.log(`Available demos: ${DEMO_FOLDERS.join(", ")}`);
    return;
  }

  console.log("Generating Sandpack templates...\n");
  console.log(`Target demos: ${validDemos.join(", ")}\n`);

  ensureDir(OUTPUT_DIR);

  // Load SSGOI packages
  console.log("Loading SSGOI packages...");
  const ssgoiPackages = loadSsgoiPackages();
  console.log("");

  const processedDemos: string[] = [];

  // Process target demo folders
  console.log("Processing demo folders...");
  for (const demoName of validDemos) {
    const demoFiles = processDemoFolder(demoName);
    if (!demoFiles) continue;

    const templateContent = generateTemplateFile(
      demoName,
      demoFiles,
      ssgoiPackages,
    );
    const outputPath = path.join(OUTPUT_DIR, `${demoName}-template.ts`);

    fs.writeFileSync(outputPath, templateContent);
    console.log(`  Generated: ${demoName}-template.ts`);
    processedDemos.push(demoName);
  }

  // Generate/update index file with all existing templates
  const allTemplates = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith("-template.ts"))
    .map((f) => f.replace("-template.ts", ""));

  if (allTemplates.length > 0) {
    const indexContent = generateIndexFile(allTemplates);
    fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), indexContent);
    console.log(`  Updated: index.ts (${allTemplates.length} demos)`);
  }

  console.log(`\nDone! Generated ${processedDemos.length} template(s).`);

  if (Object.keys(ssgoiPackages).length === 0) {
    console.log("\nNote: No SSGOI packages were loaded.");
    console.log("Run 'pnpm build' in the root directory first.");
  }
}

main().catch(console.error);
