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
  selector: 'app-slide-demo-clothing',
  imports: [SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ssgoiTransition="/slide/clothing" class="h-full bg-white">
      <div class="p-4 md:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl md:text-2xl font-bold text-gray-900">Clothing</h2>
          <span class="text-sm text-gray-500">{{ products.length }} items</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          @for (product of products; track product.id) {
            <div
              class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow"
            >
              <div
                class="bg-blue-50 rounded-lg h-24 md:h-32 flex items-center justify-center mb-3"
              >
                <span class="text-3xl md:text-4xl">{{ product.image }}</span>
              </div>
              <h3 class="font-medium text-sm text-gray-900 mb-1">
                {{ product.name }}
              </h3>
              <p class="text-lg font-bold text-gray-900">{{ product.price }}</p>
              <button
                class="mt-2 w-full bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700 transition-colors"
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
export class SlideDemoClothingComponent {
  readonly products: Product[] = [
    { id: 1, name: 'Classic White Tee', price: '$29', image: '👔' },
    { id: 2, name: 'Denim Jacket', price: '$79', image: '🧥' },
    { id: 3, name: 'Summer Dress', price: '$59', image: '👗' },
    { id: 4, name: 'Wool Sweater', price: '$89', image: '🧶' },
    { id: 5, name: 'Casual Shirt', price: '$45', image: '👔' },
    { id: 6, name: 'Winter Coat', price: '$199', image: '🧥' },
  ];
}
