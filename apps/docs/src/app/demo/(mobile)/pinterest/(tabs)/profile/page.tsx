import { pin } from "@/demo/pinterest/api/pin";
import ProfilePage from "@/demo/pinterest/page/profile";

export default async function Page() {
  const [profile, savedPins] = await Promise.all([
    pin.findProfile(),
    pin.findSaved(),
  ]);
  return <ProfilePage initialData={profile} savedPins={savedPins} />;
}
