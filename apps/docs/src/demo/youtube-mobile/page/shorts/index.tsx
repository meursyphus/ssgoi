import { shortVideos } from "../../mock-data";
import { ShortsMark } from "../shared/brand";
import { ShortPlayer } from "./short-player";

export default function ShortsPage() {
  return (
    <ShortPlayer
      short={shortVideos[1]}
      showBell
      className="min-h-[calc(100dvh-68px)] md:min-h-[704px]"
      leading={
        <div className="flex items-center gap-2 px-2 text-[20px] font-bold">
          <ShortsMark className="h-7 w-7" />
          Shorts
        </div>
      }
    />
  );
}
