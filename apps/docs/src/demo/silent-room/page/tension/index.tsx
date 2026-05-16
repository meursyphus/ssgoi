"use client";

import { RoomShell } from "../shared/room-shell";

export default function TensionPage() {
  return (
    <RoomShell
      data={{
        routeId: "/demo/silent-room/tension",
        index: "II",
        ordinal: "02",
        title: "Tension",
        artist: "Idris Møller",
        medium: "Steel cable, gravity",
        year: "2023",
        caption:
          "Three cables span the gallery from floor to ceiling, tuned just below their breaking point. The room hums. If you stand still, you can hear it disagree with itself.",
        bg: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=2400&q=80",
        align: "right",
      }}
    />
  );
}
