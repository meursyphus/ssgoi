import type { ListingDetail } from "./types";

const seed: ListingDetail[] = [
  {
    id: "l-001",
    title:
      "Women only · A night in a traditional Hanok near Gyeongbokgung, Dongmyo and Gwanghwamun",
    thumbnail:
      "https://images.unsplash.com/photo-1657461821555-492764a6940a?auto=format&fit=crop&w=900&q=80",
    region: "Hostel in Seoul",
    bedroomLabel: "24 beds",
    rating: 4.82,
    priceLabel: "Total ₩125,000",
    dateLabel: "Jun 12 – 14",
    badge: "Guest favourite",
    images: [
      "https://images.unsplash.com/photo-1657461821555-492764a6940a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618237586696-d3690dad22e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633839323577-fe4bd3079fab?auto=format&fit=crop&w=1200&q=80",
    ],
    locationDesc: "Room in Seoul, South Korea",
    facilityLabel: "12 bunk beds · 3 shared bathrooms",
    reviewCount: 56,
    amenities: [
      { icon: "coffee", label: "Coffee maker" },
      { icon: "laundry", label: "Washer and dryer" },
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "tv", label: "Smart TV" },
    ],
    perks: {
      label: "Add 1 more night for ₩49,000",
      description:
        "A special rate is available to extend your stay through Jun 15.",
    },
    priceKRW: 125_000,
    refundLabel:
      "Free cancellation before Jun 11. Cancel within 24 hours of booking for a full refund.",
  },
  {
    id: "l-002",
    title: "Boutique hotel in Seoul",
    thumbnail:
      "https://images.unsplash.com/photo-1667125095636-dce94dcbdd96?auto=format&fit=crop&w=900&q=80",
    region: "Boutique hotel in Seoul",
    bedroomLabel: "1 king bed",
    rating: 4.91,
    priceLabel: "Total ₩114,000",
    dateLabel: "Jun 26 – 28",
    badge: "Guest favourite",
    images: [
      "https://images.unsplash.com/photo-1667125095636-dce94dcbdd96?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1662385930165-49ebaa03b152?auto=format&fit=crop&w=1200&q=80",
    ],
    locationDesc: "Hotel in Seoul, South Korea",
    facilityLabel: "1 king bed · 1 private bathroom",
    reviewCount: 91,
    amenities: [
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "tv", label: "Smart TV" },
      { icon: "coffee", label: "Espresso machine" },
      { icon: "laundry", label: "Private laundry" },
    ],
    perks: {
      label: "Add the breakfast set for ₩30,000",
      description:
        "Limited slots — a host-curated breakfast served in the lobby.",
    },
    priceKRW: 114_000,
    refundLabel: "Flexible · Full refund up to 5 days before check-in.",
  },
  {
    id: "l-003",
    title: "Seoul",
    thumbnail:
      "https://images.unsplash.com/photo-1687779018338-46d350ff2e6a?auto=format&fit=crop&w=900&q=80",
    region: "Seoul",
    bedroomLabel: "24 beds",
    rating: 4.82,
    priceLabel: "Recently viewed",
    dateLabel: "Jun 12 – 14",
    images: [
      "https://images.unsplash.com/photo-1687779018338-46d350ff2e6a?auto=format&fit=crop&w=1200&q=80",
    ],
    locationDesc: "Room in Seoul, South Korea",
    facilityLabel: "12 bunk beds · 3 shared bathrooms",
    reviewCount: 41,
    amenities: [
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "coffee", label: "Coffee maker" },
    ],
    perks: {
      label: "Add 1 more night for ₩39,000",
      description: "Weekend-only extension rate.",
    },
    priceKRW: 98_000,
    refundLabel: "Free cancellation within 24 hours.",
  },
  {
    id: "l-004",
    title: "Gwangalli Beach",
    thumbnail:
      "https://images.unsplash.com/photo-1702040093832-6cc011725092?auto=format&fit=crop&w=900&q=80",
    region: "Gwangalli Beach",
    bedroomLabel: "1 queen bed",
    rating: 4.86,
    priceLabel: "Recently viewed",
    dateLabel: "Jul 02 – 04",
    images: [
      "https://images.unsplash.com/photo-1702040093832-6cc011725092?auto=format&fit=crop&w=1200&q=80",
    ],
    locationDesc: "Apartment in Busan, South Korea",
    facilityLabel: "1 queen bed · 1 private bathroom",
    reviewCount: 32,
    amenities: [
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "tv", label: "Smart TV" },
    ],
    perks: {
      label: "Late checkout for ₩25,000",
      description: "Stay until 4pm on your last day.",
    },
    priceKRW: 134_000,
    refundLabel: "Flexible cancellation.",
  },
  {
    id: "l-005",
    title: "Jeju",
    thumbnail:
      "https://images.unsplash.com/photo-1584345015538-213f90f9ccbc?auto=format&fit=crop&w=900&q=80",
    region: "Jeju",
    bedroomLabel: "1 double bed",
    rating: 4.82,
    priceLabel: "Recently viewed",
    dateLabel: "Sep 14 – 16",
    images: [
      "https://images.unsplash.com/photo-1584345015538-213f90f9ccbc?auto=format&fit=crop&w=1200&q=80",
    ],
    locationDesc: "Stay in Hallim, Jeju",
    facilityLabel: "1 double bed · 1 private bathroom",
    reviewCount: 27,
    amenities: [
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "coffee", label: "Pour-over coffee" },
    ],
    perks: {
      label: "Airport pickup for ₩18,000",
      description: "Driver meets you at Jeju International Airport.",
    },
    priceKRW: 142_000,
    refundLabel: "Free cancellation within 24 hours.",
  },
];

const feedOrder = {
  recent: ["l-003", "l-004", "l-005"],
  popular: ["l-001", "l-002"],
};

export const data = {
  feed: () => ({
    recent: feedOrder.recent
      .map((id) => seed.find((l) => l.id === id))
      .filter(Boolean)
      .map((l) => ({ ...(l as ListingDetail) })),
    popular: feedOrder.popular
      .map((id) => seed.find((l) => l.id === id))
      .filter(Boolean)
      .map((l) => ({ ...(l as ListingDetail) })),
  }),
  byId: (id: string) => {
    const found = seed.find((l) => l.id === id);
    return found ? { ...found } : null;
  },
};
