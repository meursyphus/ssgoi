import { pin } from "@/demo/pinterest/api/pin";
import SharePage from "@/demo/pinterest/page/share";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await pin.findShare(id);
  return <SharePage initialData={data} />;
}
