---
title: "SSGOI Working Principle"
description: "Dive into the inner workings of SSGOI and understand how it achieves smooth page transitions"
order: 1
group: "Advanced"
---

# SSGOI Working Principle: The Magic Behind the Curtain

Ever wondered how SSGOI makes your pages transition smoother than a jazz saxophone solo? Well, grab your hard hat and let's dive into the engine room of SSGOI!

## The Double Container Trick

SSGOI uses a sneaky (but genius) double container structure. It's like those Russian nesting dolls, but with divs:

```html
<div class="ssgoi-container">  <!-- The outer container -->
  <div class="ssgoi-content">  <!-- The inner container -->
    <slot />  <!-- Your actual page content -->
  </div>
</div>
```

This structure is the secret sauce that allows for seamless transitions. It's like having a magician's trap door, but for your web pages!

## CSS Positioning: The Art of Illusion

Now, let's talk about the CSS that makes this magic happen:

```css
.ssgoi-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.ssgoi-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

This CSS is like the invisible wires in a magic show. The outer container sets the stage, while the inner container can float freely within it, ready to perform its disappearing (or appearing) act.

## Why Absolute Positioning?

You might be wondering, "Why go through all this trouble with absolute positioning?" Well, let me tell you, it's not just for fun (although it is pretty fun). Here's why:

1. **Overlap Allow-ance**: It lets the old page and new page coexist briefly, like two ships passing in the night.
2. **Animation Independence**: Each page can do its own thing without bothering the others. It's like giving each page its own dressing room.
3. **Layout Preservation**: The rest of your site won't even notice the page transitions. It's our little secret.

## The Transition Tango

When it's time for a page transition, SSGOI does a little dance:

1. A new inner container (`ssgoi-content`) takes the stage.
2. The old page gets its 'exit stage left' cue (the 'out' transition).
3. The new page makes its grand entrance (the 'in' transition).
4. Once the applause dies down (transitions complete), the old page bows out completely.

This whole process happens faster than you can say "SSGOI" three times fast!

## Performance: Keeping It Snappy

SSGOI is all about that smooth experience, but we also care about performance. That's why we use GPU-accelerated properties for animations whenever possible. It's like strapping a rocket to your transitions!

## In Conclusion

And there you have it! The inner workings of SSGOI, demystified. It's a careful ballet of containers, positioning, and well-timed transitions. Now that you know how it works, you can appreciate the smooth transitions even more. It's not magic - it's just really, really good engineering!

Remember, with great transition power comes great transition responsibility. Use your newfound knowledge wisely, and may your pages always transition with grace and style!
