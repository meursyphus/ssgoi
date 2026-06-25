"use client";

import { RoomShell } from "../shared/room-shell";

export default function LightPage() {
  return (
    <RoomShell
      data={{
        index: "III",
        ordinal: "03",
        title: "Light",
        artist: "Yumi Aso",
        medium: "Pigment on plaster, dawn",
        year: "2025",
        caption:
          "A single west-facing wall is repainted each morning before opening. The work only exists in the hours after the sun has cleared the building across the street.",
        bg: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=2400&q=80",
        align: "left",
      }}
    />
  );
}
