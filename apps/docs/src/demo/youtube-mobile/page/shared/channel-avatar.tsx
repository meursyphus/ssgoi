import { findChannel } from "../../mock-data";

/** One avatar per channel everywhere; the signed-in user's channel uses initials. */
export function ChannelAvatar({
  channelId,
  size,
  className = "",
}: {
  channelId: string;
  size: number;
  className?: string;
}) {
  const channel = findChannel(channelId);
  if (!channel?.image) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.36 }}
        className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff0033] via-[#7b2cff] to-[#065fd4] font-bold text-white ${className}`}
      >
        AM
      </span>
    );
  }
  return (
    <img
      src={channel.image}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full bg-neutral-200 object-cover ${className}`}
    />
  );
}
