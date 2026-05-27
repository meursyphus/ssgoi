import { createAction } from "@/lib/utils";
import { data } from "../data";
import type { PhotoTour } from "../types";

async function _getTour(): Promise<PhotoTour> {
  return {
    title: "사진 투어",
    totalLabel: data.totalLabel(),
    categories: data.allCategories(),
  };
}

export const getTour = createAction(_getTour);
