import type { ReactNode } from "react";
import InstagramProfileLayout from "@/demo/instagram/page/profile-layout";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const { id } = await params;
  return <InstagramProfileLayout id={id}>{children}</InstagramProfileLayout>;
}
