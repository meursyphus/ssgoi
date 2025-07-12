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
    id: 'svelte-5-runes',
    title: 'Understanding Svelte 5 Runes: The Future of Reactivity',
    excerpt: 'Dive deep into Svelte 5\'s new rune system and discover how it revolutionizes state management and reactivity.',
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
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'Senior Frontend Developer'
    },
    category: 'Svelte',
    readTime: 12,
    publishedAt: '2024-01-25',
    tags: ['Svelte 5', 'Runes', 'Reactivity', 'JavaScript', 'Web Development'],
    coverImage: 'https://picsum.photos/id/0/400/300'
  },
  {
    id: 'flutter-animations',
    title: 'Mastering Flutter Animations: From Basics to Advanced',
    excerpt: 'Learn how to create beautiful, performant animations in Flutter that bring your mobile apps to life.',
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
      name: 'Michael Park',
      avatar: 'https://i.pravatar.cc/150?img=8',
      role: 'Mobile App Developer'
    },
    category: 'Flutter',
    readTime: 15,
    publishedAt: '2024-01-22',
    tags: ['Flutter', 'Animations', 'Mobile Development', 'Dart', 'UI/UX'],
    coverImage: 'https://picsum.photos/id/48/400/300'
  },
  {
    id: 'sveltekit-architecture',
    title: 'Building Scalable Applications with SvelteKit',
    excerpt: 'A comprehensive guide to architecting large-scale applications with SvelteKit, covering best practices, patterns, and real-world examples.',
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
      name: 'Emma Wilson',
      avatar: 'https://i.pravatar.cc/150?img=9',
      role: 'Full-stack Developer'
    },
    category: 'SvelteKit',
    readTime: 18,
    publishedAt: '2024-01-20',
    tags: ['SvelteKit', 'Architecture', 'Scalability', 'Web Development', 'Best Practices'],
    coverImage: 'https://picsum.photos/id/180/400/300'
  }
];

export function getPost(id: string): Post | undefined {
  return posts.find(post => post.id === id);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getRelatedPosts(currentId: string, limit: number = 3): Post[] {
  const currentPost = getPost(currentId);
  if (!currentPost) return [];

  // Prioritize same category
  const sameCategoryPosts = posts
    .filter(p => p.id !== currentId && p.category === currentPost.category);
  
  const otherPosts = posts
    .filter(p => p.id !== currentId && p.category !== currentPost.category)
    .sort(() => Math.random() - 0.5);

  return [...sameCategoryPosts, ...otherPosts].slice(0, limit);
}