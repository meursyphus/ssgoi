import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/link";

export function SectionHeader({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className="flex items-center justify-between px-4 active:opacity-60"
    >
      <h2 className="text-[20px] font-bold text-neutral-900">{title}</h2>
      <ChevronRight className="h-5 w-5 text-neutral-500" />
    </Link>
  );
}
