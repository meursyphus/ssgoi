import { pin } from "@/demo/pinterest/api/pin";
import HomePage from "@/demo/pinterest/page/home";

export default async function Page() {
  // Server data so the feed (and its zoom tiles) exists on first paint.
  const pins = await pin.findAll();
  return <HomePage initialPins={pins} />;
}
