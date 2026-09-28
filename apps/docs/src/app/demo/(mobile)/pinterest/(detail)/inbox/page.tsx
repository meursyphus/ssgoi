import { pin } from "@/demo/pinterest/api/pin";
import InboxPage from "@/demo/pinterest/page/inbox";

export default async function Page() {
  const updates = await pin.findUpdates();
  return <InboxPage updates={updates} />;
}
