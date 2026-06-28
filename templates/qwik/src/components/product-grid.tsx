import { component$ } from "@builder.io/qwik";
import type { Product } from "~/data/products";

interface ProductGridProps {
  products: Product[];
  category: string;
}

export const ProductGrid = component$<ProductGridProps>(
  ({ products, category }) => {
    return (
      <div data-ssgoi-transition={`/products/${category}`}>
        <div class="px-4 pb-6 h-full overflow-y-auto">
          {products.length === 0 ? (
            <div class="text-center py-12">
              <p class="text-neutral-500 text-sm">
                No products in this category
              </p>
            </div>
          ) : (
            <div class="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  class="block bg-white/5 rounded-xl overflow-hidden"
                >
                  <div class="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      class="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <span
                        class={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                          product.badge === "sale"
                            ? "bg-red-500/90 text-white"
                            : product.badge === "new"
                              ? "bg-blue-500/90 text-white"
                              : "bg-amber-500/90 text-black"
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div class="p-3">
                    <span class="text-[10px] text-neutral-500 uppercase tracking-wide">
                      {product.category}
                    </span>
                    <h3 class="text-xs font-medium text-white mt-0.5 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <div class="flex items-baseline gap-1.5 mt-2">
                      <span class="text-sm font-semibold text-white">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span class="text-[10px] text-neutral-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div class="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-400">
                      <span class="text-amber-400">&#9733;</span>
                      <span>{product.rating}</span>
                      <span class="text-neutral-600">&middot;</span>
                      <span>{product.reviews} reviews</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);
