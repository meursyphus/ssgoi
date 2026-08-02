import { ActivityRouteBoundary } from "../../activity-next-client";

export default function KeyedPageB() {
  return (
    <ActivityRouteBoundary
      label="Keyed page B"
      otherHref="/activity-next/keyed/a"
      stableScope={false}
    />
  );
}
