import { action, OnError } from "comwit";
import { toast } from "sonner";
import { trip as tripAPI } from "@/demo/air-bnb/api/trip";
import { listing } from "@/demo/air-bnb/state/listing/model";
import { checkout } from "@/demo/air-bnb/state/checkout/model";
import { trip } from "../model";
import type { TripActions } from "../types";

export const bookActions = action<Pick<TripActions, "book">>(({ state }) => {
  class BookActions {
    private model = state(trip);
    private listing = state(listing);
    private checkout = state(checkout);

    @OnError((e: unknown) => {
      toast.error(e instanceof Error ? e.message : "Booking failed");
    })
    async book() {
      const detail = this.listing.currentListing;
      if (!detail) throw new Error("Checkout listing is not initialized");
      const guests = this.checkout.guests;
      await tripAPI.book({
        listingId: detail.id,
        dateLabel: this.checkout.dateLabel ?? detail.dateLabel,
        guestsLabel: `${guests} ${guests === 1 ? "guest" : "guests"}`,
      });
      await this.model.trips.refetch();
      toast.success("Booking confirmed");
    }
  }
  return new BookActions();
});
