import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagePath = path.resolve(__dirname, '../package.json');
const currentPackageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

// Restore development configuration
const devPackageJson = {
  ...currentPackageJson,
  main: './src/lib/index.ts',
  module: './src/lib/index.ts',
  types: './src/lib/index.ts',
  exports: {
    '.': {
      import: './src/lib/index.ts',
      require: './src/lib/index.ts',
      types: './src/lib/index.ts'
    }
  },
  files: ['dist', 'src'],
  scripts: {
    ...currentPackageJson.scripts,
    prepublishOnly: 'pnpm run build && node scripts/prepare-publish.js',
    postpublish: 'node scripts/restore-package.js'
  }
};

// Write the original package.json
fs.writeFileSync(packagePath, JSON.stringify(devPackageJson, null, 2) + '\n');

console.log('✅ package.json restored for development');