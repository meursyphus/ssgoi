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

const DRILL_ROUTES = {
  LIST: '/posts',
} as const;

const DRILL_ROUTE_WILDCARD = `${DRILL_ROUTES.LIST}/*`;
const DRILL_DETAIL_PREFIX = `${DRILL_ROUTES.LIST}/`;

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
            @if (currentPath() === ROUTES.LIST) {
              <div [ssgoiTransition]="ROUTES.LIST" class="min-h-full">
                <app-drill-posts-list (navigate)="onNavigate($event)" />
              </div>
            } @else if (currentPost(); as post) {
              <div [ssgoiTransition]="detailPath(post.id)" class="min-h-full">
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
  protected readonly ROUTES = DRILL_ROUTES;
  currentPath = signal<string>(DRILL_ROUTES.LIST);
  readonly ssgoiConfig = {
    transitions: [
      {
        from: DRILL_ROUTES.LIST,
        to: DRILL_ROUTE_WILDCARD,
        transition: drill({ direction: 'enter' }),
      },
      {
        from: DRILL_ROUTE_WILDCARD,
        to: DRILL_ROUTES.LIST,
        transition: drill({ direction: 'exit' }),
      },
    ],
  };
  readonly blogPosts = BLOG_POSTS;

  // Computed signal to get current post based on path
  currentPost = computed(() => {
    const path = this.currentPath();
    if (!path.startsWith(DRILL_DETAIL_PREFIX)) {
      return undefined;
    }

    const postId = path.slice(DRILL_DETAIL_PREFIX.length);
    return this.blogPosts.find((post) => post.id === postId);
  });

  onNavigate(path: string) {
    this.currentPath.set(path);
  }

  detailPath(id: string) {
    return `${DRILL_DETAIL_PREFIX}${id}`;
  }
}
