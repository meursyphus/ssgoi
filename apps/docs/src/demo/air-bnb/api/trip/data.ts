type Reservation = { id: string; dateLabel: string; statusLabel?: string };

/** The mock user's reservations. Lives in the client module only. */
const upcoming: Reservation[] = [
  {
    id: "l-002",
    dateLabel: "Jun 26 – 28 · 2 guests",
    statusLabel: "In 3 weeks",
  },
];

const past: Reservation[] = [
  { id: "l-004", dateLabel: "Jul 2 – 4, 2024" },
  { id: "l-005", dateLabel: "Sep 14 – 16, 2024" },
];

export const data = {
  upcoming: () => upcoming.map((r) => ({ ...r })),
  past: () =>
    past
      .filter((r) => !upcoming.some((u) => u.id === r.id))
      .map((r) => ({ ...r })),
  book: (reservation: Reservation) => {
    const idx = upcoming.findIndex((r) => r.id === reservation.id);
    if (idx >= 0) upcoming.splice(idx, 1);
    upcoming.unshift(reservation);
  },
};
