import { shortVideos } from "../../mock-data";
import { ShortsMark } from "../shared/brand";
import { ShortPlayer } from "./short-player";

export default function ShortsPage() {
  return (
    <ShortPlayer
      short={shortVideos[1]}
      showBell
      // Fills the screen above the bottom nav (68px + safe-area inset).
      className="min-h-[calc(100dvh-68px-var(--safe-bottom))] md:min-h-[calc(704px-var(--safe-bottom))]"
      leading={
        <div className="flex items-center gap-2 px-2 text-[20px] font-bold">
          <ShortsMark className="h-7 w-7" />
          Shorts
        </div>
      }
    />
  );
}
