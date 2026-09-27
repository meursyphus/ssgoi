import { ChevronLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { routes } from "@/demo/air-bnb/page/shared/routes";
import { SaveButton } from "@/demo/air-bnb/page/shared/save-button";

export function TourHeader({ id }: { id: string }) {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-white/95 px-2 backdrop-blur">
      <DemoBackLink
        fallback={routes.listing(id)}
        aria-label="Back"
        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 active:bg-neutral-100"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
      </DemoBackLink>
      <SaveButton
        listingId={id}
        variant="round"
        className="mr-2 shadow-none ring-1 ring-neutral-200"
      />
    </div>
  );
}
