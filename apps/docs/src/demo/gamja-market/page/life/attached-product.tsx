import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/link";
import type { PostProduct } from "@/demo/gamja-market/api/post";
import { routes } from "@/demo/gamja-market/page/shared/routes";

/** The group-buy item a post talks about — opens its listing. */
export function AttachedProduct({ product }: { product: PostProduct }) {
  return (
    <Link
      href={routes.product(product.id)}
      scroll={false}
      className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 p-2.5 active:bg-black/[0.03]"
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[6px] bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.name}
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-gray-800">{product.name}</p>
        <p className="mt-0.5 text-[14px] font-bold text-gray-900">
          {product.price.toLocaleString()}원
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
    </Link>
  );
}
