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
- 모바일/데스크탑 분기는 여기서 처리 (`MobileFrame`이 데스크탑에서는 내부 스크롤이 있는 가운데 mock device, 모바일에서는 문서 자체가 스크롤되는 풀스크린). 라우트 페이지에서 매번 분기하지 않는다.
- 루트 `src/app/layout.tsx`에는 provider를 올리지 않는다 — 각 쇼케이스가 독립적으로 자기 provider 스택을 가진다.

## Bottom nav 규칙 (모바일 데모 공통)

**백 아이콘이 있는 상세 화면엔 바텀 네비가 없고, 나머지 메인 화면엔 있다.** 네비는 항상 트랜지션 boundary **안**(sticky)에 둔다 — `MobileFrame`의 `bottomSlot`은 모든 트랜지션 밖이라 상세 진입 시 네비가 얼어붙으므로 쓰지 않는다.

- **탭이 여러 개인 데모** (google-photos, kakao-talk, pinterest, youtube-mobile, gamja-market, material-mail, voyage, air-bnb): `@/lib/components/mobile-tabs-shell`의 `MobileTabsShell` + `mobile-detail-shell`의 `MobileDetailShell` 사용. 라우트를 `(tabs)`/`(detail)` 그룹으로 나누고, `(tabs)/layout.tsx`가 데모별 tabs-shell(탭 전환 config + nav만 정의)을, `(detail)/layout.tsx`가 `MobileDetailShell`을 렌더한다. 패턴 설명은 `MobileTabsShell` JSDoc 참고. 이때 데모 layout은 `withTransitionBoundary={false}`.
  - 탭 콘텐츠 boundary는 top bar와 nav 사이를 채우는 flex column이다. 내용이 짧은 탭 페이지가 배경을 화면 끝까지 칠하려면 페이지 루트에 `flex-1`을 준다 (`min-h-full`은 여기서 풀리지 않는다).
  - air-bnb는 `(tabs)` 그룹만 tabs shell을 쓰고 `(detail)` 그룹은 없다. 상세·검색·컬렉션은 페이지가 자기 `SsgoiRouteBoundary`를 렌더한다 (checkout의 persistent routeKey 시트 유지).
- **메인 화면이 하나인 데모**: 셸 분리 없이 메인 페이지 컴포넌트 마지막에 sticky 네비를 렌더하면 된다 (`withTransitionBoundary` 기본값 유지 — layout boundary가 페이지째 감싸므로 네비도 트랜지션을 같이 탄다). FAB 등 플로팅 요소는 네비 위로 offset.

## 하단 safe area (모바일 데모 공통)

화면 맨 아래에 붙는 바(바텀 네비, 하단 CTA·입력 바, 플로팅 네비·FAB)는 홈 인디케이터 영역만큼 `--safe-bottom`으로 띄운다. 값은 실기기에선 `env(safe-area-inset-bottom)`, 폰 목업 iframe(`ShowcasePhone`/`PhoneFrame`, 인디케이터를 iframe 위에 그림) 안에선 34px, 데스크탑 직접 보기(`MobileFrame` 베젤이 인디케이터를 콘텐츠 **아래**에 그림)에선 0. 첫 페인트 전에 `app/demo/layout.tsx`가 정하므로(`lib/phone-safe-area.ts`) 데모는 토큰만 쓴다. `env(safe-area-inset-bottom)` 직접 사용 금지 — iframe 안에선 항상 0이다.

```tsx
// 도킹된 네비: 바 높이는 그대로 두고 배경을 인셋까지 늘린다
<nav className="sticky bottom-0 box-content h-[68px] border-t pb-safe">…</nav>
// 하단 padding이 이미 있는 바: 인셋 + spacing
<div className="sticky bottom-0 px-4 pt-3 pb-safe-3">…</div>
// 플로팅 네비·FAB: 인셋 위로 띄운다
<div className="absolute bottom-safe-4 inset-x-0">…</div>
```

