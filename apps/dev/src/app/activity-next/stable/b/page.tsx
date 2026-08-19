import { ActivityRouteBoundary } from "../../activity-next-client";

export default function StablePageB() {
  return (
    <ActivityRouteBoundary
      label="Stable page B"
      otherHref="/activity-next/stable/a"
      stableScope
    />
  );
}
