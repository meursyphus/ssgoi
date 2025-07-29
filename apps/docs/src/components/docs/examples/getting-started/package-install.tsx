import { CodeTabs } from '../code-tabs';

export function PackageInstall() {
  return (
    <CodeTabs
      react={`npm install @ssgoi/react 
# 또는 yarn add @ssgoi/react 
# 또는 pnpm add @ssgoi/react`}
      svelte={`npm install @ssgoi/svelte 
# 또는 yarn add @ssgoi/svelte 
# 또는 pnpm add @ssgoi/svelte`}
    />
  );
}