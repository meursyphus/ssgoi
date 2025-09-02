import Products from "@/components/demo/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Demo - SSGOI",
  description:
    "Explore hero transitions and shared element animations in our e-commerce demo.",
};

export default async function Page() {
  return <Products />;
}
