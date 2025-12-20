"use client";

import React, { memo, useState } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { useBrowserNavigation } from "../../browser-mockup";
import { mockRecentSearches, mockSuggestions } from "./content";

// DemoPage wrapper with SsgoiTransition
interface DemoPageProps {
  children: React.ReactNode;
  path: string;
}

function DemoPage({ children, path }: DemoPageProps) {
  return <SsgoiTransition id={path}>{children}</SsgoiTransition>;
}

export const HomePage = memo(() => {
  const { navigate } = useBrowserNavigation();

  return (
    <DemoPage path="/home">
      <div className="min-h-[600px] bg-[#121212] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h1 className="text-xl font-semibold text-white">Explore</h1>
          <button
            onClick={() => navigate("/search")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-5">
          <div className="space-y-6">
            {/* Info Card */}
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-xl border border-white/10">
              <h2 className="text-base font-medium text-white mb-2">
                Depth Transition
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Click the search icon to see a Z-axis depth animation. The new
                layer appears to rise from behind.
              </p>
            </div>

            {/* Quick Actions */}
            <section>
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: "Documents",
                    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                    count: 12,
                  },
                  {
                    name: "Photos",
                    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                    count: 248,
                  },
                  {
                    name: "Videos",
                    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
                    count: 36,
                  },
                  {
                    name: "Music",
                    icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
                    count: 89,
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6 text-neutral-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={item.icon}
                      />
                    </svg>
                    <div className="text-sm font-medium text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {item.count} files
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </DemoPage>
  );
});

HomePage.displayName = "HomePage";

export const SearchPage = memo(() => {
  const { navigate } = useBrowserNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DemoPage path="/search">
      <div className="min-h-[600px] bg-[#121212] flex flex-col">
        {/* Search Header */}
        <header className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Back"
            >
              <svg
                className="w-5 h-5 text-neutral-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all"
                autoFocus
              />
            </div>
          </div>
        </header>

        {/* Search Results/Suggestions */}
        <main className="flex-1 px-5 py-5">
          {searchQuery ? (
            <div>
              <p className="text-sm text-neutral-400 mb-3">
                Searching for "<span className="text-white">{searchQuery}</span>
                "
              </p>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center">
                <svg
                  className="w-8 h-8 text-neutral-500 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-neutral-400">No results found</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Recent Searches */}
              <section>
                <h3 className="text-sm font-medium text-neutral-300 mb-3">
                  Recent Searches
                </h3>
                <div className="space-y-1">
                  {mockRecentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <svg
                        className="w-4 h-4 text-neutral-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-neutral-300">{search}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Suggestions */}
              <section>
                <h3 className="text-sm font-medium text-neutral-300 mb-3">
                  Popular Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-neutral-300 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </DemoPage>
  );
});

SearchPage.displayName = "SearchPage";
