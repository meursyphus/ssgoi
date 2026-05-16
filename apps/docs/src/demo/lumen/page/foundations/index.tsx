"use client";

import { CoursePage } from "../shared/course-page";

export default function FoundationsPage() {
  return (
    <CoursePage
      data={{
        routeId: "/demo/lumen",
        eyebrow: "Documentary",
        title: "Foundations",
        overview:
          "A step-by-step guide to finishing a film. From finding a story to getting into film festivals — taught by the directors who got there first.",
        format: [
          { label: "Format", value: "Online" },
          { label: "Access", value: "Lifetime" },
          { label: "Completion", value: "Certificate" },
        ],
        contains: [
          "60+ Videos",
          "Monthly industry calls",
          "Savings on gear & software",
          "Exclusive community group",
          "Access to private job board",
        ],
        videoUrl:
          "https://videos.pexels.com/video-files/3576378/3576378-uhd_2560_1440_30fps.mp4",
        posterUrl:
          "https://images.unsplash.com/photo-1505533321630-975218a5f66f?auto=format&fit=crop&w=2400&q=80",
      }}
    />
  );
}
