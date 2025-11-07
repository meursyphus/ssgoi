"use client";

import React from "react";
import { profile } from "./mock-data";
import { SsgoiTransition } from "@ssgoi/react";
import { Feed } from "./feed";

export default function ProfileDemo() {
  return (
    <SsgoiTransition id="/demo/profile">
      <div className="min-h-screen bg-gray-950">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 relative">
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="px-4 -mt-10 relative">
            {/* Avatar */}
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-full border-4 border-gray-950 bg-gray-900"
            />

            {/* Profile Details */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#1DA1F2"
                  >
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-3">{profile.username}</p>
              <p className="text-gray-300 text-sm mb-4">{profile.bio}</p>

              {/* Stats */}
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <span className="block text-lg font-bold text-white">
                    {profile.posts}
                  </span>
                  <span className="block text-sm text-gray-400">Posts</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-white">
                    {profile.followers.toLocaleString()}
                  </span>
                  <span className="block text-sm text-gray-400">Followers</span>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-white">
                    {profile.following.toLocaleString()}
                  </span>
                  <span className="block text-sm text-gray-400">Following</span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-col gap-2 text-sm text-gray-400 mb-6">
                <span>📍 {profile.location}</span>
                <span>
                  🔗{" "}
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener"
                    className="text-teal-400 hover:underline"
                  >
                    {profile.website.replace("https://", "")}
                  </a>
                </span>
              </div>

              {/* Follow Button */}
              <button className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-200">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Posts Section - Instagram Style Feed */}
        <div className="mt-8 pb-8">
          <Feed />
        </div>
      </div>
    </SsgoiTransition>
  );
}
