import { User } from "lucide-react";
import { MannerTemperature } from "./manner-temperature";

export function ProfileCard() {
  return (
    <section className="bg-white px-4 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e9f5e0] text-[#2db400]">
          <User className="h-7 w-7" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <p className="text-[17px] font-bold text-gray-900">감자러버</p>
          <p className="mt-0.5 text-[12px] text-gray-500">
            둔촌동 · 동네인증 12회
          </p>
        </div>
      </div>

      <MannerTemperature />
    </section>
  );
}
