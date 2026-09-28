import { Search } from "lucide-react";
import { Link } from "@/lib/link";
import { Input } from "@/lib/components/ui/input";
import type { Destination } from "@/demo/air-bnb/state/listing";
import { routes } from "@/demo/air-bnb/page/shared/routes";

export function WhereCard({
  text,
  onTextChange,
  results,
}: {
  text: string;
  onTextChange: (text: string) => void;
  results: Destination[];
}) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.25)]">
      <h1 className="text-[26px] font-bold text-neutral-900">Where?</h1>
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-700" />
        <Input
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Search destinations"
          aria-label="Search destinations"
          className="h-12 rounded-xl border-neutral-300 bg-white pl-11 text-[15px] text-neutral-900 shadow-none placeholder:text-neutral-500 focus-visible:border-neutral-900 focus-visible:ring-0 md:text-[15px]"
        />
      </div>
      <p className="pt-5 text-[12px] font-medium text-neutral-500">
        {text ? "Destinations" : "Suggested destinations"}
      </p>
      <ul className="pt-2">
        {results.map((d) => (
          <li key={d.key}>
            <Link
              href={routes.collection(d.key)}
              scroll={false}
              className="-mx-2 flex items-center gap-4 rounded-2xl px-2 py-2 active:bg-neutral-100"
            >
              <img
                src={d.thumbnail}
                alt=""
                width={200}
                height={200}
                className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0">
                <span className="block truncate text-[15px] text-neutral-900">
                  {d.title}
                </span>
                <span className="block truncate text-[13px] text-neutral-500">
                  {d.subtitle}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {/* Empty only means "no match" once something is typed; with no
            text the suggestions are still loading. */}
        {results.length === 0 && text && (
          <li className="py-3 text-[13px] text-neutral-500">
            No destinations match “{text}”. Try Seoul, Busan or Jeju.
          </li>
        )}
      </ul>
    </section>
  );
}
