import { redirect } from "next/navigation";
import { profile as profileAPI } from "@/demo/instagram/api/profile";

export default async function Page() {
  const me = await profileAPI.getMe();
  redirect(`/demo/instagram/profile/${me.username}`);
}