- 유틸: `pb-safe` `mb-safe` `bottom-safe` `h-safe` = 인셋, `pb-safe-<n>` `mb-safe-<n>` `bottom-safe-<n>` = 인셋 + `--spacing(n)`, `pb-safe-[10px]` = 인셋 + 임의값. 그 밖의 조합은 `var(--safe-bottom)` (예: `pb-[max(var(--safe-bottom),12px)]`).
- 탭바 아이템은 iOS처럼 인셋 바로 위에 붙어도 된다 (`pb-[max(var(--safe-bottom),0.75rem)]`). 버튼·입력 바는 인셋 위로 자기 여백을 둔다 — 직접 보기의 padding이 더 크면 `pb-[max(1.25rem,calc(var(--safe-bottom)+0.75rem))]`처럼 둘 다 지킨다.
- 플로팅 네비 뒤로 스크롤되는 페이지는 마지막 여백도 인셋을 더한다 (`pb-safe-24`).
- 하단 바가 없는 화면은 그대로 둔다 — 콘텐츠는 iOS처럼 인디케이터 밑까지 스크롤된다.

## 뒤로/닫기 (모바일 데모 공통)

뒤로·닫기는 전부 공용 헬퍼로 만든다. 데모별 `use-back`, `history.length > 1`, pathname 스택, `router.back()` 직접 호출은 쓰지 않는다.

```tsx
// 뒤로/닫기 아이콘 — 기본은 이것 (링크라서 hydration 전 탭, 새 탭 열기도 정상 동작)
import { DemoBackLink } from "@/lib/components/demo-back-link";

<DemoBackLink fallback={BASE} aria-label="Back" className="...">
  <ChevronLeft />
</DemoBackLink>
```

```tsx
// 링크가 아닌 버튼, 전송·발행·저장 후 화면 닫기
import { useDemoBack } from "@/lib/hooks";

const close = useDemoBack(routes.order(orderId));
<button type="button" onClick={close}>닫기</button>
```

- **동작**: 이 frame의 바로 앞 기록이 같은 데모(`/demo/<slug>`, 현재 pathname에서 유도)의 same-document 화면이면 `history.back()` → SSGOI가 그 기록의 전환을 역재생한다. 아니면(직접 진입, 새로고침, 쇼케이스 클립 첫 구간) `fallback`으로 **replace** — 닫은 화면이 기록에 남지 않아 부모의 뒤로가 그 화면을 다시 열지 않는다. `scroll={false}`/prefetch는 기본값.
- **`fallback` 고르기**: 이 화면에서 규칙이 **backward로 풀리는** 부모. `on` 스코프를 벗어나는 곳(on-leave), `from`/`to`의 `from` 쪽(pair reversed), `ordered`의 앞 인덱스. replace는 push와 같은 규칙으로 풀린다. 단 양쪽이 같은 `on` 스코프(`except` 없음) 안이면 history 방향(=forward)으로 재생되니 `except`를 추가하거나 다른 fallback을 고른다 — 규칙 체커로 확인.
- **여러 부모 중 특정 화면까지**: `match`를 주면 가장 가까운 일치 기록까지 `history.go(-n)` (중간의 데모 기록은 건너뜀, 데모 밖으로는 안 나감). `useDemoBack(fallback, { match: (p) => p === routes.explore })` / `<DemoBackLink fallback={...} match={...}>`.
- **왜 `history.length`가 아닌가**: 쇼케이스 iframe에서는 부모 문서의 기록까지 세므로 `router.back()`이 docs 페이지 자체를 뒤로 보낸다. Navigation API(`navigation.entries()`)는 이 frame 기록만 보고, `sameDocument`로 새로고침 이전 기록(전환 없이 전체 로드)을 거른다. API가 없는 브라우저는 항상 fallback.
- 판정만 필요하면 `previousEntryIsInDemo()` from `@/lib/demo-history`.

## 규칙
- `'use client'` 필수 (layout 서버 컴포넌트 제외)
- `<img />` 사용 (`<Image />` 금지 — Cloudflare Workers 호환)
- 내부 라우팅은 `<Link>` from `@/lib/link` 사용 (`next/link` 직접 import, `<a>` 금지). `@/lib/link`는 prefetch 기본 on인 `next/link`. 데모 안 링크에는 `scroll={false}` (스크롤은 SSGOI가 모바일 문서/데스크탑 프레임에서 관리). 외부 링크(`http://`, `https://`, `mailto:`, `tel:`, `#앵커`)는 `<a>` 허용
- 뒤로/닫기는 `DemoBackLink` / `useDemoBack` (위 "뒤로/닫기" 참고)
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
