---
title: "SSGOI Performance Optimization"
description: "Learn how to squeeze every last drop of performance out of your SSGOI transitions for a buttery-smooth user experience"
order: 6
group: "Advanced"
---

<!-- # SSGOI Performance Optimization: Make Your Transitions Smoother Than a Freshly Waxed Dolphin!

Welcome to the SSGOI speed shop! Here, we'll tune up your transitions until they purr like a well-oiled engine. Ready to make your page transitions so smooth that users will think they're scrolling through butter? Let's dive in!

## The Golden Rules of Transition Performance

Before we start tweaking, let's lay down some ground rules:

1. **Keep it Simple**: The fancier the transition, the more your user's device has to work.
2. **60 FPS or Bust**: Aim for silky smooth 60 frames per second. Anything less and your users might think they're watching a flipbook.
3. **Test on Real Devices**: Your super-powered dev machine isn't what your users have. Test on average devices too!

Now, let's get our hands dirty!

## 1. Use GPU-Accelerated Properties

Some CSS properties are like first-class passengers - they get special treatment from the GPU. Stick to these for optimal performance:

- `transform`
- `opacity`

```javascript
const smoothTransition = {
  in: (node, params) => ({
    duration: 300,
    css: (t) => `
      transform: translateX(${100 - t * 100}%);
      opacity: ${t};
    `
  })
};
```

Avoid properties that cause layout reflows like the plague. Properties like `top`, `left`, `width`, and `height` are performance kryptonite!

## 2. Shorter Durations for Snappier Transitions

Longer isn't always better. Shorter durations can make your app feel more responsive:

```javascript
const snappyTransition = {
  in: (node, params) => ({
    duration: 150, // Half the default duration
    css: (t) => `
      transform: scale(${t});
      opacity: ${t};
    `
  })
};
```

Remember, we're aiming for "smooth", not "slow motion replay".

## 3. Use `will-change` Wisely

`will-change` is like telling the browser to warm up its engines. Use it sparingly:

```javascript
const preparedTransition = {
  in: (node, params) => {
    node.style.willChange = 'transform, opacity';
    return {
      duration: 300,
      css: (t) => `
        transform: translateY(${100 - t * 100}%);
        opacity: ${t};
      `,
      tick: (t, u) => {
        if (t === 1) node.style.willChange = '';
      }
    };
  }
};
```

But remember, `will-change` is not a magic wand. Overuse it, and you might end up slowing things down!

## 4. Throttle Complex Transitions on Mobile

Mobile devices need some extra love. Consider simplifying transitions for smaller screens:

```javascript
const responsiveTransition = {
  in: (node, params) => {
    const isMobile = window.innerWidth < 768;
    return {
      duration: isMobile ? 200 : 400,
      css: (t) => isMobile
        ? `opacity: ${t};`
        : `
          transform: rotate(${360 * t}deg);
          opacity: ${t};
        `
    };
  }
};
```

Your mobile users will thank you for not making their phones burst into flames.

## 5. Avoid Transitioning Too Many Elements at Once

Transitioning every element on your page is like trying to herd cats - chaotic and probably not going to end well:

```javascript
const focusedTransition = {
  in: (node, params) => {
    // Only transition the main content, not every tiny detail
    const mainContent = node.querySelector('.main-content');
    return {
      duration: 300,
      css: (t) => `
        transform: translateX(${100 - t * 100}%);
        opacity: ${t};
      `,
      tick: (t) => {
        mainContent.style.transform = `translateX(${100 - t * 100}%)`;
        mainContent.style.opacity = t;
      }
    };
  }
};
```

Focus on the important stuff. Your users probably don't need to see every single button do a backflip.

## 6. Preload Your Pages

If you know where your user is likely to go next, preload that page:

```javascript
import { preloadCode } from '$app/navigation';

// In your component
onMount(() => {
  preloadCode('/likely-next-page');
});
```

It's like having a crystal ball, but for web performance!

## 7. Profile Your Transitions

Use your browser's dev tools to profile your transitions. Look for any performance bottlenecks:

1. Open your browser's dev tools
2. Go to the Performance tab
3. Start recording and trigger your transition
4. Stop recording and analyze the results

If you see a lot of red in your flame chart, you've got some optimization to do!

## The Final Lap

Remember, performance optimization is an ongoing process. Keep testing, keep measuring, and keep improving. Your goal is to make your transitions so smooth that users don't even notice them - they just feel the speed!

Now go forth and make those transitions purr like a kitten on a velvet pillow! 🐱💨 -->
