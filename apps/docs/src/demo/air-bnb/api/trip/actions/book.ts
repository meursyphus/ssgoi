import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { BookingInput } from "../types";

async function _book(input: BookingInput): Promise<void> {
  data.book({
    id: input.listingId,
    dateLabel: `${input.dateLabel} · ${input.guestsLabel}`,
    statusLabel: "Confirmed",
  });
}

export const book = createAction(_book);
