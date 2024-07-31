---
title: "SSGOI Built-in Transitions"
description: "Explore the variety of pre-built transition effects in SSGOI and learn how to use them effectively"
order: 3
group: "Advanced"
---

# SSGOI Built-in Transitions: Your Page's Dance Move Repertoire

Welcome to the SSGOI dance studio! Here, we'll introduce you to our star performers: the built-in transitions. These transitions are like the greatest hits of the page transition world - ready to make your app move and groove!

## 1. Fade Transition: The Smooth Operator

```javascript
// transitions.fade
```

The fade transition is the Frank Sinatra of transitions - classic, smooth, and always in style. It gently fades your page in and out, perfect for when you want to keep things classy.

Usage:
```javascript
// '/about': {
//   '*': transitions.fade({ duration: 300 })
// }
```

Pro Tip: Shorter durations for a snappy feel, longer for a dreamy effect. Just don't make it so long that your users think their internet is broken!

## 2. Slide Transition: The Slick Mover

```javascript
transitions.slide
```

The slide transition is like the moonwalk of page transitions. It smoothly slides your pages in and out, leaving your users wondering, "How did it do that?"

Usage:
```javascript
// '/products': {
//   '*': transitions.slide({ direction: 'left', duration: 400 })
// }
```

Directions: 'left', 'right', 'up', 'down'. Choose wisely, young padawan.

## 3. Zoom Transition: The Showstopper

```javascript
transitions.zoom
```

When your page needs to make an entrance (or exit) that screams "Look at me!", the zoom transition is your go-to move. It's the transition equivalent of a mic drop.

Usage:
```javascript
// '/gallery': {
//   '*': transitions.zoom({ scale: 0.8, duration: 500 })
// }
```

## 4. Flip Transition: The Acrobat

```javascript
// transitions.flip
```

The flip transition is for when your pages are feeling gymnastic. It's like your page is auditioning for Cirque du Soleil.

Usage:
```javascript
// '/blog': {
//   '*': transitions.flip({ direction: 'x', duration: 600 })
// }
```

Directions: 'x' for horizontal flip, 'y' for vertical. Warning: Excessive use may cause motion sickness. Use responsibly!

## 5. Blur Transition: The Mystic

```javascript
transitions.blur
```

Want your pages to appear and disappear like a mirage in the desert? The blur transition has got you covered. It's perfect for that "Am I dreaming?" effect.

Usage:
```javascript
// '/contact': {
//   '*': transitions.blur({ amount: 10, duration: 400 })
// }
```

Amount is in pixels. Higher numbers for more blur, but don't go overboard unless you want your users to think they need new glasses.

## Mixing and Matching: Become a Transition DJ

Feel free to mix and match these transitions like a DJ mixing tracks. Different transitions for different routes? Absolutely! 

```javascript
// import { createTransitionConfig, transitions } from 'ssgoi';

// const transitionConfig = createTransitionConfig({
//   '/': {
//     '/about': transitions.slide({ direction: 'left' }),
//     '/products': transitions.fade,
//     '/gallery': transitions.zoom,
//     '*': transitions.blur
//   }
// });
```

This config is like telling your home page: "To About? Slide left. To Products? Just fade. To Gallery? Make it big! Anywhere else? Get blurry!"

## The Grand Finale

Remember, with great transition power comes... well, you know the rest. Use these built-in transitions wisely, and your app will be dancing its way into your users' hearts faster than you can say "SSGOI"!

Now go forth and make those pages move like they've never moved before! 🕺💃