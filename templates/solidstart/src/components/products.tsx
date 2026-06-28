import { For, Show } from "solid-js";
import { getProductsByCategory, type Product } from "../data/products";

export function ProductGrid(props: { category: string }) {
  const products = () => getProductsByCategory(props.category);
  const transitionId = () => `/products/${props.category}`;

  return (
    <div data-ssgoi-transition={transitionId()}>
      <div class="px-4 pb-6 h-full overflow-y-auto">
        <Show
          when={products().length > 0}
          fallback={
            <div class="text-center py-12">
              <p class="text-neutral-500 text-sm">
                No products in this category
              </p>
            </div>
          }
        >
          <div class="grid grid-cols-2 gap-3">
            <For each={products()}>
              {(product) => <ProductCard product={product} />}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}

function ProductCard(props: { product: Product }) {
  const badgeClass = () => {
    if (props.product.badge === "sale") return "bg-red-500/90 text-white";
    if (props.product.badge === "new") return "bg-blue-500/90 text-white";
    return "bg-amber-500/90 text-black";
  };

  return (
    <div class="block bg-white/5 rounded-xl overflow-hidden">
      <div class="relative aspect-square overflow-hidden">
        <img
          src={props.product.image}
          alt={props.product.name}
          class="w-full h-full object-cover"
        />
        <Show when={props.product.badge}>
          {(badge) => (
            <span
              class={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase ${badgeClass()}`}
            >
              {badge()}
            </span>
          )}
        </Show>
      </div>

      <div class="p-3">
        <span class="text-[10px] text-neutral-500 uppercase tracking-wide">
          {props.product.category}
        </span>
        <h3 class="text-xs font-medium text-white mt-0.5 line-clamp-2 leading-tight">
          {props.product.name}
        </h3>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-sm font-semibold text-white">
            ${props.product.price}
          </span>
          <Show when={props.product.originalPrice}>
            {(originalPrice) => (
              <span class="text-[10px] text-neutral-500 line-through">
                ${originalPrice()}
              </span>
            )}
          </Show>
        </div>
        <div class="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-400">
          <span class="text-amber-400">*</span>
          <span>{props.product.rating}</span>
          <span class="text-neutral-600">/</span>
          <span>{props.product.reviews} reviews</span>
        </div>
      </div>
    </div>
  );
}
