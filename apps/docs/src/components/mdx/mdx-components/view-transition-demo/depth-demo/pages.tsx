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
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-gray-100">Home</h1>
          <button
            onClick={() => navigate("/search")}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Search"
          >
            <svg
              className="w-6 h-6 text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <section>
              <h2 className="text-lg font-medium text-gray-200 mb-4">
                Welcome
              </h2>
              <p className="text-gray-400 leading-relaxed">
                This demo showcases the depth transition effect, inspired by
                Material Design's Z-axis motion. Click the search icon above to
                see the search interface expand from the navigation.
              </p>
            </section>

            <section>
              <h3 className="text-base font-medium text-gray-200 mb-3">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["Documents", "Photos", "Videos", "Music"].map((item) => (
                  <div
                    key={item}
                    className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="text-gray-200 font-medium">{item}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Browse {item.toLowerCase()}
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
        <header className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Back"
            >
              <svg
                className="w-5 h-5 text-gray-300"
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
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-600"
                autoFocus
              />
            </div>
          </div>
        </header>

        {/* Search Results/Suggestions */}
        <main className="flex-1 px-6 py-6">
          {searchQuery ? (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Searching for "{searchQuery}"
              </h3>
              <div className="text-gray-500 text-sm">
                No results found. Try a different search term.
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recent Searches */}
              <section>
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {mockRecentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-200">{search}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Suggestions */}
              <section>
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Popular Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-200 hover:border-gray-600 transition-colors"
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
