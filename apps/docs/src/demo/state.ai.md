# State 레이어 (demo)

## 위치
`demo/{showcase}/state/{domain}/`

## comwit 추가 API & 자세한 문법

이 문서는 자주 쓰는 comwit 패턴만 다룬다. comwit에는 이 외에도 다양한 API가 있다.

- `persist()` — 모델 필드를 localStorage/sessionStorage에 자동 동기화 (테마, 최근 본 항목 등)
- `query.realtime()` — 실시간 구독
- `derive` — 다른 필드에서 파생되는 읽기 전용 계산 필드
- `rules` — 필드 단위 유효성 검사 (`state.$validation`로 접근)
- `@Retry()` — 실패 시 재시도 (지수 백오프 지원)
- `@Queue()` — 동시성 제어 (drop / queue / replace)
- `@Log()`, `@Validate()` — 로깅 / 인자 검증

이런 API의 사용법, 옵션, 시그니처는 https://library.comwit.io/llms.txt 에서 확인한다.

## 구조

```
state/room/
  ├── types.ts          # State + Actions types
  ├── model.ts          # model() with initial state
  ├── actions/
  │     ├── init.ts     # SSR silent 초기화
  │     ├── load.ts     # loadList, loadDetail (query)
  │     ├── crud.ts     # create, update, delete
  │     └── interact.ts # like, bookmark 등
  └── index.ts          # create() hook + re-exports
```

**types.ts를 먼저 작성한다.** Write order: types.ts → model.ts → actions/\*.ts → index.ts

## 공통 규칙

- model에서는 list + detail + stats 함께 관리 — CRUD 시 optimistic update + 관련 query 모두 refetch
- action에는 부수효과를 모두 한번에 정의 (UI 컴포넌트에 노출 X)
  - toast sonner, `@/lib/utils/popup`(popup.confirm, popup.alert) 등을 action 내에서 호출
  - 타 모델의 상태가 필요한 경우 action 에서 인자로 받지 말고, 내부에서 `state()`로 cross model import
  - action은 최대한 인자를 받지 않고 내부 상태로 관리 (사용하는 곳에서 많은 정보를 알 필요 없게)
- api의 타입을 re-export하거나 추가 정의
- 의존 흐름: `page → state → api`

## types.ts

State + Actions 타입 정의. `Query<TData, TArg>` 로 query 필드 타입 지정.

```ts
import { Query } from 'comwit'
import type { RoomSimple, RoomDetail, Pageable } from '@/demo/air-bnb/api/room'

export type RoomState = {
  rooms: Query<Pageable<RoomSimple>, { page: number }>
  currentRoom: RoomDetail | null
  // 일반 데이터 — query 아닌 로컬 상태
  selectedIds: string[]
  isEditMode: boolean
}

export type RoomActions = {
  init(currentRoom: RoomDetail): void
  loadRooms(page: number): Promise<void>
  like(): Promise<void>
  openDetail(id: string): void
  toggleSelect(id: string): void
  clearSelection(): void
  setEditMode(value: boolean): void
}
```

## model.ts

- query 두 가지: `query<TData, TArg>()` (일반), `query.infinite<TData, TArg>()` (무한스크롤)
- `keepPreviousData`: pagination query에서만 사용

```ts
import { model, query, keepPreviousData } from 'comwit'
import { room as roomAPI } from '@/demo/air-bnb/api/room'

export const room = model<RoomState>({
  rooms: query<Pageable<RoomSimple>, { page: number }>({
    initialData: { items: [], total: 0, page: 1, limit: 20, totalPages: 0 },
    queryFn: ({ page }) => roomAPI.findAll({ page }),
    placeholderData: keepPreviousData,
  }),
  currentRoom: null,
  selectedIds: [],
  isEditMode: false,
})

// query.infinite — 무한스크롤
export const feed = model<FeedState>({
  posts: query.infinite<Post[], void>({
    initialData: [],
    queryFn: async (_, { cursor }) => {
      const page = cursor ? Number(cursor) : 1
      const res = await feedAPI.findAll({ page })
      return { data: res.items, cursor: String(page + 1), hasMore: page < res.totalPages }
    },
  }),
})
```

Query methods: `.query(arg?)` · `.refetch()` · `.nextFetch()` · `.previousFetch()`
Query data: `data` · `isLoading` · `isFetching` · `isSuccess` · `isError` · `error` · `hasMore` · `cursor`

```ts
// action — infinite query loadMore
async loadMore() {
  await this.model.posts.nextFetch()
}
```

## actions/

- Actions에 모든 side effect — UI handler는 action 하나만 호출
- 확인 동작: `popup.confirm()` 사용 (`@/lib/utils/popup`)

### init.ts — SSR silent 초기화

- `silent()`로 서버 데이터 주입. useEffect 사용 금지
- SSR silent init으로 처리할 데이터라면 클라이언트 컴포넌트에서 `useEffect`로 `init()`을 호출하지 말고, 렌더 중 즉시 `actions.init(initialData)`를 호출한다.

```ts
// actions/init.ts
import { action, silent } from 'comwit'
import { room } from '../model'

export const initActions = action<Pick<RoomActions, 'init'>>(({ state }) => {
  class InitActions {
    private model = state(room)
    init(currentRoom: RoomDetail) {
      silent(() => { this.model.currentRoom = currentRoom })
    }
  }
  return new InitActions()
})
```

