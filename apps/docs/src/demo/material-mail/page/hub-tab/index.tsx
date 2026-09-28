"use client";

import { TopBar } from "../shared/top-bar";
import { HUBS, type HubKind } from "./content";
import { HubEmptyState } from "./hub-empty-state";
import { HubFab } from "./hub-fab";

/** Meet / Chat / Spaces: sparse destinations, the way Gmail's tabs are. */
export default function HubTabPage({ kind }: { kind: HubKind }) {
  const hub = HUBS[kind];

  return (
    <>
      <div className="flex flex-1 flex-col bg-[#FAFAFE]">
        <TopBar title={hub.title} />
        <HubEmptyState hub={hub} />
      </div>
      {hub.fab && <HubFab fab={hub.fab} />}
    </>
  );
}
