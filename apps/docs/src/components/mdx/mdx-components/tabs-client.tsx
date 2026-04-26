"use client";

import React, {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
} from "react";

const TabContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

export interface TabItem {
  label: string;
  value: string;
}

interface TabsClientProps {
  items: TabItem[];
  children: React.ReactNode;
  defaultValue?: string;
}

function formatTabLabel(value: string) {
  const specialLabels: Record<string, string> = {
    angular: "Angular",
    react: "React",
    solid: "Solid.js",
    svelte: "Svelte",
    vue: "Vue",
  };

  return (
    specialLabels[value] ??
    value
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function getItemsFromChildren(children: React.ReactNode): TabItem[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ value?: string }>(child)) {
      return [];
    }

    const value = child.props.value;
    if (typeof value !== "string" || value.length === 0) {
      return [];
    }

    return [{ value, label: formatTabLabel(value) }];
  });
}

export const TabsClient = ({
  items,
  children,
  defaultValue,
}: TabsClientProps) => {
  const safeItems = items.length > 0 ? items : getItemsFromChildren(children);
  const [activeTab, setActiveTab] = useState(
    defaultValue || safeItems[0]?.value || "",
  );

  if (safeItems.length === 0) {
    return <div className="my-6">{children}</div>;
  }

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="my-6">
        <div className="flex border-b border-zinc-800">
          {safeItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === item.value
                  ? "text-white"
                  : "text-zinc-300 hover:text-zinc-100"
              }`}
            >
              {item.label}
              {activeTab === item.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </TabContext.Provider>
  );
};

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
}

export const TabPanel = ({ value, children }: TabPanelProps) => {
  const context = useContext(TabContext);

  if (!context) {
    console.warn("TabPanel must be used within a Tabs component");
    return null;
  }

  if (context.activeTab !== value) {
    return null;
  }

  return <div>{children}</div>;
};