```tsx
// Page — SSR → Client hydration
export default async function Page({ params }) {
  const { id } = await params
  const detail = await room.find(id)
  return <RoomDetailPage initialRoom={detail} />
}
function RoomDetailPage({ initialRoom }) {
  const room = useRoom((s) => ({ actions: s.actions }))
  room.actions.init(initialRoom) // silent — no re-render
  return <Detail />
}
```

### load.ts — query 호출

```ts
import { action } from 'comwit'
import { room } from '../model'

export const loadActions = action<Pick<RoomActions, 'loadRooms'>>(({ state }) => {
  class LoadActions {
    private model = state(room)

    async loadRooms(page: number) {
      await this.model.rooms.query({ page })
    }
  }
  return new LoadActions()
})
```

### 일반 데이터 조작 — push, filter, 직접 할당

query가 아닌 일반 필드는 action에서 직접 변경. 배열은 `push`, `pop`, `splice`, 재할당(`filter` 등) 모두 가능.

```ts
export const selectActions = action<Pick<RoomActions, 'toggleSelect' | 'clearSelection' | 'setEditMode'>>(({ state }) => {
  class SelectActions {
    private model = state(room)

    toggleSelect(id: string) {
      const idx = this.model.selectedIds.indexOf(id)
      if (idx >= 0) this.model.selectedIds.splice(idx, 1)
      else this.model.selectedIds.push(id)
    }

    clearSelection() { this.model.selectedIds = [] }
    setEditMode(value: boolean) { this.model.isEditMode = value }
  }
  return new SelectActions()
})
```

### crud.ts — CRUD + popup.confirm

```ts
import { action, OnError } from 'comwit'
import { toast } from 'sonner'
import { popup } from '@/lib/utils/popup'
import { room as roomAPI } from '@/demo/air-bnb/api/room'
import { room } from '../model'

export const crudActions = action<Pick<RoomActions, 'delete'>>(({ state }) => {
  class CrudActions {
    private model = state(room)

    @OnError((e: unknown) => {
      toast.error(e instanceof Error ? e.message : 'Unexpected error')
    })
    async delete(id: string) {
      if (!await popup.confirm({ title: '정말 삭제하시겠어요?' })) return
      const snapshot = [...this.model.rooms.data.items]
      this.model.rooms.data.items = this.model.rooms.data.items.filter((r) => r.id !== id)
      try {
        await roomAPI.delete(id)
        await this.model.rooms.refetch()
      } catch {
        this.model.rooms.data.items = snapshot
        throw new Error('삭제에 실패했습니다')
      }
    }
  }
  return new CrudActions()
})
```

### interact.ts — Cross-model + Router

`state()`로 다른 모델 읽기. `@Authorized`로 auth guard. `context`로 router 접근.

```ts
import { action, Authorized, OnError } from 'comwit'
import type { AppContext } from '@/lib/state'
import { user as userModel } from '@/demo/air-bnb/state/user/model'
import { room } from '../model'

export const interactActions = action<Pick<RoomActions, 'like' | 'openDetail'>, AppContext>(({ state, context }) => {
  class InteractActions {
    private model = state(room)
    private user = state(userModel)

    @Authorized({
      when: () => !!this.user.me,
      onDeny: () => context.router.push('/login'),
    })
    @OnError((e: unknown) => {
      toast.error(e instanceof Error ? e.message : 'Unexpected error')
    })
    async like() {
      this.model.currentRoom!.likeCount += 1
      await roomAPI.like(this.model.currentRoom!.id)
    }

    openDetail(id: string) { context.router.push(`/demo/air-bnb/rooms/${id}`) }
  }
  return new InteractActions()
})
```

## UI 사용

- **query 쓰면 UI에서 isLoading 체크 필수**

```tsx
const room = useRoom((s) => ({ rooms: s.rooms }))
if (room.rooms.isLoading) return <Skeleton />
return room.rooms.data.items.map((r) => <Card key={r.id} room={r} />)
```

## Decorators

| Decorator | Purpose |
|-----------|---------|
| `@OnError(fn)` | 에러 시 사이드이펙트 (에러는 자동 전파, 콜백에서 re-throw 금지). 기본: `toast.error()` |
| `@OnSuccess(fn)` | 성공 콜백 |
| `@Debounce(ms)` | Debounce |
| `@Throttle(ms)` | Throttle |
| `@Authorized({ when, onDeny })` | Auth guard |

### 재사용 데코레이터 — `intercept`

같은 전제조건(로그인 필수, 권한 체크, 공통 로깅 등)을 여러 action에 반복 적용할 때 `intercept`로 커스텀 데코레이터를 만든다.

```ts
import { intercept } from 'comwit'
import { user } from '@/demo/air-bnb/state/user/model'

const LoginRequired = intercept(({ state, context }) => {
  const u = state(user)
  return {
    intercept: (execute, args) => {
      if (!u.me) {
        context.router.push('/login')
        return
      }
      return execute(...args)
    },
  }
})
```

**클래스 전체에 적용**

```ts
@LoginRequired
class PostCrudActions {
  async create(title: string) { ... }
  async update(id: string, title: string) { ... }
  async delete(id: string) { ... }
}
```

- 클래스 데코 + 메서드 데코를 함께 쓸 수 있다. 실행 순서: **바깥(class) → 안쪽(method)**
- `execute`를 호출하지 않으면 원 메서드는 실행되지 않는다 (early return으로 차단)
- 에러 핸들링은 `@OnError`와 조합 — intercept 내부에서 toast 처리할 필요 없음
