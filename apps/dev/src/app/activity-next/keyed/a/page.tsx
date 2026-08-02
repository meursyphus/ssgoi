import { ActivityRouteBoundary } from "../../activity-next-client";

export default function KeyedPageA() {
  return (
    <ActivityRouteBoundary
      label="Keyed page A"
      otherHref="/activity-next/keyed/b"
      stableScope={false}
    />
  );
}
