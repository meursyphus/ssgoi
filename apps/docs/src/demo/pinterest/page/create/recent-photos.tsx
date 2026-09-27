"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

/** The phone's camera roll (mock). */
const PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  id: `roll-${i + 1}`,
  src: `https://picsum.photos/seed/pinterest-roll-${i + 1}/300/300`,
}));

export function RecentPhotos() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }

  return (
    <section aria-label="최근 사진" className="flex-1 border-t border-black/5">
      <h2 className="px-4 pt-4 pb-3 text-[16px] font-bold text-black">
        최근 사진
      </h2>
      <div className="grid grid-cols-3 gap-0.5 pb-24">
        {PHOTOS.map((photo) => {
          const order = selected.indexOf(photo.id);
          return (
            <button
              key={photo.id}
              type="button"
              aria-pressed={order >= 0}
              onClick={() => toggle(photo.id)}
              className="relative aspect-square overflow-hidden bg-neutral-100"
            >
              <img
                src={photo.src}
                alt=""
                width={300}
                height={300}
                className={`h-full w-full object-cover transition-transform duration-200 ${
                  order >= 0 ? "scale-90 rounded-xl" : ""
                }`}
              />
              <span
                className={`absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border-2 border-white text-[12px] font-bold text-white ${
                  order >= 0 ? "bg-[#E60023]" : "bg-black/20"
                }`}
              >
                {order >= 0 ? order + 1 : ""}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="sticky bottom-0 flex justify-center bg-gradient-to-t from-white via-white/90 to-transparent px-4 pt-6 pb-5"
          >
            <button
              type="button"
              onClick={() =>
                toast("데모에서는 실제로 핀이 만들어지지 않아요", {
                  duration: 1500,
                })
              }
              className="rounded-full bg-[#E60023] px-8 py-3 text-[15px] font-semibold text-white active:scale-95"
            >
              핀 만들기 ({selected.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
