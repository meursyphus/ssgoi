import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagePath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

// Update package.json for publishing
const publishPackageJson = {
  ...packageJson,
  main: './dist/ssgoi-react.umd.js',
  module: './dist/ssgoi-react.es.js',
  types: './dist/index.d.ts',
  exports: {
    '.': {
      import: './dist/ssgoi-react.es.js',
      require: './dist/ssgoi-react.umd.js',
      types: './dist/index.d.ts'
    }
  },
  files: ['dist']
};

// Remove scripts that are not needed in published package
delete publishPackageJson.scripts.prepublishOnly;

// Write the modified package.json
fs.writeFileSync(packagePath, JSON.stringify(publishPackageJson, null, 2) + '\n');

console.log('✅ package.json prepared for publishing');