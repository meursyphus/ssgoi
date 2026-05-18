import { Coffee, Tv, Wifi, WashingMachine } from "lucide-react";
import type { ListingDetail } from "@/demo/air-bnb/state/listing";

const ICONS: Record<
  ListingDetail["amenities"][number]["icon"],
  React.ReactNode
> = {
  coffee: <Coffee className="h-4 w-4 text-neutral-700" />,
  laundry: <WashingMachine className="h-4 w-4 text-neutral-700" />,
  wifi: <Wifi className="h-4 w-4 text-neutral-700" />,
  tv: <Tv className="h-4 w-4 text-neutral-700" />,
};

export function AmenitiesGrid({
  amenities,
}: {
  amenities: ListingDetail["amenities"];
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
      {amenities.map((a) => (
        <div key={a.label} className="flex items-center gap-2">
          {ICONS[a.icon]}
          <span className="text-[13px] text-neutral-800">{a.label}</span>
        </div>
      ))}
    </div>
  );
}
