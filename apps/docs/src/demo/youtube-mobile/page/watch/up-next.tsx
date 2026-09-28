import type { MockVideo } from "../../mock-data";
import { WideVideoCard } from "../shared/video-card";

/**
 * Up next. Each card carries its own zoom exit key; the list never contains
 * the current video, so the page keeps a single enter marker.
 */
export function UpNext({ videos }: { videos: MockVideo[] }) {
  return (
    <section className="mt-5 border-t border-neutral-200 pt-4">
      {videos.map((video) => (
        <WideVideoCard key={video.id} video={video} />
      ))}
    </section>
  );
}
