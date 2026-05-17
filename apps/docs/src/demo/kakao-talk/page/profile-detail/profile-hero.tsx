import type { FriendProfile } from "@/demo/kakao-talk/state/friend";

/**
 * Minimal gradient backdrop + bottom-anchored small avatar + name.
 * No big hero image — matches the reference design where the upper
 * half is just background and identity sits low in the frame.
 */
export function ProfileHero({ profile }: { profile: FriendProfile }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#9DA6B5]">
      <img
        src={profile.background}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55" />
      <div className="relative mt-auto flex flex-col items-start gap-2 px-6 pb-6">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-[72px] w-[72px] rounded-3xl bg-neutral-300 object-cover shadow-lg"
        />
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[22px] font-bold leading-tight text-white">
            {profile.name}
          </h2>
          {profile.statusMessage && (
            <p className="text-[13px] text-white/85">{profile.statusMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
