"use client";

import { Star } from "lucide-react";

const LABELS = ["별로예요", "그저 그래요", "괜찮아요", "좋아요", "최고예요"];

export function RatingStars({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 bg-white px-4 py-8">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= rating;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={`${n}점`}
              className="rounded-full p-0.5 transition-transform active:scale-90"
            >
              <Star
                className={
                  filled
                    ? "h-10 w-10 fill-amber-400 text-amber-400"
                    : "h-10 w-10 text-gray-300"
                }
              />
            </button>
          );
        })}
      </div>
      <p className="h-5 text-[13px] font-medium text-gray-600">
        {rating > 0 ? LABELS[rating - 1] : "별점을 눌러 평가해 주세요"}
      </p>
    </div>
  );
}
