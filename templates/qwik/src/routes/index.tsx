import type { RequestHandler } from "@qwik.dev/router";

export const onGet: RequestHandler = ({ redirect }) => {
  throw redirect(302, "/posts/");
};
