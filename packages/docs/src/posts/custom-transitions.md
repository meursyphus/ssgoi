---
title: "Creating Custom Transitions in SSGOI"
description: "Learn how to craft your own unique transition effects in SSGOI for truly personalized page transitions"
order: 5
group: "Advanced"
---

# Creating Custom Transitions in SSGOI: Be the Picasso of Page Transitions!

Welcome to the SSGOI custom transition atelier! Here, we'll teach you how to paint your own transition masterpieces. Get ready to make your pages move in ways that would make even the Mona Lisa raise an eyebrow!

## The Anatomy of a Custom Transition

In SSGOI, a custom transition is like a recipe for page movement. Here's the basic structure:

<!-- ```javascript
const myAwesomeTransition = {
  in: (node, params) => ({
    duration: 300,
    css: (t, u) => `/* Your CSS magic here */`
  }),
  out: (node, params) => ({
    duration: 300,
    css: (t, u) => `/* More CSS wizardry */`
  })
};
``` -->

It's like having an "entrance" chef and an "exit" chef, each preparing their own special dish of CSS.

## The Ingredients: t and u

In your CSS function, you get two magic ingredients:

- `t`: Goes from 0 to 1. It's like the "doneness" of your transition.
- `u`: Goes from 1 to 0. It's the evil twin of `t`.

Use these to create your transition effect. It's like seasoning your CSS to taste!

## Example 1: The "Nope" Transition

Let's create a transition that shakes the page like it's saying "Nope!":

<!-- ```javascript
const nopeTransition = {
  in: (node, params) => ({
    duration: 300,
    css: (t) => `
      transform: translate(${Math.sin(t * 10) * 10}px, 0);
      opacity: ${t};
    `
  }),
  out: (node, params) => ({
    duration: 300,
    css: (t, u) => `
      transform: translate(${Math.sin(u * 10) * 10}px, 0);
      opacity: ${u};
    `
  })
};
``` -->

Now your page enters and exits with attitude. It's perfect for your 404 page!

## Example 2: The "Dramatic Entrance" Transition

For when your page needs to make an entrance worthy of a superhero:

<!-- ```javascript
const dramaticEntranceTransition = {
  in: (node, params) => ({
    duration: 1000,
    css: (t) => `
      transform: scale(${t}) rotate(${360 * t}deg);
      opacity: ${t};
    `
  }),
  out: (node, params) => ({
    duration: 300,
    css: (t, u) => `
      transform: scale(${u});
      opacity: ${u};
    `
  })
};
``` -->

This transition will have your pages spinning in like they're auditioning for "America's Got Talent".

## Example 3: The "Magic Portal" Transition

Create the illusion that your pages are coming through a magic portal:

<!-- ```javascript
const magicPortalTransition = {
  in: (node, params) => ({
    duration: 600,
    css: (t) => `
      clip-path: circle(${t * 100}% at center);
      opacity: ${t};
    `
  }),
  out: (node, params) => ({
    duration: 600,
    css: (t, u) => `
      clip-path: circle(${u * 100}% at center);
      opacity: ${u};
    `
  })
};
``` -->

Now your pages appear and disappear like they're being summoned by a wizard. Abracadabra!

## Using Your Custom Transition

Once you've created your masterpiece, using it is as easy as pie:

```javascript
import { createTransitionConfig } from 'ssgoi';
import { nopeTransition, dramaticEntranceTransition, magicPortalTransition } from './myCustomTransitions';

const transitionConfig = createTransitionConfig({
  '/nope': {
    '*': nopeTransition
  },
  '/superhero': {
    '*': dramaticEntranceTransition
  },
  '/hogwarts': {
    '*': magicPortalTransition
  }
});
```

## The Sky's the Limit!

With custom transitions, your creativity is the only limit. You could create transitions that:

- Make your pages bounce in like they're on a trampoline
- Have your content assemble like a jigsaw puzzle
- Create a "The Matrix" effect with raining code
- Simulate a page turn like in a book

Remember, the goal is to enhance user experience, not to induce motion sickness. Use your powers wisely!

## Pro Tips for Transition Artists

1. **Performance Matters**: Stick to transformations and opacity for butter-smooth transitions. Your users' devices will thank you.
2. **Test on Multiple Devices**: What looks cool on your super-computer might not work so well on a potato phone.
3. **Accessibility**: Consider users who might have vestibular disorders. Provide an option to reduce motion.
4. **Consistency**: Try to maintain a consistent theme with your transitions. You're creating an experience, not a circus... unless your website is actually about a circus.

Now go forth and create transitions that will make your users say, "Woah, how did they do that?" Just remember, with great transition power comes great transition responsibility!
