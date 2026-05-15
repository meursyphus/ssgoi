# Page 레이어 (demo)

## 위치
`demo/{showcase}/page/{route}/`

`src/app/demo/{showcase}/...`의 라우트 파일들은 이 페이지 컴포넌트를 import해서 렌더링만 한다.

## 구조

**Always split page into separate section files.** Don't put everything in one file.

```
page/{route}/
  ├── index.tsx           # Compose sections only
  ├── hero-section.tsx
  ├── features-section.tsx
  └── cta-section.tsx
```

- `index.tsx` imports and arranges sections
- Each section is its own file

## Layout

```
page/layout/
  ├── index.tsx       # 서버 컴포넌트: 초기 데이터 fetch (있다면) → client 렌더
  └── client.tsx      # 클라이언트: Provider 스택 + 모바일/데스크탑 셸 + Ssgoi config
```

- 서버 컴포넌트(`index.tsx`): 서버에서 데이터 fetch (있을 경우)
- 클라이언트 컴포넌트(`client.tsx`): 쇼케이스 전용 provider 스택을 여기서 모두 건다.
  ```tsx
  <StateProvider>          {/* @/lib/state — ComwitProvider 래퍼 */}
    <OverlayProvider>      {/* overlay-kit — popup.confirm/alert */}
      <MobileFrame>        {/* @/lib/components/mobile-frame — 공통 목업 */}
        <Ssgoi config={...}>
          {children}
        </Ssgoi>
      </MobileFrame>
      <Toaster />
    </OverlayProvider>
  </StateProvider>
  ```
- 모바일/데스크탑 분기는 여기서 처리 (`MobileFrame`이 데스크탑에서는 가운데 mock device, 모바일에서는 풀스크린). 라우트 페이지에서 매번 분기하지 않는다.
- 루트 `src/app/layout.tsx`에는 provider를 올리지 않는다 — 각 쇼케이스가 독립적으로 자기 provider 스택을 가진다.

## 규칙
- `'use client'` 필수 (layout 서버 컴포넌트 제외)
- `<img />` 사용 (`<Image />` 금지 — Cloudflare Workers 호환)
- 내부 라우팅은 `<Link>` from `next/link` 사용 (`<a>` 금지). 외부 링크(`http://`, `https://`, `mailto:`, `tel:`, `#앵커`)는 `<a>` 허용
- API 직접 import 금지 → state 경유
- layout/index.tsx는 서버 컴포넌트, layout/client.tsx는 클라이언트
- **클라이언트 데이터 가공 금지** → 모든 가공은 API에서:
  - `.filter().length`, `.reduce()` 등 집계 금지 → API에서 group/sum
  - `.filter(o => o.status === 'x')` 등 상태 필터링 금지 → API에서 where 조건
  - `.slice(0, N)` 등 잘라내기 금지 → API에서 limit/order by
  - 이유: 페이지네이션 시 현재 페이지 데이터만으로 잘못된 수치가 나옴, 전체 데이터가 아닌 부분 데이터를 가공하는 것은 항상 틀림

## UI Components

- Use shadcn from `@/lib/components/ui`
- **네이티브 input/textarea/select 직접 사용 금지** → `@/lib/components/ui` 컴포넌트 사용 (`Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Calendar`, `Editor` 등). 필요한 컴포넌트가 없으면 추가 후 사용.
- Tailwind v4
- **Animation**: 페이지 전환은 ssgoi (이게 데모의 주역). 컴포넌트 내부의 작은 인터랙션은 Tailwind animation으로 시작하고, 복잡해지면 `motion` from `motion/react`. (relayout 피하기: scale/translate/opacity 우선, x/y/width/height 회피)
- Use regular `<img>` tags (NOT Next.js `<Image>`)
- For initial design: use Unsplash images (`https://images.unsplash.com/...`)
- Icons: use `lucide-react`

## How to Use Domain State

### Import domain state

```tsx
import { useRoom } from "@/demo/air-bnb/state/room"
import type { RoomDetail } from "@/demo/air-bnb/state/room"
```

### Rules

- One domain hook call per file
- No destructuring — use namespace style
- Access via `domain.field` and `domain.actions.method()`

### Example

```tsx
// Good: One call, namespace style
const room = useRoom((state) => ({
  rooms: state.rooms,
  actions: state.actions,
}))

// Bad: Multiple calls for same domain
const rooms = useRoom((state) => state.rooms)
const actions = useRoom((state) => state.actions)

// Bad: Destructuring
const { rooms, actions } = useRoom()
```

### Query 데이터 사용

query 필드는 `data` 외에도 로딩/에러 상태를 함께 제공한다.

```tsx
const room = useRoom((state) => ({
  rooms: state.rooms,
  actions: state.actions,
}))

if (room.rooms.isLoading) return <Skeleton />
if (room.rooms.isError) return <Error error={room.rooms.error} />
return room.rooms.data.items.map((r) => <Card key={r.id} room={r} />)
```

### isFetching — 백그라운드 재조회

`isFetching`은 refetch, 페이지 전환 등 백그라운드 요청 중일 때 `true`.
`isLoading`과 달리 기존 데이터가 유지된 채로 동작한다.

```tsx
const room = useRoom((state) => ({
  rooms: state.rooms,
  actions: state.actions,
}))

if (room.rooms.isLoading) return <Skeleton />

return (
  <div>
    {room.rooms.isFetching && <Spinner className="fixed top-4 right-4" />}
    {room.rooms.data.items.map((r) => <Card key={r.id} room={r} />)}
    <Pagination
      currentPage={room.rooms.data.page}
      totalPages={room.rooms.data.totalPages}
      onPageChange={(page) => room.actions.loadRooms(page)}
    />
  </div>
)
```

> `isLoading` = 첫 로딩 (data 없음) · `isFetching` = 백그라운드 재조회 (data 있음)

## SSR Detail Pages

### SEO Critical (initial data from app router)

```tsx
"use client"
export default function RoomDetailPage({ initialData }) {
  const room = useRoom((s) => ({ actions: s.actions }))
  room.actions.init(initialData) // silent, no re-render
  // ...
}
```

App router 쪽:
```tsx
import { room } from '@/demo/air-bnb/api/room'
import RoomDetailPage from '@/demo/air-bnb/page/room-detail'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await room.find(id)
  return <RoomDetailPage initialData={data} />
}
```

### Non-SEO (Client loading)

```tsx
"use client"
export default function RoomDetailPage({ id }: { id: string }) {
  const room = useRoom((state) => ({
    current: state.currentRoom,
    actions: state.actions,
  }))

  useEffect(() => {
    room.actions.loadCurrent(id)
  }, [id])
  // ...
}
```
