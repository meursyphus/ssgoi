import { CalendarDays, MapPin } from "lucide-react";
import type { ProductDetail } from "@/demo/gamja-market/state/product";

export function PickupInfo({ product }: { product: ProductDetail }) {
  return (
    <section className="mt-2 bg-white px-4 py-5">
      <h2 className="text-[13px] font-semibold text-gray-900">픽업 안내</h2>
      <ul className="mt-3 space-y-2.5">
        <li className="flex items-start gap-2 text-[13px] text-gray-700">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#2db400]" />
          <span className="font-medium">{product.pickupDate}</span>
        </li>
        <li className="flex items-start gap-2 text-[13px] text-gray-700">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2db400]" />
          <span>{product.pickupPlace}</span>
        </li>
      </ul>
      <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-[12px] leading-relaxed text-gray-600">
        {product.notice}
      </p>
    </section>
  );
}
