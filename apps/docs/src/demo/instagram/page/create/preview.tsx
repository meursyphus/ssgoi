"use client";

import { motion } from "motion/react";

export function CreatePreview({
  image,
  picked,
}: {
  image?: string;
  /** 사용자가 직접 고른 뒤에만 교체 애니메이션 — 첫 진입은 sheet가 담당 */
  picked: boolean;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
      {image && (
        <motion.img
          key={image}
          src={image}
          alt="선택한 사진"
          width={600}
          height={600}
          initial={picked ? { opacity: 0.4, scale: 1.02 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
