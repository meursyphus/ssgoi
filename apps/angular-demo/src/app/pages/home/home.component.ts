import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SsgoiTransition, ElementTransitionDirective } from '@ssgoi/angular';

interface ColorItem {
  id: number;
  color: string;
  name: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, SsgoiTransition, ElementTransitionDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  colors: ColorItem[] = [
    { id: 1, color: '#FF6B6B', name: 'Coral' },
    { id: 2, color: '#4ECDC4', name: 'Turquoise' },
    { id: 3, color: '#45B7D1', name: 'Sky Blue' },
    { id: 4, color: '#96CEB4', name: 'Sage' },
    { id: 5, color: '#FECA57', name: 'Sunflower' },
    { id: 6, color: '#DDA0DD', name: 'Plum' },
  ];

  showShapes = signal(true);
  stiffness = signal(300);
  damping = signal(30);

  setSpeed(newStiffness: number, newDamping: number) {
    this.stiffness.set(newStiffness);
    this.damping.set(newDamping);
  }

  toggleShapes() {
    this.showShapes.update((v) => !v);
  }

  // Transition for fade effect
  fadeTransition = (element: HTMLElement) => ({
    spring: { stiffness: this.stiffness(), damping: this.damping() },
    tick: (progress: number) => {
      element.style.opacity = progress.toString();
    },
  });

  // Transition for scale + rotate
  scaleRotateTransition = (element: HTMLElement) => ({
    spring: { stiffness: this.stiffness(), damping: this.damping() },
    tick: (progress: number) => {
      element.style.transform = `scale(${progress}) rotate(${progress * 360}deg)`;
      element.style.opacity = progress.toString();
    },
  });

  // Transition for slide
  slideTransition = (element: HTMLElement) => ({
    spring: { stiffness: this.stiffness(), damping: this.damping() },
    tick: (progress: number) => {
      element.style.transform = `translateX(${(1 - progress) * -100}px)`;
      element.style.opacity = progress.toString();
    },
  });

  // Transition for bounce scale (in)
  bounceScaleTransitionIn = (element: HTMLElement) => ({
    spring: {
      stiffness: this.stiffness() * 0.8,
      damping: this.damping() * 0.7,
    },
    tick: (progress: number) => {
      const scale = 0.5 + progress * 0.5;
      element.style.transform = `scale(${scale})`;
      element.style.opacity = progress.toString();
    },
  });

  // Transition for bounce scale (out)
  bounceScaleTransitionOut = (element: HTMLElement) => ({
    spring: { stiffness: this.stiffness(), damping: this.damping() },
    tick: (progress: number) => {
      const scale = 0.5 + progress * 0.5;
      element.style.transform = `scale(${scale})`;
      element.style.opacity = progress.toString();
    },
  });

  onJaeminButtonHover(event: MouseEvent, isEnter: boolean) {
    const target = event.currentTarget as HTMLElement;
    if (isEnter) {
      target.style.transform = 'translateY(-2px)';
    } else {
      target.style.transform = 'translateY(0)';
    }
  }
}
