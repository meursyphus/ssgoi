'use client';

import { Tabs, TabPanel } from '@/components/docs/mdx-components/tabs';

interface CodeTabsProps {
  react: string;
  svelte: string;
}

export function CodeTabs({ react, svelte }: CodeTabsProps) {
  return (
    <Tabs items={[{ label: "React", value: "react" }, { label: "Svelte", value: "svelte" }]}>
      <TabPanel value="react">
        {`\`\`\`jsx\n${react}\n\`\`\``}
      </TabPanel>
      <TabPanel value="svelte">
        {`\`\`\`svelte\n${svelte}\n\`\`\``}
      </TabPanel>
    </Tabs>
  );
}