import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SsgoiTransition } from '@ssgoi/angular';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  tag?: string;
}

@Component({
  selector: 'app-slide-demo-accessories',
  imports: [SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ssgoiTransition="/slide/accessories" class="h-full bg-white">
      <div class="p-4 md:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">
            Accessories
          </h2>
          <span class="text-sm text-gray-500">{{ products.length }} items</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          @for (product of products; track product.id) {
            <div
              class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative"
            >
              @if (product.tag) {
                <span
                  class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded"
                >
                  {{ product.tag }}
                </span>
              }
              <div
                class="bg-orange-50 rounded-lg h-24 md:h-32 flex items-center justify-center mb-3"
              >
                <span class="text-3xl md:text-4xl">{{ product.image }}</span>
              </div>
              <h3 class="font-medium text-sm text-gray-900 mb-1">
                {{ product.name }}
              </h3>
              <p class="text-lg font-bold text-gray-900">{{ product.price }}</p>
              <button
                class="mt-2 w-full bg-orange-600 text-white text-sm py-1.5 rounded hover:bg-orange-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class SlideDemoAccessoriesComponent {
  readonly products: Product[] = [
    { id: 1, name: 'Smart Watch', price: '$299', image: '⌚', tag: 'Hot' },
    { id: 2, name: 'Sunglasses', price: '$149', image: '🕶️' },
    { id: 3, name: 'Baseball Cap', price: '$29', image: '🧢' },
    { id: 4, name: 'Leather Belt', price: '$59', image: '👔' },
    { id: 5, name: 'Scarf', price: '$39', image: '🧣' },
    { id: 6, name: 'Necklace', price: '$89', image: '📿' },
    { id: 7, name: 'Leather Backpack', price: '$159', image: '🎒' },
    { id: 8, name: 'Crossbody Bag', price: '$89', image: '👜' },
  ];
}
