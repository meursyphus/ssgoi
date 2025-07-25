"use client";

import { useState, createContext, useContext } from "react";

// Tab Context
const TabContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  items: TabItem[];
  children: React.ReactNode;
  defaultValue?: string;
}

export const Tabs = ({ items, children, defaultValue }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(
    defaultValue || items[0]?.value || ""
  );

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="my-6">
        <div className="flex border-b border-zinc-800">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === item.value
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
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

  return (
    <div
      className="transition-opacity duration-200"
      style={{
        animation: "fadeIn 0.2s ease-in-out",
      }}
    >
      {children}
    </div>
  );
};
