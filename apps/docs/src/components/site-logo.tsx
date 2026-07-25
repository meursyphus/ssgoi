import Image from "next/image";
import { Link } from "@/lib/link";

type Props = {
  className?: string;
};

export function SiteLogo({ className }: Props) {
  return (
    <Link
      href="/"
      className={
        "inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-ink-soft hover:text-ink" +
        (className ? " " + className : "")
      }
    >
      <Image
        src="/ssgoi-logo.png"
        alt=""
        width={32}
        height={32}
        priority
        className="h-8 w-8"
      />
      <span>SSGOI</span>
    </Link>
  );
}
