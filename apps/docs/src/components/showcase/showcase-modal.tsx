"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import {
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Globe,
  Calendar,
} from "lucide-react";
import type { ShowcaseItem } from "./showcase-data";
import { useTranslations } from "@/i18n/use-translations";

interface ShowcaseModalProps {
  item: ShowcaseItem;
  items: ShowcaseItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ShowcaseModal({
  item,
  items,
  currentIndex,
  onClose,
  onNavigate,
}: ShowcaseModalProps) {
  const t = useTranslations("showcase");
  const [galleryIndex, setGalleryIndex] = useState(0);

  const gallery = item.gallery?.length ? item.gallery : [item.thumbnail];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrevProject = useCallback(() => {
    if (hasPrev) {
      onNavigate(currentIndex - 1);
    }
  }, [hasPrev, currentIndex, onNavigate]);

  const handleNextProject = useCallback(() => {
    if (hasNext) {
      onNavigate(currentIndex + 1);
    }
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevProject();
      } else if (e.key === "ArrowRight") {
        handleNextProject();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, handlePrevProject, handleNextProject]);

  // Reset gallery index when item changes
  useEffect(() => {
    setGalleryIndex(0);
  }, [item.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Previous Project Button */}
      {hasPrev && (
        <button
          onClick={handlePrevProject}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group"
          title={t("prevProject")}
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {items[currentIndex - 1]?.title}
          </span>
        </button>
      )}

      {/* Next Project Button */}
      {hasNext && (
        <button
          onClick={handleNextProject}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group"
          title={t("nextProject")}
        >
          <ChevronRight className="w-6 h-6" />
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {items[currentIndex + 1]?.title}
          </span>
        </button>
      )}

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[90vh] mx-4 bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 border border-white/10 text-white/60 hover:text-white hover:bg-black/70 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Gallery Section */}
          <div className="relative flex-1 bg-neutral-900 min-h-[300px] lg:min-h-[500px]">
            {/* Main Image */}
            <div className="relative w-full h-full aspect-video lg:aspect-auto">
              <Image
                src={gallery[galleryIndex]}
                alt={`${item.title} - ${galleryIndex + 1}`}
                fill
                className="object-contain"
                priority
                unoptimized={gallery[galleryIndex].endsWith(".gif")}
              />
            </div>

            {/* Gallery Navigation - only show if multiple images */}
            {gallery.length > 1 && (
              <>
                {/* Image Counter */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs text-white/80">
                  {galleryIndex + 1} / {gallery.length}
                </div>

                {/* Image Navigation Arrows */}
                <button
                  onClick={() =>
                    setGalleryIndex((prev) =>
                      prev > 0 ? prev - 1 : gallery.length - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setGalleryIndex((prev) =>
                      prev < gallery.length - 1 ? prev + 1 : 0,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Thumbnail Strip */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-lg bg-black/60 border border-white/10">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`relative w-12 h-8 rounded overflow-hidden transition-all ${
                        idx === galleryIndex
                          ? "ring-2 ring-white/80"
                          : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={img.endsWith(".gif")}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="lg:w-[380px] p-6 lg:p-8 overflow-y-auto bg-neutral-950">
            {/* Project Counter */}
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-4">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-light tracking-tight text-white mb-2">
              {item.title}
            </h2>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-neutral-400 bg-white/5 border border-white/5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              {item.longDescription || item.description}
            </p>

            {/* Meta Info */}
            <div className="space-y-3 mb-8">
              {item.framework && (
                <div className="flex items-center gap-3 text-xs">
                  <Globe className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-500">{t("framework")}</span>
                  <span className="text-neutral-300 ml-auto">
                    {item.framework}
                  </span>
                </div>
              )}
              {item.year && (
                <div className="flex items-center gap-3 text-xs">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-500">{t("year")}</span>
                  <span className="text-neutral-300 ml-auto">{item.year}</span>
                </div>
              )}
            </div>

            {/* Visit Button */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              {t("visitSite")}
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Keyboard Hints */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-2">
                {t("keyboardNav")}
              </p>
              <div className="space-y-1 text-[10px] text-neutral-500">
                <p>
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-neutral-400">
                    ESC
                  </kbd>{" "}
                  {t("toClose")}
                </p>
                <p>
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-neutral-400">
                    ← →
                  </kbd>{" "}
                  {t("browseProjects")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
