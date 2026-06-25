"use client";

import { RoomShell } from "../shared/room-shell";

export default function StillnessPage() {
  return (
    <RoomShell
      data={{
        index: "I",
        ordinal: "01",
        title: "Stillness",
        artist: "Hana Volkov",
        medium: "Marble, breath",
        year: "2024",
        caption:
          "A single block of unfinished marble holds the room. The work was never carved — its weight is the subject. Visitors are asked to enter without speaking.",
        bg: "https://images.unsplash.com/photo-1545987796-200677ee1cdb?auto=format&fit=crop&w=2400&q=80",
        align: "left",
      }}
    />
  );
}
