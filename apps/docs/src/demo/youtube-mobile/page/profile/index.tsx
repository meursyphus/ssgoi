import { YouTubeTopBar } from "../shared/top-bar";
import { HistoryRow } from "./history-row";
import { LibrarySection } from "./library-section";
import { ProfileHeader } from "./profile-header";

export default function ProfilePage() {
  return (
    <main className="min-h-full bg-white pb-8 text-neutral-950">
      <YouTubeTopBar profile />
      <ProfileHeader />
      <HistoryRow />
      <LibrarySection />
    </main>
  );
}
