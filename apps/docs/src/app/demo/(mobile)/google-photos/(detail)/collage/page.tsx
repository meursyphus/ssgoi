import { photo } from "@/demo/google-photos/api/photo";
import CollagePage from "@/demo/google-photos/page/collage";

export default async function Page() {
  const { items } = await photo.findAll();
  return <CollagePage photos={items} />;
}
