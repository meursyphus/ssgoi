"use client";

import { CoursePage } from "../shared/course-page";

export default function CinematicEyePage() {
  return (
    <CoursePage
      data={{
        eyebrow: "Cinematography",
        title: "The Cinematic Eye",
        overview:
          "Learn to see like a director of photography. Light, lens, blocking, and the language of composition — broken down shot by shot.",
        format: [
          { label: "Format", value: "Online" },
          { label: "Access", value: "Lifetime" },
          { label: "Completion", value: "Certificate" },
        ],
        contains: [
          "80+ Videos",
          "Shot-by-shot breakdowns",
          "Camera & lens deep dives",
          "Lighting setup library",
          "Monthly DP office hours",
        ],
        videoUrl:
          "https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4",
        posterUrl:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2400&q=80",
      }}
    />
  );
}
