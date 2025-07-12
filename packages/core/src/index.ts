// Main entry point for ssgoi library

export interface TransitionOptions {
  duration?: number
  easing?: string
  delay?: number
}

export interface PageTransition {
  from: Element
  to: Element
  options?: TransitionOptions
}

export function createTransition(transition: PageTransition): void {
  console.log('Creating transition', transition)
  // Implementation will go here
}

export default {
  createTransition
}