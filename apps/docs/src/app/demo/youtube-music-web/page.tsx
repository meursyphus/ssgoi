import { song } from "@/demo/youtube-music-web/api/song";
import HomePage from "@/demo/youtube-music-web/page/home";

export default async function Page() {
  const data = await song.home();
  return <HomePage initialData={data} />;
}
