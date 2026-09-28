import { story } from "@/demo/voyage/api/story";
import TripsPage from "@/demo/voyage/page/trips";

export default async function Page() {
  const trips = await story.findTrips();
  return <TripsPage trips={trips} />;
}
