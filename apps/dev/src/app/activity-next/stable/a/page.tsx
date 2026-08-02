import { ActivityRouteBoundary } from "../../activity-next-client";

export default function StablePageA() {
  return (
    <ActivityRouteBoundary
      label="Stable page A"
      otherHref="/activity-next/stable/b"
      stableScope
    />
  );
}
