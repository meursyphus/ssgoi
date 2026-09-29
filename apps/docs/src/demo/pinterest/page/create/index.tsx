"use client";

import { CreateHeader } from "./create-header";
import { CreateOptions } from "./create-options";
import { RecentPhotos } from "./recent-photos";

export default function CreatePage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <CreateHeader />
      <CreateOptions />
      <RecentPhotos />
    </div>
  );
}
