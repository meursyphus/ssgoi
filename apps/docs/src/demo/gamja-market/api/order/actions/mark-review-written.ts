import { createAction, ActionError } from "@/lib/utils";
import { data } from "../data";

async function _markReviewWritten(id: string): Promise<void> {
  if (!data.byId(id)) throw new ActionError("주문을 찾을 수 없습니다");
  data.markReviewWritten(id);
}

export const markReviewWritten = createAction(_markReviewWritten);
