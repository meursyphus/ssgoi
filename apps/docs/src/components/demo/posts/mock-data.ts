export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  readTime: number;
  publishedAt: string;
  tags: string[];
  coverImage: string; // Cover image URL
}

export const posts: Post[] = [
  {
    id: "svelte-5-runes",
    title: "Understanding Svelte 5 Runes: The Future of Reactivity",
    excerpt:
      "Dive deep into Svelte 5's new rune system and discover how it revolutionizes state management and reactivity.",
    content: `# Understanding Svelte 5 Runes: The Future of Reactivity

Svelte 5 introduces a groundbreaking new feature called **runes** that fundamentally changes how we think about reactivity in Svelte applications. In this comprehensive guide, we'll explore what runes are, why they were introduced, and how to use them effectively.

## What Are Runes?

Runes are Svelte's new primitives for controlling reactivity. They replace the implicit reactivity model of Svelte 3 and 4 with an explicit, function-based approach. The main runes include:

- \`$state\` - For reactive state
- \`$derived\` - For computed values
- \`$effect\` - For side effects
- \`$props\` - For component props

## Why Runes?

The introduction of runes addresses several limitations of Svelte's previous reactivity model:

### 1. **Explicit Reactivity**
With runes, reactivity is explicit and predictable. You know exactly what's reactive and what isn't.

\`\`\`javascript
// Svelte 4
let count = 0; // Implicitly reactive
const doubled = count * 2; // Not reactive!

// Svelte 5 with runes
let count = $state(0); // Explicitly reactive
const doubled = $derived(count * 2); // Also reactive!
\`\`\`

### 2. **Better TypeScript Support**
Runes provide superior TypeScript integration, making it easier to build type-safe applications.

### 3. **Improved Performance**
The explicit nature of runes allows for better optimization and smaller bundle sizes.

## Working with $state

The \`$state\` rune is the foundation of reactivity in Svelte 5. It creates reactive state that triggers updates when changed.

\`\`\`javascript
<script>
  let count = $state(0);
  let user = $state({ name: 'Alice', age: 30 });
  
  function increment() {
    count++;
  }
  
  function updateUser() {
    user.age++;
  }
</script>

<button onclick={increment}>Count: {count}</button>
<button onclick={updateUser}>{user.name} is {user.age}</button>
\`\`\`

## Computed Values with $derived

The \`$derived\` rune creates reactive computed values that automatically update when their dependencies change.

\`\`\`javascript
<script>
  let width = $state(10);
  let height = $state(20);
  
  const area = $derived(width * height);
  const perimeter = $derived(2 * (width + height));
</script>

<p>Area: {area}</p>
<p>Perimeter: {perimeter}</p>
\`\`\`

## Side Effects with $effect

The \`$effect\` rune handles side effects in a reactive way, replacing the old \`$:\` syntax.

\`\`\`javascript
<script>
  let count = $state(0);
  
  $effect(() => {
    console.log(\`Count changed to: \${count}\`);
    
    // Cleanup function (optional)
    return () => {
      console.log('Cleaning up...');
    };
  });
</script>
\`\`\`

## Component Props with $props

The \`$props\` rune provides a cleaner way to handle component props with better TypeScript support.

\`\`\`javascript
<script>
  let { name, age = 18, ...rest } = $props();
</script>

<p>{name} is {age} years old</p>
\`\`\`

## Advanced Patterns

### Fine-grained Reactivity

Runes enable fine-grained reactivity control:

\`\`\`javascript
let todos = $state([
  { id: 1, text: 'Learn Svelte 5', done: false },
  { id: 2, text: 'Build an app', done: false }
]);

const completedCount = $derived(
  todos.filter(todo => todo.done).length
);

const progress = $derived(
  todos.length > 0 ? (completedCount / todos.length) * 100 : 0
);
\`\`\`

### Conditional Effects

You can create conditional effects that only run under certain conditions:

\`\`\`javascript
let isEnabled = $state(false);
let data = $state(null);

$effect(() => {
  if (isEnabled) {
    fetchData().then(result => {
      data = result;
    });
  }
});
\`\`\`

## Migration Tips

When migrating from Svelte 4 to Svelte 5:

1. Start by converting reactive declarations to \`$state\`
2. Replace reactive statements (\`$:\`) with \`$derived\` or \`$effect\`
3. Update component props to use \`$props\`
4. Test thoroughly as the behavior might subtly differ

## Conclusion

Svelte 5 runes represent a significant evolution in how we write reactive code. While there's a learning curve, the benefits in terms of clarity, performance, and developer experience make it worthwhile. As you start using runes, you'll appreciate the explicit control and predictability they bring to your Svelte applications.

The future of Svelte is bright, and runes are lighting the way forward. Happy coding!`,
    author: {
      name: "Sarah Chen",
      avatar: "/demo/posts/avatar-5.jpg",
      role: "Senior Frontend Developer",
    },
    category: "Svelte",
    readTime: 12,
    publishedAt: "2024-01-25",
    tags: ["Svelte 5", "Runes", "Reactivity", "JavaScript", "Web Development"],
    coverImage: "/demo/posts/0-400x300.jpg",
  },
  {
    id: "flutter-animations",
    title: "Mastering Flutter Animations: From Basics to Advanced",
    excerpt:
      "Learn how to create beautiful, performant animations in Flutter that bring your mobile apps to life.",
    content: `# Mastering Flutter Animations: From Basics to Advanced

Flutter's animation system is one of its most powerful features, enabling developers to create smooth, beautiful animations that run at 60fps. In this comprehensive guide, we'll journey from basic animations to advanced techniques that will make your apps truly stand out.

## Understanding Flutter's Animation Architecture

At its core, Flutter's animation system is built on a few key concepts:

- **Animation Controller**: Controls the animation's lifecycle
- **Animation**: Represents a value that changes over time
- **Tween**: Defines the range of values
- **Curves**: Controls the rate of change

## Getting Started with Implicit Animations

Flutter provides implicit animations that handle the complexity for you. These are perfect for simple animations:

### AnimatedContainer

\`\`\`dart
class AnimatedBox extends StatefulWidget {
  @override
  _AnimatedBoxState createState() => _AnimatedBoxState();
}

class _AnimatedBoxState extends State<AnimatedBox> {
  double _width = 100;
  double _height = 100;
  Color _color = Colors.blue;
  
  void _changeProperties() {
    setState(() {
      _width = _width == 100 ? 200 : 100;
      _height = _height == 100 ? 200 : 100;
      _color = _color == Colors.blue ? Colors.red : Colors.blue;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _changeProperties,
      child: AnimatedContainer(
        duration: Duration(seconds: 1),
        curve: Curves.easeInOut,
        width: _width,
        height: _height,
        color: _color,
        child: Center(
          child: Text('Tap me!', style: TextStyle(color: Colors.white)),
        ),
      ),
    );
  }
}
\`\`\`

### AnimatedOpacity

Perfect for fade-in/fade-out effects:

\`\`\`dart
AnimatedOpacity(
  opacity: _isVisible ? 1.0 : 0.0,
  duration: Duration(milliseconds: 500),
  child: Container(
    width: 200,
    height: 100,
    color: Colors.green,
  ),
)
\`\`\`

## Explicit Animations with AnimationController

For more control, use explicit animations:

\`\`\`dart
class RotatingLogo extends StatefulWidget {
  @override
  _RotatingLogoState createState() => _RotatingLogoState();
}

class _RotatingLogoState extends State<RotatingLogo>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );
    
    _animation = Tween<double>(
      begin: 0,
      end: 2 * pi,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.linear,
    ));
    
    _controller.repeat();
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.rotate(
          angle: _animation.value,
          child: FlutterLogo(size: 100),
        );
      },
    );
  }
}
\`\`\`

## Hero Animations

Hero animations create seamless transitions between routes:

\`\`\`dart
// First Screen
Hero(
  tag: 'imageHero',
  child: GestureDetector(
    onTap: () {
      Navigator.push(context, MaterialPageRoute(builder: (_) {
        return DetailScreen();
      }));
    },
    child: Image.network(
      'https://example.com/image.jpg',
      width: 100,
    ),
  ),
)

// Detail Screen
Scaffold(
  body: Center(
    child: Hero(
      tag: 'imageHero',
      child: Image.network(
        'https://example.com/image.jpg',
        width: 300,
      ),
    ),
  ),
)
\`\`\`

## Advanced Animation Techniques

### Staggered Animations

Create complex sequences where multiple animations play in order:

\`\`\`dart
class StaggeredAnimationDemo extends StatefulWidget {
  @override
  _StaggeredAnimationDemoState createState() => _StaggeredAnimationDemoState();
}

class _StaggeredAnimationDemoState extends State<StaggeredAnimationDemo>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<double> _width;
  late Animation<double> _height;
  late Animation<EdgeInsets> _padding;
  late Animation<BorderRadius?> _borderRadius;
  late Animation<Color?> _color;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 3),
      vsync: this,
    );
    
    _opacity = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Interval(0.0, 0.1, curve: Curves.ease),
    ));
    
    _width = Tween<double>(
      begin: 50.0,
      end: 150.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Interval(0.1, 0.25, curve: Curves.ease),
    ));
    
    _height = Tween<double>(
      begin: 50.0,
      end: 150.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Interval(0.25, 0.4, curve: Curves.ease),
    ));
    
    _padding = EdgeInsetsTween(
      begin: EdgeInsets.only(bottom: 16.0),
      end: EdgeInsets.only(bottom: 75.0),
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Interval(0.4, 0.6, curve: Curves.ease),
    ));
    
    _borderRadius = BorderRadiusTween(
      begin: BorderRadius.circular(4.0),
      end: BorderRadius.circular(75.0),
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Interval(0.6, 0.8, curve: Curves.ease),
    ));
    
    _color = ColorTween(
      begin: Colors.indigo[100],
      end: Colors.orange[400],
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Interval(0.8, 1.0, curve: Curves.ease),
    ));
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          padding: _padding.value,
          alignment: Alignment.bottomCenter,
          child: Opacity(
            opacity: _opacity.value,
            child: Container(
              width: _width.value,
              height: _height.value,
              decoration: BoxDecoration(
                color: _color.value,
                border: Border.all(
                  color: Colors.indigo[300]!,
                  width: 3.0,
                ),
                borderRadius: _borderRadius.value,
              ),
            ),
          ),
        );
      },
    );
  }
}
\`\`\`

### Physics-based Animations

Create realistic animations using physics simulations:

\`\`\`dart
class SpringAnimation extends StatefulWidget {
  @override
  _SpringAnimationState createState() => _SpringAnimationState();
}

class _SpringAnimationState extends State<SpringAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _animation;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
    );
    
    final spring = SpringDescription(
      mass: 1,
      stiffness: 100,
      damping: 10,
    );
    
    final simulation = SpringSimulation(spring, 0, 1, -1);
    
    _animation = _controller.drive(
      Tween<Offset>(
        begin: Offset(-1, 0),
        end: Offset.zero,
      ),
    );
    
    _controller.animateWith(simulation);
  }
  
  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _animation,
      child: Container(
        width: 100,
        height: 100,
        color: Colors.blue,
      ),
    );
  }
}
\`\`\`

## Performance Best Practices

1. **Use const constructors** where possible to avoid rebuilds
2. **Dispose controllers** properly to prevent memory leaks
3. **Use AnimatedBuilder** instead of setState for better performance
4. **Keep animations at 60fps** by avoiding heavy computations during animations
5. **Test on lower-end devices** to ensure smooth performance

## Debugging Animations

Flutter provides excellent tools for debugging animations:

\`\`\`dart
// Slow down animations for debugging
timeDilation = 5.0; // Makes animations 5x slower

// Enable performance overlay
MaterialApp(
  showPerformanceOverlay: true,
  // ... rest of your app
)
\`\`\`

## Conclusion

Flutter's animation system is incredibly powerful and flexible. Start with implicit animations for simple use cases, then graduate to explicit animations as you need more control. Remember that great animations enhance user experience - they should feel natural and serve a purpose, not just exist for the sake of movement.

The key to mastering Flutter animations is practice. Start small, experiment with different curves and durations, and gradually work your way up to more complex animations. Your users will appreciate the polished, professional feel that well-crafted animations bring to your apps.`,
    author: {
      name: "Michael Park",
      avatar: "/demo/posts/avatar-8.jpg",
      role: "Mobile App Developer",
    },
    category: "Flutter",
    readTime: 15,
    publishedAt: "2024-01-22",
    tags: ["Flutter", "Animations", "Mobile Development", "Dart", "UI/UX"],
    coverImage: "/demo/posts/48-400x300.jpg",
  },
  {
    id: "sveltekit-architecture",
    title: "Building Scalable Applications with SvelteKit",
    excerpt:
      "A comprehensive guide to architecting large-scale applications with SvelteKit, covering best practices, patterns, and real-world examples.",
    content: `# Building Scalable Applications with SvelteKit

SvelteKit has emerged as a powerful framework for building modern web applications. Its combination of Svelte's reactive components and a full-stack framework capabilities makes it an excellent choice for projects of any size. In this guide, we'll explore how to architect scalable applications with SvelteKit.

## Understanding SvelteKit's Architecture

SvelteKit is built on several core principles:

- **File-based routing**: Your file structure defines your routes
- **Server-side rendering (SSR)**: First-class support for SSR with easy opt-out
- **API routes**: Build your backend API alongside your frontend
- **Adapters**: Deploy anywhere with platform-specific adapters

## Project Structure for Scale

A well-organized project structure is crucial for maintainability:

\`\`\`
src/
├── lib/
│   ├── components/
│   │   ├── ui/
│   │   ├── features/
│   │   └── layouts/
│   ├── stores/
│   ├── utils/
│   ├── api/
│   └── types/
├── routes/
│   ├── (app)/
│   │   ├── +layout.svelte
│   │   ├── dashboard/
│   │   └── settings/
│   ├── (marketing)/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   └── about/
│   └── api/
├── app.html
├── app.d.ts
└── hooks.server.ts
\`\`\`

## State Management Patterns

### Using Svelte Stores

For simple state management, Svelte stores are perfect:

\`\`\`javascript
// stores/user.js
import { writable, derived } from 'svelte/store';

function createUserStore() {
  const { subscribe, set, update } = writable(null);
  
  return {
    subscribe,
    login: async (credentials) => {
      const user = await api.login(credentials);
      set(user);
    },
    logout: () => set(null),
    updateProfile: (data) => update(user => ({ ...user, ...data }))
  };
}

export const user = createUserStore();
export const isAuthenticated = derived(user, $user => !!$user);
\`\`\`

### Context API for Complex State

For component-tree-specific state, use Svelte's context API:

\`\`\`javascript
// lib/contexts/theme.js
import { setContext, getContext } from 'svelte';
import { writable } from 'svelte/store';

const THEME_KEY = Symbol('theme');

export function setThemeContext(initialTheme = 'light') {
  const theme = writable(initialTheme);
  setContext(THEME_KEY, theme);
  return theme;
}

export function getThemeContext() {
  return getContext(THEME_KEY);
}
\`\`\`

## Data Loading Strategies

SvelteKit provides powerful data loading capabilities:

### Server-side Data Loading

\`\`\`javascript
// +page.server.js
export async function load({ params, locals }) {
  // This runs on the server
  const post = await db.post.findUnique({
    where: { id: params.id },
    include: { author: true, comments: true }
  });
  
  if (!post) {
    throw error(404, 'Post not found');
  }
  
  return {
    post,
    user: locals.user // From hooks.server.ts
  };
}
\`\`\`

### Universal Data Loading

\`\`\`javascript
// +page.js
export async function load({ fetch, params }) {
  // This runs on both server and client
  const response = await fetch(\`/api/posts/\${params.id}\`);
  
  if (!response.ok) {
    throw error(response.status);
  }
  
  return {
    post: await response.json()
  };
}
\`\`\`

### Streaming Data

For real-time updates, use streaming:

\`\`\`javascript
// +page.server.js
export async function load() {
  return {
    comments: getComments(), // Returns immediately
    streamed: {
      recommendations: getRecommendations() // Streams in later
    }
  };
}

// +page.svelte
<script>
  export let data;
</script>

{#await data.streamed.recommendations}
  <LoadingSpinner />
{:then recommendations}
  <RecommendationsList {recommendations} />
{/await}
\`\`\`

## API Design with SvelteKit

### RESTful API Routes

\`\`\`javascript
// routes/api/posts/+server.js
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const limit = Number(url.searchParams.get('limit') ?? 10);
  const offset = Number(url.searchParams.get('offset') ?? 0);
  
  const posts = await db.post.findMany({
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' }
  });
  
  return json(posts);
}

export async function POST({ request, locals }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  const data = await request.json();
  const post = await db.post.create({
    data: {
      ...data,
      authorId: locals.user.id
    }
  });
  
  return json(post, { status: 201 });
}
\`\`\`

### Form Actions for Progressive Enhancement

\`\`\`javascript
// +page.server.js
export const actions = {
  create: async ({ request, locals }) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    
    try {
      await db.post.create({
        data: { title, content, authorId: locals.user.id }
      });
    } catch (err) {
      return fail(400, { title, content, error: err.message });
    }
    
    throw redirect(303, '/posts');
  },
  
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    
    await db.post.delete({ where: { id } });
    
    return { success: true };
  }
};
\`\`\`

## Authentication & Authorization

Implement robust auth using hooks:

\`\`\`javascript
// hooks.server.ts
import { redirect } from '@sveltejs/kit';
import { verifyJWT } from '$lib/auth';

export async function handle({ event, resolve }) {
  const token = event.cookies.get('auth-token');
  
  if (token) {
    try {
      const user = await verifyJWT(token);
      event.locals.user = user;
    } catch {
      event.cookies.delete('auth-token');
    }
  }
  
  // Protect routes
  if (event.url.pathname.startsWith('/admin')) {
    if (!event.locals.user?.isAdmin) {
      throw redirect(303, '/login');
    }
  }
  
  return resolve(event);
}
\`\`\`

## Performance Optimization

### Code Splitting

SvelteKit automatically code-splits your routes, but you can optimize further:

\`\`\`javascript
// Lazy load heavy components
<script>
  import { onMount } from 'svelte';
  
  let ChartComponent;
  
  onMount(async () => {
    const module = await import('$lib/components/Chart.svelte');
    ChartComponent = module.default;
  });
</script>

{#if ChartComponent}
  <svelte:component this={ChartComponent} {data} />
{:else}
  <LoadingPlaceholder />
{/if}
\`\`\`

### Preloading & Prefetching

\`\`\`svelte
<!-- Preload on hover -->
<a href="/about" data-sveltekit-preload-data="hover">About</a>

<!-- Preload specific routes programmatically -->
<script>
  import { preloadData, preloadCode } from '$app/navigation';
  
  // Preload data for a route
  preloadData('/products');
  
  // Preload code for a route
  preloadCode('/products');
</script>
\`\`\`

## Testing Strategies

### Unit Testing Components

\`\`\`javascript
// Button.test.js
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

test('emits click event', async () => {
  const { getByRole, component } = render(Button, {
    props: { label: 'Click me' }
  });
  
  const button = getByRole('button');
  const mock = vi.fn();
  component.$on('click', mock);
  
  await fireEvent.click(button);
  expect(mock).toHaveBeenCalled();
});
\`\`\`

### Integration Testing

\`\`\`javascript
// app.test.js
import { expect, test } from '@playwright/test';

test('user can create a post', async ({ page }) => {
  await page.goto('/posts/new');
  await page.fill('input[name="title"]', 'Test Post');
  await page.fill('textarea[name="content"]', 'Test content');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/posts');
  await expect(page.locator('h2')).toContainText('Test Post');
});
\`\`\`

## Deployment Strategies

### Adapter Configuration

\`\`\`javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-node';
// or
import adapter from '@sveltejs/adapter-vercel';
// or
import adapter from '@sveltejs/adapter-cloudflare';

export default {
  kit: {
    adapter: adapter({
      // Adapter-specific options
    })
  }
};
\`\`\`

### Environment Variables

\`\`\`javascript
// Use $env for type-safe env vars
import { 
  PUBLIC_API_URL 
} from '$env/static/public';
import { 
  DATABASE_URL 
} from '$env/static/private';

// Dynamic env vars
import { env } from '$env/dynamic/private';
const port = env.PORT ?? 3000;
\`\`\`

## Monitoring & Observability

Implement comprehensive monitoring:

\`\`\`javascript
// hooks.server.ts
export async function handle({ event, resolve }) {
  const start = Date.now();
  
  const response = await resolve(event);
  
  const duration = Date.now() - start;
  
  // Log performance metrics
  console.log({
    method: event.request.method,
    path: event.url.pathname,
    status: response.status,
    duration
  });
  
  return response;
}
\`\`\`

## Conclusion

SvelteKit provides an excellent foundation for building scalable applications. Its file-based routing, built-in SSR support, and flexible data loading strategies make it suitable for projects ranging from simple websites to complex applications.

Key takeaways:
- Organize your code with a scalable project structure
- Leverage SvelteKit's data loading capabilities
- Implement proper authentication and authorization
- Optimize performance with code splitting and preloading
- Test thoroughly at all levels
- Choose the right deployment adapter for your needs

As your application grows, SvelteKit grows with you, providing the tools and patterns needed to maintain a clean, performant codebase. The combination of Svelte's simplicity and SvelteKit's power creates a development experience that's both enjoyable and productive.`,
    author: {
      name: "Emma Wilson",
      avatar: "/demo/posts/avatar-9.jpg",
      role: "Full-stack Developer",
    },
    category: "SvelteKit",
    readTime: 18,
    publishedAt: "2024-01-20",
    tags: [
      "SvelteKit",
      "Architecture",
      "Scalability",
      "Web Development",
      "Best Practices",
    ],
    coverImage: "/demo/posts/180-400x300.jpg",
  },
  {
    id: "react-server-components",
    title: "React Server Components: A Deep Dive",
    excerpt:
      "Understanding the revolutionary React Server Components and how they change the way we build React applications.",
    content: `# React Server Components: A Deep Dive

React Server Components (RSC) represent a paradigm shift in how we build React applications. They enable components to render on the server, reducing bundle sizes and improving performance. Let's explore this game-changing technology.

## What Are React Server Components?

React Server Components are components that render exclusively on the server. They never re-render on the client and don't add to your JavaScript bundle size. This fundamental difference opens up new possibilities for performance optimization.

## Key Benefits

### 1. Zero Bundle Size Impact
Server Components don't send any JavaScript to the client. Your interactive components remain client-side, but data-fetching and static content can stay on the server.

### 2. Direct Backend Access
Access databases, file systems, and internal services directly without building APIs:

\`\`\`jsx
async function BlogPost({ id }) {
  // Direct database access - this runs on the server!
  const post = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

### 3. Automatic Code Splitting
Dependencies used only in Server Components are automatically excluded from client bundles.

## Server vs Client Components

Understanding when to use each type is crucial:

### Server Components (Default)
- Fetch data
- Access backend resources
- Keep sensitive data on the server
- Use heavy dependencies

### Client Components ('use client')
- Add interactivity
- Use browser APIs
- Handle user events
- Manage local state

## Practical Examples

### Data Fetching Pattern

\`\`\`jsx
// app/posts/page.js - Server Component
async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// components/PostCard.js - Client Component
'use client';

import { useState } from 'react';

export function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <button onClick={() => setLikes(likes + 1)}>
        ❤️ {likes}
      </button>
    </div>
  );
}
\`\`\`

## Best Practices

1. **Start with Server Components**: Make components server-side by default
2. **Use Client Components for Interactivity**: Only add 'use client' when needed
3. **Compose Wisely**: Server Components can import Client Components, but not vice versa
4. **Leverage Streaming**: Use Suspense for better loading states

## Common Patterns

### Streaming with Suspense

\`\`\`jsx
export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
    </>
  );
}

async function Posts() {
  const posts = await fetchPosts(); // This can be slow
  return <PostsList posts={posts} />;
}
\`\`\`

### Error Boundaries

\`\`\`jsx
'use client';

export function ErrorBoundary({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

## Conclusion

React Server Components are not just an incremental improvement—they're a fundamental rethinking of how React applications work. By moving appropriate logic to the server, we can build faster, more efficient applications while maintaining the developer experience we love.

The future of React is here, and it's running on the server!`,
    author: {
      name: "Alex Johnson",
      avatar: "/demo/posts/avatar-3.jpg",
      role: "React Core Team Alumni",
    },
    category: "React",
    readTime: 10,
    publishedAt: "2024-01-18",
    tags: [
      "React",
      "Server Components",
      "Next.js",
      "Performance",
      "Web Development",
    ],
    coverImage: "/demo/posts/225-400x300.jpg",
  },
  {
    id: "modern-css-techniques",
    title: "Modern CSS Techniques You Should Know in 2024",
    excerpt:
      "Explore the latest CSS features including Container Queries, Cascade Layers, and the :has() selector that are revolutionizing web styling.",
    content: `# Modern CSS Techniques You Should Know in 2024

CSS has evolved dramatically over the past few years. Features that once required JavaScript or complex workarounds are now possible with pure CSS. Let's explore the cutting-edge techniques that are changing how we style the web.

## Container Queries: The Game Changer

Container Queries allow elements to respond to their container's size rather than the viewport:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
  }
}
\`\`\`

## The Powerful :has() Selector

The :has() pseudo-class lets you style parent elements based on their children:

\`\`\`css
/* Style articles that contain images */
article:has(img) {
  display: grid;
  grid-template-columns: 300px 1fr;
}

/* Style forms with invalid inputs */
form:has(input:invalid) {
  border: 2px solid red;
}
\`\`\`

## Cascade Layers for Better Organization

@layer helps manage CSS specificity in large projects:

\`\`\`css
@layer reset, base, components, utilities;

@layer reset {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

@layer components {
  .button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
}

@layer utilities {
  .mt-4 {
    margin-top: 1rem;
  }
}
\`\`\`

## CSS Nesting: Finally Native

Native CSS nesting is here, making your styles more maintainable:

\`\`\`css
.card {
  padding: 1rem;
  background: white;
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
}
\`\`\`

## Advanced Grid Techniques

### Subgrid for Aligned Layouts

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.grid-item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
\`\`\`

### Dynamic Grid with min() and clamp()

\`\`\`css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit, 
    minmax(min(100%, 300px), 1fr)
  );
  gap: clamp(1rem, 2vw, 2rem);
}
\`\`\`

## Modern Color Functions

### Oklahoma LCH for Better Gradients

\`\`\`css
.gradient {
  background: linear-gradient(
    to right,
    oklch(70% 0.3 0),
    oklch(70% 0.3 270)
  );
}
\`\`\`

### Dynamic Color Themes with color-mix()

\`\`\`css
:root {
  --primary: #3b82f6;
  --primary-light: color-mix(in srgb, var(--primary) 80%, white);
  --primary-dark: color-mix(in srgb, var(--primary) 80%, black);
}
\`\`\`

## Scroll-Driven Animations

Create animations tied to scroll position without JavaScript:

\`\`\`css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
\`\`\`

## Logical Properties for Better Internationalization

\`\`\`css
/* Instead of margin-left/right */
.element {
  margin-inline: 2rem;
  padding-block: 1rem;
  border-start-start-radius: 0.5rem;
}
\`\`\`

## Performance Optimization Techniques

### content-visibility for Faster Rendering

\`\`\`css
.article {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
\`\`\`

### @property for Animatable Custom Properties

\`\`\`css
@property --gradient-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.gradient-border {
  --gradient-angle: 0deg;
  background: conic-gradient(
    from var(--gradient-angle),
    #3b82f6,
    #8b5cf6,
    #3b82f6
  );
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  to {
    --gradient-angle: 360deg;
  }
}
\`\`\`

## Accessibility Improvements

### Preference Queries

\`\`\`css
/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --text-color: black;
    --bg-color: white;
  }
}
\`\`\`

## Conclusion

Modern CSS is incredibly powerful. Features like Container Queries, :has(), and native nesting are transforming how we approach web styling. By leveraging these techniques, you can create more maintainable, performant, and accessible stylesheets.

The key is to stay curious and keep experimenting. CSS continues to evolve, and the best is yet to come!`,
    author: {
      name: "Maria Garcia",
      avatar: "/demo/posts/avatar-1.jpg",
      role: "CSS Specialist",
    },
    category: "CSS",
    readTime: 8,
    publishedAt: "2024-01-16",
    tags: ["CSS", "Web Design", "Frontend", "Modern CSS", "Styling"],
    coverImage: "/demo/posts/104-400x300.jpg",
  },
  {
    id: "web-performance-2024",
    title: "Web Performance Optimization: A Comprehensive Guide",
    excerpt:
      "Master the art of web performance with modern techniques including Core Web Vitals optimization, resource hints, and cutting-edge loading strategies.",
    content: `# Web Performance Optimization: A Comprehensive Guide

Web performance is no longer optional—it's a critical factor for user experience, SEO, and business success. This guide covers everything you need to know about modern web performance optimization.

## Understanding Core Web Vitals

### Largest Contentful Paint (LCP)
Measures loading performance. Aim for LCP within 2.5 seconds.

### First Input Delay (FID) → Interaction to Next Paint (INP)
Measures interactivity. INP is replacing FID as it better captures overall responsiveness.

### Cumulative Layout Shift (CLS)
Measures visual stability. Aim for CLS less than 0.1.

## Critical Rendering Path Optimization

### 1. Minimize Critical Resources

\`\`\`html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>

<!-- Inline critical CSS -->
<style>
  /* Critical above-the-fold styles */
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .hero { height: 100vh; display: flex; align-items: center; }
</style>

<!-- Defer non-critical CSS -->
<link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
\`\`\`

### 2. Optimize JavaScript Loading

\`\`\`javascript
// Use dynamic imports for code splitting
const loadHeavyComponent = async () => {
  const { HeavyComponent } = await import('./HeavyComponent');
  return HeavyComponent;
};

// Implement progressive enhancement
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}
\`\`\`

## Advanced Loading Strategies

### Resource Hints

\`\`\`html
<!-- DNS Prefetch for external domains -->
<link rel="dns-prefetch" href="//api.example.com">

<!-- Preconnect for critical third-party origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Prefetch for likely next navigation -->
<link rel="prefetch" href="/products" as="document">

<!-- Prerender for very likely next page -->
<link rel="prerender" href="/checkout">
\`\`\`

### Modern Image Optimization

\`\`\`html
<picture>
  <source 
    srcset="/image.avif" 
    type="image/avif"
  >
  <source 
    srcset="/image.webp" 
    type="image/webp"
  >
  <img 
    src="/image.jpg" 
    alt="Description"
    loading="lazy"
    decoding="async"
    width="800"
    height="600"
  >
</picture>
\`\`\`

## Performance Monitoring

### Real User Monitoring (RUM)

\`\`\`javascript
// Track Web Vitals
import { getCLS, getFID, getLCP, getTTFB, getFCP } from 'web-vitals';

function sendToAnalytics({ name, delta, id }) {
  // Send to your analytics endpoint
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({ name, delta, id }),
    headers: { 'Content-Type': 'application/json' }
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
getFCP(sendToAnalytics);
\`\`\`

### Performance Observer API

\`\`\`javascript
// Monitor long tasks
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Long task detected:', entry);
    // Send to monitoring service
  }
});

observer.observe({ entryTypes: ['longtask'] });
\`\`\`

## Caching Strategies

### Service Worker Caching

\`\`\`javascript
// Implement cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((response) => {
        return caches.open('v1').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
\`\`\`

### HTTP Caching Headers

\`\`\`javascript
// Express.js example
app.use('/static', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  next();
});

app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});
\`\`\`

## Bundle Size Optimization

### Tree Shaking and Dead Code Elimination

\`\`\`javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};
\`\`\`

### Analyze and Optimize Dependencies

\`\`\`bash
# Analyze bundle size
npm run build -- --analyze

# Find duplicate dependencies
npm ls --depth=0 | grep deduped

# Use lighter alternatives
# moment.js (67kb) → dayjs (7kb)
# lodash (71kb) → lodash-es with tree shaking
\`\`\`

## Runtime Performance

### Optimize React Rendering

\`\`\`javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <ComplexVisualization data={data} />;
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});

// Use useMemo for expensive computations
const processedData = useMemo(() => {
  return heavyDataProcessing(rawData);
}, [rawData]);

// Use useCallback for stable references
const handleClick = useCallback((id) => {
  dispatch({ type: 'SELECT_ITEM', id });
}, [dispatch]);
\`\`\`

### Web Workers for Heavy Computation

\`\`\`javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ cmd: 'process', data: largeDataset });

worker.onmessage = (e) => {
  console.log('Processed result:', e.data);
};

// worker.js
self.onmessage = (e) => {
  if (e.data.cmd === 'process') {
    const result = expensiveOperation(e.data.data);
    self.postMessage(result);
  }
};
\`\`\`

## Network Optimization

### HTTP/2 and HTTP/3

\`\`\`nginx
# Enable HTTP/2
server {
  listen 443 ssl http2;
  
  # HTTP/3 (QUIC)
  listen 443 quic reuseport;
  add_header Alt-Svc 'h3=":443"; ma=86400';
}
\`\`\`

### Compression

\`\`\`javascript
// Enable Brotli compression in Node.js
const compression = require('compression');
const express = require('express');
const app = express();

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
}));
\`\`\`

## Conclusion

Web performance is a continuous journey, not a destination. Regular monitoring, iterative improvements, and staying updated with new techniques are key to maintaining fast, responsive web applications.

Remember: every millisecond counts. Your users will thank you for the effort you put into performance optimization!`,
    author: {
      name: "David Kim",
      avatar: "/demo/posts/avatar-12.jpg",
      role: "Performance Engineer",
    },
    category: "Performance",
    readTime: 14,
    publishedAt: "2024-01-14",
    tags: [
      "Performance",
      "Web Vitals",
      "Optimization",
      "JavaScript",
      "Best Practices",
    ],
    coverImage: "/demo/posts/367-400x300.jpg",
  },
  {
    id: "typescript-advanced-patterns",
    title: "Advanced TypeScript Patterns for Production",
    excerpt:
      "Level up your TypeScript skills with advanced patterns including type guards, conditional types, and template literal types.",
    content: `# Advanced TypeScript Patterns for Production

TypeScript has evolved from a simple type checker to a powerful type system that can express complex relationships in your code. Let's explore advanced patterns that will make your production code more robust and maintainable.

## Type Guards and Narrowing

### Custom Type Guards

\`\`\`typescript
interface User {
  type: 'user';
  name: string;
  email: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

type Person = User | Admin;

// Type guard function
function isAdmin(person: Person): person is Admin {
  return person.type === 'admin';
}

function processUser(person: Person) {
  if (isAdmin(person)) {
    // TypeScript knows this is Admin
    console.log('Permissions:', person.permissions);
  } else {
    // TypeScript knows this is User
    console.log('Email:', person.email);
  }
}
\`\`\`

### Discriminated Unions for State Management

\`\`\`typescript
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: Error;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function useAsyncData<T>(): AsyncState<T> {
  // Implementation
  return { status: 'loading' };
}

// Usage with exhaustive checks
function renderData<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <DataDisplay data={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
    default:
      // This ensures we handle all cases
      const _exhaustive: never = state;
      return _exhaustive;
  }
}
\`\`\`

## Advanced Generic Patterns

### Conditional Types

\`\`\`typescript
// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type StringArray = ArrayElement<string[]>; // string
type NumberArray = ArrayElement<number[]>; // number

// Deep readonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object 
    ? DeepReadonly<T[K]> 
    : T[K];
};

// Conditional function return types
type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
  T extends (...args: any) => Promise<infer R> ? R : never;

async function fetchUser() {
  return { id: 1, name: 'John' };
}

type User = AsyncReturnType<typeof fetchUser>; // { id: number; name: string }
\`\`\`

### Template Literal Types

\`\`\`typescript
// API Route Builder
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Route = \`/api/\${string}\`;

type APIEndpoint<M extends HTTPMethod, R extends Route> = \`\${M} \${R}\`;

type UserEndpoints = 
  | APIEndpoint<'GET', '/api/users'>
  | APIEndpoint<'POST', '/api/users'>
  | APIEndpoint<'PUT', \`/api/users/\${string}\`>
  | APIEndpoint<'DELETE', \`/api/users/\${string}\`>;

// CSS-in-JS Type Safety
type CSSProperty = 'margin' | 'padding';
type CSSUnit = 'px' | 'rem' | 'em' | '%';
type CSSValue = \`\${number}\${CSSUnit}\`;

type CSSProperties = {
  [K in CSSProperty]?: CSSValue;
};

const styles: CSSProperties = {
  margin: '10px',
  padding: '2rem',
  // margin: '10foo', // Error!
};
\`\`\`

## Mapped Types and Key Remapping

\`\`\`typescript
// Getters type
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

// Remove specific properties
type Omit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface User {
  id: string;
  email: string;
  name: string;
}

type UserUpdate = PartialBy<User, 'email' | 'name'>;
// { id: string; email?: string; name?: string; }
\`\`\`

## Builder Pattern with TypeScript

\`\`\`typescript
class QueryBuilder<T = {}> {
  private query: T;

  constructor(query: T = {} as T) {
    this.query = query;
  }

  where<K extends string, V>(
    key: K, 
    value: V
  ): QueryBuilder<T & Record<K, V>> {
    return new QueryBuilder({
      ...this.query,
      [key]: value
    } as T & Record<K, V>);
  }

  orderBy<K extends string>(
    key: K, 
    direction: 'asc' | 'desc' = 'asc'
  ): QueryBuilder<T & { orderBy: K; direction: typeof direction }> {
    return new QueryBuilder({
      ...this.query,
      orderBy: key,
      direction
    } as any);
  }

  build(): T {
    return this.query;
  }
}

// Type-safe query building
const query = new QueryBuilder()
  .where('status', 'active')
  .where('age', 25)
  .orderBy('createdAt', 'desc')
  .build();

// query is typed as:
// {
//   status: string;
//   age: number;
//   orderBy: "createdAt";
//   direction: "desc";
// }
\`\`\`

## Branded Types for Runtime Safety

\`\`\`typescript
// Prevent mixing different ID types
type Brand<K, T> = K & { __brand: T };

type UserID = Brand<string, 'UserID'>;
type PostID = Brand<string, 'PostID'>;

function getUserByID(id: UserID) {
  // Implementation
}

function getPostByID(id: PostID) {
  // Implementation
}

// Type-safe ID creation
function createUserID(id: string): UserID {
  return id as UserID;
}

function createPostID(id: string): PostID {
  return id as PostID;
}

const userId = createUserID('user123');
const postId = createPostID('post456');

getUserByID(userId); // ✓ OK
// getUserByID(postId); // ✗ Error!
\`\`\`

## Function Overloading and Type Inference

\`\`\`typescript
// Overloaded function signatures
function createElement(tag: 'img'): HTMLImageElement;
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const img = createElement('img'); // HTMLImageElement
const input = createElement('input'); // HTMLInputElement
const div = createElement('div'); // HTMLDivElement

// Generic constraints with conditional types
type EventMap = {
  click: MouseEvent;
  change: Event;
  focus: FocusEvent;
};

function addEventListener<K extends keyof EventMap>(
  element: HTMLElement,
  event: K,
  handler: (event: EventMap[K]) => void
): void {
  element.addEventListener(event, handler as any);
}

addEventListener(button, 'click', (e) => {
  // e is MouseEvent
  console.log(e.clientX, e.clientY);
});
\`\`\`

## Type-Safe Error Handling

\`\`\`typescript
// Result type for error handling
type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E = Error> = Ok<T> | Err<E>;

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, value: a / b };
}

// Type-safe error handling
const result = divide(10, 2);
if (result.ok) {
  console.log('Result:', result.value);
} else {
  console.log('Error:', result.error);
}

// Async version
async function fetchUserSafe(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      return { ok: false, error: new Error('Failed to fetch user') };
    }
    const user = await response.json();
    return { ok: true, value: user };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}
\`\`\`

## Conclusion

Advanced TypeScript patterns enable you to write safer, more expressive code. The key is to leverage TypeScript's type system to encode business logic and constraints at the type level, catching errors at compile time rather than runtime.

Remember:
- Use discriminated unions for state management
- Leverage conditional types for flexible generic programming
- Apply branded types to prevent primitive obsession
- Embrace the builder pattern for fluent APIs
- Always strive for type safety without sacrificing developer experience

TypeScript is not just about adding types—it's about designing better APIs and creating self-documenting code that helps your team move faster with confidence.`,
    author: {
      name: "James Chen",
      avatar: "/demo/posts/avatar-7.jpg",
      role: "TypeScript Expert",
    },
    category: "TypeScript",
    readTime: 12,
    publishedAt: "2024-01-12",
    tags: [
      "TypeScript",
      "Advanced Patterns",
      "Type Safety",
      "Best Practices",
      "JavaScript",
    ],
    coverImage: "/demo/posts/160-400x300.jpg",
  },
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getRelatedPosts(currentId: string, limit: number = 3): Post[] {
  const currentPost = getPost(currentId);
  if (!currentPost) return [];

  // Prioritize same category
  const sameCategoryPosts = posts.filter(
    (p) => p.id !== currentId && p.category === currentPost.category,
  );

  const otherPosts = posts
    .filter((p) => p.id !== currentId && p.category !== currentPost.category)
    .sort(() => Math.random() - 0.5);

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
}
