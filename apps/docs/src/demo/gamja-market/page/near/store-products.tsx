import { Link } from "@/lib/link";
import type { ProductSimple } from "@/demo/gamja-market/state/product";
import { routes } from "@/demo/gamja-market/page/shared/routes";

export function StoreProducts({ products }: { products: ProductSimple[] }) {
  return (
    <section className="mt-2 bg-white px-4 pb-5 pt-4">
      <h2 className="text-[13px] font-semibold text-gray-900">
        이 매장 오늘의 공구
      </h2>
      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-5">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={routes.product(p.id)}
              scroll={false}
              className="block active:opacity-80"
            >
              <div className="relative aspect-square overflow-hidden rounded-[6px] bg-gray-100">
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
                {p.stockBadge ? (
                  <span className="absolute left-2 top-2 rounded border border-red-200 bg-white px-1.5 py-0.5 text-[11px] font-bold text-red-500">
                    {p.stockBadge}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-gray-800">
                {p.name}
              </p>
              <p className="mt-1 text-[15px] font-bold text-gray-900">
                {p.price.toLocaleString()}원
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
