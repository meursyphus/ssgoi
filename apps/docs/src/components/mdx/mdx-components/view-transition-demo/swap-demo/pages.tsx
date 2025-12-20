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
        <header className="px-5 py-4 border-b border-white/10">
          <h1 className="text-xl font-semibold text-white">Home</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-5">
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h2 className="text-base font-medium text-white mb-2">
                Swap Transition Demo
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Navigate between tabs to see smooth horizontal transitions. The
                direction changes based on tab order.
              </p>
            </div>

            {/* Activity Section */}
            <section>
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Today's Schedule
              </h3>
              <div className="space-y-2">
                {[
                  { title: "Team standup", time: "9:00 AM", status: "done" },
                  { title: "Design review", time: "11:00 AM", status: "done" },
                  {
                    title: "Client meeting",
                    time: "2:00 PM",
                    status: "upcoming",
                  },
                  { title: "Code review", time: "4:00 PM", status: "upcoming" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${item.status === "done" ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                        <span className="text-sm text-white">{item.title}</span>
                      </div>
                      <span className="text-xs text-neutral-500">
                        {item.time}
                      </span>
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
        <header className="px-5 py-4 border-b border-white/10">
          <h1 className="text-xl font-semibold text-white">Search</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-5">
          <div className="space-y-5">
            {/* Search Input */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
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
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all"
              />
            </div>

            {/* Categories */}
            <section>
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Development", icon: "💻", count: 24 },
                  { name: "Design", icon: "🎨", count: 18 },
                  { name: "Marketing", icon: "📈", count: 12 },
                  { name: "Business", icon: "💼", count: 9 },
                ].map((cat, index) => (
                  <button
                    key={index}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg text-left hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="text-lg mb-1">{cat.icon}</div>
                    <div className="text-sm text-white">{cat.name}</div>
                    <div className="text-xs text-neutral-500">
                      {cat.count} items
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Recent */}
            <section>
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Recent Searches
              </h3>
              <div className="space-y-1">
                {["Page transitions", "Animation library", "React hooks"].map(
                  (search, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
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
                    </div>
                  ),
                )}
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
        <header className="px-5 py-4 border-b border-white/10">
          <h1 className="text-xl font-semibold text-white">Profile</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-5 py-5">
          <div className="space-y-5">
            {/* Profile Card */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                JD
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">John Doe</h2>
                <p className="text-sm text-neutral-400">Product Designer</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Projects", value: "24" },
                { label: "Followers", value: "1.2K" },
                { label: "Following", value: "312" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 text-center"
                >
                  <div className="text-lg font-semibold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Menu */}
            <section>
              <h3 className="text-sm font-medium text-neutral-300 mb-3">
                Settings
              </h3>
              <div className="space-y-1">
                {[
                  {
                    name: "Edit Profile",
                    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                  },
                  {
                    name: "Notifications",
                    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
                  },
                  {
                    name: "Privacy",
                    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  },
                  {
                    name: "Help Center",
                    icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-neutral-400"
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
                      <span className="text-sm text-neutral-200">
                        {item.name}
                      </span>
                    </div>
                    <svg
                      className="w-4 h-4 text-neutral-500"
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
