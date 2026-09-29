import { MapPin } from "lucide-react";

/** Static neighbourhood map: parks, two roads and the pickup store pin. */
export function StoreMap() {
  return (
    <div className="relative h-44 overflow-hidden bg-[#eef3e8]" aria-hidden>
      <div className="absolute -left-10 top-6 h-24 w-40 rounded-[40%] bg-[#d7ebc8]" />
      <div className="absolute -right-6 bottom-2 h-20 w-32 rounded-[45%] bg-[#d7ebc8]" />
      <div className="absolute inset-x-0 top-[58%] h-3 -rotate-6 bg-white/90" />
      <div className="absolute inset-y-0 left-[62%] w-2.5 rotate-12 bg-white/90" />
      <div className="absolute inset-y-0 left-[24%] w-1.5 -rotate-3 bg-white/70" />
      <span className="absolute left-3 top-3 text-[10px] font-medium text-[#6c8a57]">
        올림픽공원
      </span>
      <div className="absolute left-1/2 top-[44%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="mb-1 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          감자마켓 픽업존
        </span>
        <MapPin
          className="h-8 w-8 fill-[#2db400] text-white drop-shadow"
          strokeWidth={1.8}
        />
      </div>
    </div>
  );
}
