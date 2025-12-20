"use client";

import React, { memo } from "react";
import { SsgoiTransition } from "@ssgoi/react";

// DemoPage wrapper with SsgoiTransition
interface DemoPageProps {
  children: React.ReactNode;
  path: string;
}

function DemoPage({ children, path }: DemoPageProps) {
  return <SsgoiTransition id={path}>{children}</SsgoiTransition>;
}

export const HomePage = memo(() => {
  return (
    <DemoPage path="/home">
      <div className="min-h-[600px] bg-[#121212] pb-20 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-gray-100">Home</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <section>
              <h2 className="text-lg font-medium text-gray-200 mb-4">
                Welcome
              </h2>
              <p className="text-gray-400 leading-relaxed">
                This demo showcases the swap transition effect. Navigate between
                tabs using the bottom navigation to see smooth horizontal
                transitions between pages.
              </p>
            </section>

            <section>
              <h3 className="text-base font-medium text-gray-200 mb-3">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Morning workout", time: "8:00 AM" },
                  { title: "Team meeting", time: "10:30 AM" },
                  { title: "Lunch break", time: "12:00 PM" },
                  { title: "Project review", time: "2:00 PM" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-gray-200 font-medium">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">{item.time}</div>
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
  return (
    <DemoPage path="/search">
      <div className="min-h-[600px] bg-[#121212] pb-20 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-gray-100">Search</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-600"
              />
            </div>

            {/* Trending Topics */}
            <section>
              <h3 className="text-base font-medium text-gray-200 mb-3">
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Web Development",
                  "React",
                  "TypeScript",
                  "Design Systems",
                  "Animations",
                  "UI/UX",
                ].map((topic, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-200 hover:border-gray-600 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </section>

            {/* Recent Searches */}
            <section>
              <h3 className="text-base font-medium text-gray-200 mb-3">
                Recent Searches
              </h3>
              <div className="space-y-2">
                {[
                  "SSGOI transitions",
                  "Page animations",
                  "React hooks",
                  "Tailwind CSS",
                ].map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg border border-gray-700"
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

SearchPage.displayName = "SearchPage";

export const ProfilePage = memo(() => {
  return (
    <DemoPage path="/profile">
      <div className="min-h-[600px] bg-[#121212] pb-20 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-gray-100">Profile</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Info */}
            <section className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-100">
                  Demo User
                </h2>
                <p className="text-sm text-gray-400">demo@ssgoi.dev</p>
              </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-3 gap-4">
              {[
                { label: "Posts", value: "42" },
                { label: "Followers", value: "1.2K" },
                { label: "Following", value: "328" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center"
                >
                  <div className="text-2xl font-bold text-gray-100">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </section>

            {/* Settings */}
            <section>
              <h3 className="text-base font-medium text-gray-200 mb-3">
                Settings
              </h3>
              <div className="space-y-2">
                {[
                  "Edit Profile",
                  "Notifications",
                  "Privacy & Security",
                  "Help & Support",
                  "About",
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-left"
                  >
                    <span className="text-gray-200">{item}</span>
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </DemoPage>
  );
});

ProfilePage.displayName = "ProfilePage";
