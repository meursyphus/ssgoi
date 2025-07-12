import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagePath = path.resolve(__dirname, '../package.json');

// Original package.json configuration for development
const devPackageJson = {
  "name": "@meursyphus/ssgoi-react",
  "version": "0.0.1",
  "type": "module",
  "files": [
    "dist",
    "src"
  ],
  "main": "./src/lib/index.ts",
  "module": "./src/lib/index.ts",
  "types": "./src/lib/index.ts",
  "exports": {
    ".": {
      "import": "./src/lib/index.ts",
      "require": "./src/lib/index.ts",
      "types": "./src/lib/index.ts"
    }
  },
  "scripts": {
    "dev": "vite build --watch",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "package": "vite build",
    "prepublishOnly": "pnpm run build && node scripts/prepare-publish.js",
    "postpublish": "node scripts/restore-package.js"
  },
  "peerDependencies": {
    "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
    "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.30.1",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.6.0",
    "eslint": "^9.30.1",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.35.1",
    "vite": "^7.0.4",
    "vite-plugin-dts": "^4.5.4"
  }
};

// Write the original package.json
fs.writeFileSync(packagePath, JSON.stringify(devPackageJson, null, 2) + '\n');

console.log('✅ package.json restored for development');