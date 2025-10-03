import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SsgoiTransition } from '@ssgoi/angular';

interface ColorItem {
  id: number;
  color: string;
  name: string;
}

@Component({
  selector: 'app-item',
  imports: [RouterLink, SsgoiTransition],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent {
  private route = inject(ActivatedRoute);

  colors: ColorItem[] = [
    { id: 1, color: '#FF6B6B', name: 'Coral' },
    { id: 2, color: '#4ECDC4', name: 'Turquoise' },
    { id: 3, color: '#45B7D1', name: 'Sky Blue' },
    { id: 4, color: '#96CEB4', name: 'Sage' },
    { id: 5, color: '#FECA57', name: 'Sunflower' },
    { id: 6, color: '#DDA0DD', name: 'Plum' },
  ];

  id = computed(() => {
    const params = this.route.snapshot.paramMap;
    return Number(params.get('id'));
  });

  item = computed(() => {
    return this.colors.find((c) => c.id === this.id());
  });

  hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}
