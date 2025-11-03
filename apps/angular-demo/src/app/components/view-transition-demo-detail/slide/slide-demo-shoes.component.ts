import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  tag?: string;
}

@Component({
  selector: 'app-slide-demo-shoes',
  host: {
    class: 'block p-4 md:p-6',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900">Shoes</h2>
      <span class="text-sm text-gray-500">{{ products.length }} items</span>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      @for (product of products; track product.id) {
        <div
          class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow relative"
        >
          @if (product.tag) {
            <span
              class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              {{ product.tag }}
            </span>
          }
          <div
            class="bg-green-50 rounded-lg h-24 md:h-32 flex items-center justify-center mb-3"
          >
            <span class="text-3xl md:text-4xl">{{ product.image }}</span>
          </div>
          <h3 class="font-medium text-sm text-gray-900 mb-1">
            {{ product.name }}
          </h3>
          <p class="text-lg font-bold text-gray-900">{{ product.price }}</p>
          <button
            class="mt-2 w-full bg-green-600 text-white text-sm py-1.5 rounded hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      }
    </div>
  `,
})
export class SlideDemoShoesComponent {
  readonly products: Product[] = [
    { id: 1, name: 'Running Sneakers', price: '$89', image: '👟', tag: 'New' },
    { id: 2, name: 'Canvas Sneakers', price: '$59', image: '👟' },
    { id: 3, name: 'Leather Boots', price: '$159', image: '👢' },
    { id: 4, name: 'High Heels', price: '$99', image: '👠' },
    { id: 5, name: 'Sandals', price: '$39', image: '👡' },
    { id: 6, name: 'Loafers', price: '$79', image: '👞' },
  ];
}
