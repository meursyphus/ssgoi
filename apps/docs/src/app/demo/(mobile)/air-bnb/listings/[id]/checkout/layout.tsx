import type { ReactNode } from "react";
import { listing } from "@/demo/air-bnb/api/listing";
import CheckoutLayoutClient from "@/demo/air-bnb/page/checkout";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const { id } = await params;
  const data = await listing.find(id);
  return (
    <CheckoutLayoutClient initialData={data}>{children}</CheckoutLayoutClient>
  );
}
