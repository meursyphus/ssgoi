import React from "react";
import { TabItem, TabPanel, TabsClient } from "./tabs-client";

interface TabsProps {
  items?: TabItem[];
  children: React.ReactNode;
  defaultValue?: string;
}

export const Tabs = ({ items, children, defaultValue }: TabsProps) => {
  const safeItems = Array.isArray(items)
    ? items.filter((item): item is TabItem =>
        Boolean(
          item &&
            typeof item.label === "string" &&
            typeof item.value === "string",
        ),
      )
    : [];

  return (
    <TabsClient items={safeItems} defaultValue={defaultValue}>
      {children}
    </TabsClient>
  );
};

export { TabPanel };
