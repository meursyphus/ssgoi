import type { SpringConfig } from "../types";

export interface AnimationOptions {
  from: number;
  to: number;
  spring: SpringConfig;
  onUpdate: (value: number) => void;
  onComplete: () => void;
  onStart?: () => void;
}

export interface AnimatorInterface {
  // Animation control methods
  forward(): void;
  backward(): void;
  reverse(): void;
  stop(): void;
  
  // State getters
  getVelocity(): number;
  getCurrentValue(): number;
  getIsAnimating(): boolean;
  getCurrentState(): {
    position: number;
    velocity: number;
  };
  
  // State setters
  setVelocity(velocity: number): void;
  setValue(value: number): void;
  
  // Configuration
  updateOptions(newOptions: Partial<AnimationOptions>): void;
}