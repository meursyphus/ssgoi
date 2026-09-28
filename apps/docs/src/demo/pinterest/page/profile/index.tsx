"use client";

import {
  usePin,
  type PinSimple,
  type Profile,
} from "@/demo/pinterest/state/pin";
import { ProfileHeader } from "./profile-header";
import { SavedTabs } from "./saved-tabs";
import { BoardGrid } from "./board-grid";
import { SavedPins } from "./saved-pins";

export default function ProfilePage({
  initialData,
  savedPins,
}: {
  initialData: Profile;
  savedPins: PinSimple[];
}) {
  // The chosen tab lives in the model so coming back from a pin shows the
  // same grid, with the tile the zoom collapses into. Saved pins live there
  // too, so a pin saved on its close-up shows up here.
  const pin = usePin((state) => ({
    savedView: state.savedView,
    actions: state.actions,
  }));
  pin.actions.initSaved(savedPins);
  return (
    <div className="flex min-h-full flex-col bg-white">
      <ProfileHeader profile={initialData} />
      <SavedTabs />
      <div className="flex-1 px-2 pt-3 pb-6">
        {pin.savedView === "boards" ? (
          <BoardGrid boards={initialData.boards} />
        ) : (
          <SavedPins />
        )}
      </div>
    </div>
  );
}
