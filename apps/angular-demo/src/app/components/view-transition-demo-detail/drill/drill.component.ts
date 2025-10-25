import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';
import { Ssgoi, SsgoiTransition } from '@ssgoi/angular';
import { drill } from '@ssgoi/angular/view-transitions';
import { BrowserMockupComponent } from '../shared/browser-mockup.component';
import {
  DrillPostsListComponent,
  BLOG_POSTS,
} from './drill-posts-list.component';
import { DrillPostDetailComponent } from './drill-post-detail.component';

// Main Drill Demo Component
@Component({
  selector: 'app-drill-demo',
  imports: [
    BrowserMockupComponent,
    Ssgoi,
    SsgoiTransition,
    DrillPostsListComponent,
    DrillPostDetailComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <div class="bg-gray-950 min-h-full">
        <div class="max-w-md mx-auto overflow-hidden">
          <div class="relative z-0 w-full" ssgoi [config]="ssgoiConfig">
            @if (currentPath() === '/posts') {
              <div ssgoiTransition="/posts" class="min-h-full">
                <app-drill-posts-list (navigate)="onNavigate($event)" />
              </div>
            } @else if (currentPost(); as post) {
              <div [ssgoiTransition]="'/posts/' + post.id" class="min-h-full">
                <app-drill-post-detail
                  [post]="post"
                  (navigate)="onNavigate($event)"
                />
              </div>
            }
          </div>
        </div>
      </div>
    </app-browser-mockup>
  `,
})
export class DrillDemoComponent {
  currentPath = signal('/posts');
  readonly ssgoiConfig = {
    transitions: [
      {
        from: '/posts',
        to: '/posts/*',
        transition: drill({ direction: 'enter' }),
      },
      {
        from: '/posts/*',
        to: '/posts',
        transition: drill({ direction: 'exit' }),
      },
    ],
  };
  readonly blogPosts = BLOG_POSTS;

  // Computed signal to get current post based on path
  currentPost = computed(() => {
    const path = this.currentPath();
    const postId = path.replace('/posts/', '');
    return this.blogPosts.find((post) => post.id === postId);
  });

  onNavigate(path: string) {
    this.currentPath.set(path);
  }
}
