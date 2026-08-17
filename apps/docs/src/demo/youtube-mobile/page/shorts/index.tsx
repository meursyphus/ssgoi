import {
  Bell,
  MessageCircle,
  MoreVertical,
  Search,
  Share2,
  ThumbsUp,
  User,
} from "lucide-react";
import { shortVideos } from "../../mock-data";
import { ShortsMark } from "../shared/brand";

export default function ShortsPage() {
  const video = shortVideos[1];

  return (
    <main className="relative min-h-[740px] overflow-hidden bg-[#0f0f0f] text-white">
      <img
        src={video.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75" />

      <header className="relative z-10 flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 text-[20px] font-bold">
          <ShortsMark className="h-7 w-7" />
          Shorts
        </div>
        <div className="flex items-center gap-5">
          <Search className="h-6 w-6" />
          <Bell className="h-6 w-6" />
          <MoreVertical className="h-6 w-6" />
        </div>
      </header>

      <div className="absolute bottom-6 right-3 z-10 flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-1">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45">
            <ThumbsUp className="h-6 w-6" />
          </span>
          <span className="text-[11px] font-medium">92K</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45">
            <MessageCircle className="h-6 w-6" />
          </span>
          <span className="text-[11px] font-medium">1.4K</span>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45">
          <Share2 className="h-6 w-6" />
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
          <User className="h-5 w-5" />
        </span>
      </div>

      <div className="absolute bottom-5 left-4 right-16 z-10">
        <div className="mb-3 flex items-center gap-2">
          <img
            src="https://picsum.photos/seed/yt-field/80/80"
            alt=""
            className="h-8 w-8 rounded-full object-cover ring-1 ring-white"
          />
          <span className="text-[13px] font-semibold">@fieldnotes</span>
          <button
            type="button"
            className="rounded-full border border-white/80 px-3 py-1 text-[11px] font-semibold"
          >
            Subscribe
          </button>
        </div>
        <p className="text-[14px] font-medium leading-5">
          A sunset concert in thirty seconds. Turn the sound on.
        </p>
        <p className="mt-2 text-[12px] text-white/85">
          Original sound · Field Notes
        </p>
      </div>
    </main>
  );
}
