"use client";

import type { PhotoDetail } from "@/demo/google-photos/state/photo";

/**
 * Scroll-revealed metadata panel below the fullscreen canvas. Clean,
 * Google-Photos-info-panel feel: optional title, then a definition list of
 * date / location / dimensions / file size / storage / device.
 */
export function PhotoMeta({ photo }: { photo: PhotoDetail }) {
  return (
    <section className="space-y-6 border-t border-neutral-100 bg-white px-5 pb-12 pt-8 text-neutral-900">
      {photo.description && (
        <h1 className="text-lg font-medium leading-snug">
          {photo.description}
        </h1>
      )}
      <dl className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
        <dt className="text-neutral-500">Date</dt>
        <dd>{photo.takenAt}</dd>

        {photo.location && (
          <>
            <dt className="text-neutral-500">Location</dt>
            <dd>{photo.location}</dd>
          </>
        )}

        <dt className="text-neutral-500">Dimensions</dt>
        <dd>
          {photo.width} × {photo.height}
        </dd>

        <dt className="text-neutral-500">File size</dt>
        <dd>{photo.fileSize}</dd>

        <dt className="text-neutral-500">Storage</dt>
        <dd>{photo.storage}</dd>

        {photo.device && (
          <>
            <dt className="text-neutral-500">Device</dt>
            <dd>{photo.device}</dd>
          </>
        )}
      </dl>
    </section>
  );
}
