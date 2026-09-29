import type { Destination, ExploreVertical, ListingDetail } from "./types";

const photo = (id: string, size = "w=1200&q=80") =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${size}`;
const square = (id: string) => photo(id, "w=1200&h=1200&q=80");
const thumb = (id: string) => photo(id, "w=900&h=900&q=80");

const won = (n: number) => `₩${n.toLocaleString("en-US")}`;

type SeedRow = Omit<
  ListingDetail,
  "priceBreakdown" | "payPlans" | "priceLabel"
> & {
  /** Homes are priced per night; experiences and services per guest. */
  kind?: "stay" | "activity";
};

/** Derives the pre-formatted price and checkout labels from the total. */
function withPricing({ kind = "stay", ...row }: SeedRow): ListingDetail {
  const total = row.priceKRW;
  const half = Math.round(total / 2 / 1000) * 1000;
  const payPlans = {
    full: `Pay ${won(total)} now`,
    split: "Pay part now, part later",
    splitNote: `${won(half)} today, ${won(total - half)} charged 7 days before check-in. No extra fees.`,
  };
  if (kind === "activity") {
    const service = Math.round((total * 0.1) / 1000) * 1000;
    return {
      ...row,
      priceLabel: `${won(total - service)} / guest`,
      priceBreakdown: [
        {
          label: `${won(total - service)} x 1 guest`,
          amount: won(total - service),
        },
        { label: "Airbnb service fee", amount: won(service) },
      ],
      payPlans,
    };
  }
  const nights = 2;
  const service = Math.round((total * 0.14) / 1000) * 1000;
  const cleaning = total >= 120_000 ? 15_000 : 10_000;
  const stay = total - service - cleaning;
  return {
    ...row,
    priceLabel: `Total ${won(total)}`,
    priceBreakdown: [
      {
        label: `${won(stay / nights)} x ${nights} nights`,
        amount: won(stay),
      },
      { label: "Cleaning fee", amount: won(cleaning) },
      { label: "Airbnb service fee", amount: won(service) },
    ],
    payPlans,
  };
}

const seed: ListingDetail[] = [
  withPricing({
    id: "l-001",
    title:
      "Women only · A night in a traditional Hanok near Gyeongbokgung, Dongmyo and Gwanghwamun",
    thumbnail: thumb("1657461821555-492764a6940a"),
    region: "Hostel in Seoul",
    bedroomLabel: "24 beds",
    rating: 4.82,
    dateLabel: "Jun 12 – 14",
    badge: "Guest favourite",
    images: [
      square("1657461821555-492764a6940a"),
      photo("1618237586696-d3690dad22e3"),
      photo("1633839323577-fe4bd3079fab"),
      photo("1502672260266-1c1ef2d93688"),
      photo("1595526114035-0d45ed16cfbf"),
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
      actionLabel: "Add 1 night",
      addedLabel: "1 night added · Now through Jun 15",
    },
    priceKRW: 125_000,
    dateOptions: ["Jun 12 – 14", "Jun 19 – 21", "Jul 3 – 5"],
    refundLabel:
      "Free cancellation before Jun 11. Cancel within 24 hours of booking for a full refund.",
  }),
  withPricing({
    id: "l-002",
    title: "Arched twin room in a boutique hotel near Insadong",
    thumbnail: thumb("1667125095636-dce94dcbdd96"),
    region: "Boutique hotel in Seoul",
    bedroomLabel: "1 king bed",
    rating: 4.91,
    dateLabel: "Jun 26 – 28",
    badge: "Guest favourite",
    images: [
      square("1667125095636-dce94dcbdd96"),
      photo("1662385930165-49ebaa03b152"),
      photo("1582719478250-c89cae4dc85b"),
      photo("1631049307264-da0ec9d70304"),
      photo("1611892440504-42a792e24d32"),
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
      actionLabel: "Add breakfast",
      addedLabel: "Breakfast added for both mornings",
    },
    priceKRW: 114_000,
    dateOptions: ["Jun 26 – 28", "Jul 10 – 12", "Jul 17 – 19"],
    refundLabel: "Flexible · Full refund up to 5 days before check-in.",
  }),
  withPricing({
    id: "l-003",
    title: "Hanok guesthouse with a reading room near Seochon",
    thumbnail: thumb("1687779018338-46d350ff2e6a"),
    region: "Seoul",
    bedroomLabel: "24 beds",
    rating: 4.82,
    dateLabel: "Jun 12 – 14",
    images: [
      square("1687779018338-46d350ff2e6a"),
      photo("1522708323590-d24dbb6b0267"),
      photo("1540518614846-7eded433c457"),
      photo("1507089947368-19c1da9775ae"),
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
      actionLabel: "Add 1 night",
      addedLabel: "1 night added · Now through Jun 15",
    },
    priceKRW: 98_000,
    dateOptions: ["Jun 12 – 14", "Jun 19 – 21", "Jun 26 – 28"],
    refundLabel: "Free cancellation within 24 hours.",
  }),
  withPricing({
    id: "l-004",
    title: "Sea-view apartment above Gwangalli Beach",
    thumbnail: thumb("1702040093832-6cc011725092"),
    region: "Gwangalli Beach",
    bedroomLabel: "1 queen bed",
    rating: 4.86,
    dateLabel: "Jul 2 – 4",
    images: [
      square("1702040093832-6cc011725092"),
      photo("1560448204-e02f11c3d0e2"),
      photo("1512918728675-ed5a9ecdebfd"),
      photo("1493809842364-78817add7ffb"),
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
      actionLabel: "Add late checkout",
      addedLabel: "Late checkout added · Leave by 4pm",
    },
    priceKRW: 134_000,
    dateOptions: ["Jul 2 – 4", "Jul 9 – 11", "Aug 6 – 8"],
    refundLabel: "Flexible cancellation.",
  }),
  withPricing({
    id: "l-005",
    title: "Glamping tent by the sea in Hallim",
    thumbnail: thumb("1584345015538-213f90f9ccbc"),
    region: "Jeju",
    bedroomLabel: "1 double bed",
    rating: 4.82,
    dateLabel: "Sep 14 – 16",
    images: [
      square("1584345015538-213f90f9ccbc"),
      photo("1566665797739-1674de7a421a"),
      photo("1554995207-c18c203602cb"),
      photo("1616594039964-ae9021a400a0"),
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
      actionLabel: "Add pickup",
      addedLabel: "Pickup added · Your driver will text you",
    },
    priceKRW: 142_000,
    dateOptions: ["Sep 14 – 16", "Sep 21 – 23", "Oct 5 – 7"],
    refundLabel: "Free cancellation within 24 hours.",
  }),
  withPricing({
    id: "l-006",
    title: "Ocean-view studio steps from Haeundae Beach",
    thumbnail: thumb("1578683010236-d716f9a3f461"),
    region: "Apartment in Busan",
    bedroomLabel: "1 queen bed",
    rating: 4.93,
    dateLabel: "Jul 9 – 11",
    badge: "Guest favourite",
    images: [
      square("1578683010236-d716f9a3f461"),
      photo("1505693416388-ac5ce068fe85"),
      photo("1484154218962-a197022b5858"),
      photo("1586023492125-27b2c045efd7"),
    ],
    locationDesc: "Apartment in Busan, South Korea",
    facilityLabel: "1 queen bed · 1 private bathroom",
    reviewCount: 118,
    amenities: [
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "tv", label: "Smart TV" },
      { icon: "laundry", label: "Washer" },
    ],
    perks: {
      label: "Beach kit for ₩12,000",
      description: "Parasol, two chairs and towels waiting at the door.",
      actionLabel: "Add beach kit",
      addedLabel: "Beach kit added · Ready at check-in",
    },
    priceKRW: 156_000,
    dateOptions: ["Jul 9 – 11", "Jul 23 – 25", "Aug 13 – 15"],
    refundLabel: "Free cancellation before Jul 4.",
  }),
  withPricing({
    id: "l-007",
    title: "Whitewashed villa with a pool in Aewol",
    thumbnail: thumb("1523217582562-09d0def993a6"),
    region: "Villa in Jeju",
    bedroomLabel: "2 bedrooms",
    rating: 4.88,
    dateLabel: "Sep 21 – 23",
    images: [
      square("1523217582562-09d0def993a6"),
      photo("1564013799919-ab600027ffc6"),
      photo("1618773928121-c32242e63f39"),
      photo("1556020685-ae41abfc9365"),
    ],
    locationDesc: "Villa in Aewol, Jeju",
    facilityLabel: "2 bedrooms · 3 beds · 2 bathrooms",
    reviewCount: 64,
    amenities: [
      { icon: "wifi", label: "Wi-Fi" },
      { icon: "coffee", label: "Coffee maker" },
      { icon: "laundry", label: "Washer and dryer" },
      { icon: "tv", label: "Smart TV" },
    ],
    perks: {
      label: "Heated pool for ₩40,000",
      description: "Warm the pool for evening swims during your stay.",
      actionLabel: "Heat the pool",
      addedLabel: "Pool heating added for your stay",
    },
    priceKRW: 268_000,
    dateOptions: ["Sep 21 – 23", "Sep 28 – 30", "Oct 12 – 14"],
    refundLabel: "Free cancellation before Sep 14.",
  }),
  withPricing({
    kind: "activity",
    id: "e-001",
    title: "Cook a Korean home-style feast with a Mapo grandmother",
    thumbnail: thumb("1498654896293-37aacf113fd9"),
    region: "Cooking class in Seoul",
    bedroomLabel: "3 hours",
    rating: 4.97,
    dateLabel: "Jun 13 · 11:00",
    badge: "Original",
    images: [
      square("1498654896293-37aacf113fd9"),
      photo("1556910103-1c02745aae4d"),
      photo("1590301157890-4810ed352733"),
    ],
    locationDesc: "Experience in Mapo, Seoul",
    facilityLabel: "3 hours · Hosted in Korean and English",
    reviewCount: 212,
    amenities: [],
    perks: {
      label: "Take home the recipe book for ₩15,000",
      description: "Eight family recipes, printed and signed by your host.",
      actionLabel: "Add recipe book",
      addedLabel: "Recipe book added · Handed over after class",
    },
    priceKRW: 72_000,
    dateOptions: ["Jun 13 · 11:00", "Jun 14 · 11:00", "Jun 20 · 17:00"],
    refundLabel: "Full refund up to 24 hours before the experience.",
  }),
  withPricing({
    kind: "activity",
    id: "e-002",
    title: "Neon night walk through Jongno's hidden pojangmacha",
    thumbnail: thumb("1538485399081-7191377e8241"),
    region: "Food tour in Seoul",
    bedroomLabel: "2.5 hours",
    rating: 4.92,
    dateLabel: "Jun 12 · 19:30",
    images: [
      square("1538485399081-7191377e8241"),
      photo("1555126634-323283e090fa"),
      photo("1604908176997-125f25cc6f3d"),
    ],
    locationDesc: "Experience in Jongno, Seoul",
    facilityLabel: "2.5 hours · Up to 8 guests",
    reviewCount: 148,
    amenities: [],
    perks: {
      label: "Add a soju tasting for ₩12,000",
      description: "Three craft sojus poured by a Jongno bartender.",
      actionLabel: "Add tasting",
      addedLabel: "Soju tasting added to your walk",
    },
    priceKRW: 58_000,
    dateOptions: ["Jun 12 · 19:30", "Jun 13 · 19:30", "Jun 19 · 20:00"],
    refundLabel: "Full refund up to 24 hours before the experience.",
  }),
  withPricing({
    kind: "activity",
    id: "e-003",
    title: "Sunrise hike up Bukhansan's granite ridge",
    thumbnail: thumb("1551632811-561732d1e306"),
    region: "Hiking in Seoul",
    bedroomLabel: "5 hours",
    rating: 4.95,
    dateLabel: "Jun 15 · 05:30",
    images: [square("1551632811-561732d1e306")],
    locationDesc: "Experience in Bukhansan National Park",
    facilityLabel: "5 hours · Moderate difficulty",
    reviewCount: 87,
    amenities: [],
    perks: {
      label: "Rent hiking poles for ₩5,000",
      description: "Adjustable poles waiting at the trailhead.",
      actionLabel: "Add poles",
      addedLabel: "Hiking poles added · Pick up at the trailhead",
    },
    priceKRW: 49_000,
    dateOptions: ["Jun 15 · 05:30", "Jun 22 · 05:30", "Jun 29 · 05:30"],
    refundLabel: "Full refund if the hike is cancelled for weather.",
  }),
  withPricing({
    kind: "activity",
    id: "e-004",
    title: "Throw a moon jar at a Seochon ceramics studio",
    thumbnail: thumb("1565193566173-7a0ee3dbe261"),
    region: "Pottery class in Seoul",
    bedroomLabel: "2 hours",
    rating: 4.9,
    dateLabel: "Jun 14 · 14:00",
    badge: "Original",
    images: [square("1565193566173-7a0ee3dbe261")],
    locationDesc: "Experience in Seochon, Seoul",
    facilityLabel: "2 hours · All materials included",
    reviewCount: 64,
    amenities: [],
    perks: {
      label: "Ship your jar home for ₩25,000",
      description: "Glazed, fired and posted to you in four weeks.",
      actionLabel: "Add shipping",
      addedLabel: "Shipping added · Arrives in about 4 weeks",
    },
    priceKRW: 66_000,
    dateOptions: ["Jun 14 · 14:00", "Jun 15 · 10:00", "Jun 21 · 14:00"],
    refundLabel: "Full refund up to 24 hours before the class.",
  }),
  withPricing({
    kind: "activity",
    id: "s-001",
    title: "Private chef dinner at your stay",
    thumbnail: thumb("1577219491135-ce391730fb2c"),
    region: "Chef in Seoul",
    bedroomLabel: "4 courses",
    rating: 4.96,
    dateLabel: "Available Jun 12 – 30",
    images: [
      square("1577219491135-ce391730fb2c"),
      photo("1504674900247-0877df9cc836"),
      photo("1544025162-d76694265947"),
    ],
    locationDesc: "Service at your stay in Seoul",
    facilityLabel: "4 courses · Groceries and cleanup included",
    reviewCount: 39,
    amenities: [],
    perks: {
      label: "Add a wine pairing for ₩45,000",
      description: "Four glasses chosen for each course.",
      actionLabel: "Add wine pairing",
      addedLabel: "Wine pairing added to your dinner",
    },
    priceKRW: 190_000,
    dateOptions: ["Jun 12 · 19:00", "Jun 13 · 19:00", "Jun 14 · 18:30"],
    refundLabel: "Full refund up to 3 days before the dinner.",
  }),
  withPricing({
    kind: "activity",
    id: "s-002",
    title: "Golden-hour portrait session around Bukchon",
    thumbnail: thumb("1554048612-b6a482bc67e5"),
    region: "Photographer in Seoul",
    bedroomLabel: "1 hour",
    rating: 4.98,
    dateLabel: "Available Jun 12 – 30",
    badge: "Guest favourite",
    images: [
      square("1554048612-b6a482bc67e5"),
      photo("1516035069371-29a1b244cc32"),
    ],
    locationDesc: "Service in Bukchon, Seoul",
    facilityLabel: "1 hour · 30 edited photos in 3 days",
    reviewCount: 156,
    amenities: [],
    perks: {
      label: "Rent a hanbok for ₩30,000",
      description: "Choose a hanbok and hair accessories before the shoot.",
      actionLabel: "Add hanbok",
      addedLabel: "Hanbok added · Fitting 30 minutes before",
    },
    priceKRW: 150_000,
    dateOptions: ["Jun 12 · 18:30", "Jun 13 · 18:30", "Jun 16 · 18:45"],
    refundLabel: "Free rescheduling for rain.",
  }),
  withPricing({
    kind: "activity",
    id: "s-003",
    title: "In-stay massage after a long flight",
    thumbnail: thumb("1544161515-4ab6ce6db874"),
    region: "Massage in Seoul",
    bedroomLabel: "90 minutes",
    rating: 4.93,
    dateLabel: "Available daily",
    images: [
      square("1544161515-4ab6ce6db874"),
      photo("1600334129128-685c5582fd35"),
    ],
    locationDesc: "Service at your stay in Seoul",
    facilityLabel: "90 minutes · Table and oils brought to you",
    reviewCount: 94,
    amenities: [],
    perks: {
      label: "Add a hot stone upgrade for ₩20,000",
      description: "Warm basalt stones for the last 30 minutes.",
      actionLabel: "Add hot stones",
      addedLabel: "Hot stone upgrade added",
    },
    priceKRW: 120_000,
    dateOptions: ["Jun 12 · 21:00", "Jun 13 · 21:00", "Jun 14 · 20:00"],
    refundLabel: "Full refund up to 12 hours before.",
  }),
  withPricing({
    kind: "activity",
    id: "s-004",
    title: "Hair and makeup for your Seoul photo day",
    thumbnail: thumb("1522335789203-aabd1fc54bc9"),
    region: "Makeup artist in Seoul",
    bedroomLabel: "1 hour",
    rating: 4.89,
    dateLabel: "Available Jun 12 – 30",
    images: [square("1522335789203-aabd1fc54bc9")],
    locationDesc: "Service in Gangnam, Seoul",
    facilityLabel: "1 hour · K-beauty products included",
    reviewCount: 71,
    amenities: [],
    perks: {
      label: "Add a touch-up kit for ₩18,000",
      description: "Travel-size products matched to your look.",
      actionLabel: "Add kit",
      addedLabel: "Touch-up kit added",
    },
    priceKRW: 96_000,
    dateOptions: ["Jun 12 · 09:00", "Jun 13 · 09:00", "Jun 14 · 10:00"],
    refundLabel: "Full refund up to 24 hours before.",
  }),
];

type CollectionSeed = { title: string; unit: string; ids: string[] };

const collections: Record<string, CollectionSeed> = {
  "recently-viewed": {
    title: "Recently viewed",
    unit: "home",
    ids: ["l-003", "l-004", "l-005"],
  },
  "popular-seoul": {
    title: "Popular homes in Seoul",
    unit: "home",
    ids: ["l-001", "l-002", "l-003"],
  },
  busan: { title: "Homes in Busan", unit: "home", ids: ["l-006", "l-004"] },
  jeju: { title: "Homes in Jeju", unit: "home", ids: ["l-007", "l-005"] },
  "experiences-seoul": {
    title: "Popular experiences in Seoul",
    unit: "experience",
    ids: ["e-001", "e-002", "e-003", "e-004"],
  },
  "services-seoul": {
    title: "Services in Seoul",
    unit: "service",
    ids: ["s-001", "s-002", "s-003", "s-004"],
  },
};

type SectionSeed = {
  key: string;
  layout: "row" | "grid";
  limit: number;
};

const feeds: Record<ExploreVertical, SectionSeed[]> = {
  homes: [
    { key: "recently-viewed", layout: "row", limit: 3 },
    { key: "popular-seoul", layout: "grid", limit: 2 },
  ],
  experiences: [{ key: "experiences-seoul", layout: "grid", limit: 4 }],
  services: [{ key: "services-seoul", layout: "grid", limit: 4 }],
};

// Same URLs as the Explore card thumbnails, so the search sheet rises with its
// images already cached.
const destinations: Array<Destination & { aliases: string[] }> = [
  {
    key: "popular-seoul",
    title: "Seoul, South Korea",
    subtitle: "For sights like Gyeongbokgung Palace",
    thumbnail: thumb("1657461821555-492764a6940a"),
    aliases: ["seoul", "서울"],
  },
  {
    key: "busan",
    title: "Busan, South Korea",
    subtitle: "Popular beach destination",
    thumbnail: thumb("1702040093832-6cc011725092"),
    aliases: ["busan", "부산", "haeundae", "gwangalli"],
  },
  {
    key: "jeju",
    title: "Jeju, South Korea",
    subtitle: "Great for a weekend getaway",
    thumbnail: thumb("1584345015538-213f90f9ccbc"),
    aliases: ["jeju", "제주", "aewol", "hallim"],
  },
];

const byId = (id: string) => {
  const found = seed.find((l) => l.id === id);
  return found ? { ...found } : null;
};

const pick = (ids: string[]) =>
  ids.map(byId).filter((l): l is ListingDetail => l !== null);

export const data = {
  byId,
  byIds: pick,
  feed: (vertical: ExploreVertical) =>
    feeds[vertical].map((section) => ({
      key: section.key,
      title: collections[section.key].title,
      layout: section.layout,
      items: pick(collections[section.key].ids.slice(0, section.limit)),
    })),
  collection: (key: string) => {
    const found = collections[key];
    if (!found) return null;
    const items = pick(found.ids);
    const unit = items.length === 1 ? found.unit : `${found.unit}s`;
    return {
      key,
      title: found.title,
      subtitle: `${items.length} ${unit}`,
      items,
    };
  },
  destinations: (query: string) => {
    const q = query.trim().toLowerCase();
    return destinations
      .filter(
        (d) =>
          !q ||
          d.title.toLowerCase().includes(q) ||
          d.aliases.some((alias) => alias.includes(q)),
      )
      .map((d) => ({
        key: d.key,
        title: d.title,
        subtitle: d.subtitle,
        thumbnail: d.thumbnail,
      }));
  },
};
