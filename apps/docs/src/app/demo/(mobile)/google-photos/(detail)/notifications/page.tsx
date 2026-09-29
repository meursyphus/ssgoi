import { notification } from "@/demo/google-photos/api/notification";
import NotificationsPage from "@/demo/google-photos/page/notifications";

export default async function Page() {
  const items = await notification.findAll();
  return <NotificationsPage items={items} />;
}
