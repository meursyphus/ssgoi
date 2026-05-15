# API Reference (demo)

ssgoi 데모용 모킹 API. **실제 서버/DB/네트워크는 없다.** 모든 데이터는 같은 도메인 폴더 안의 `data.ts`(또는 `data/`) 에서 가져온다.

화면이 "진짜 동작하는 것처럼" 보이는 데 필요한 만큼만 구현한다.

## 위치
`demo/{showcase}/api/{domain}/`

## 구조
```
api/{domain}/
  ├── index.ts          # typed client (resolveActions로 묶어서 export)
  ├── types.ts          # API method signatures + Resource types
  ├── data.ts           # mock 데이터 (작을 때 — 단일 파일)
  │                     # 또는
  ├── data/             # mock 데이터 (커지면 — 폴더로 분할)
  │     ├── rooms.ts
  │     ├── reviews.ts
  │     └── index.ts
  └── actions/
        └── *.ts        # find / findAll / create / ... 각 server action
```

- `data.ts` / `data/`는 **이 도메인 폴더 안에서만** import한다. 다른 도메인/state/page에서 직접 참조 금지 — 반드시 api(server action)를 거친다.
- 단일 파일로 시작했다가 양이 늘면 `data/` 폴더로 쪼갠다.

## 규칙
- **모킹 only**: HTTP 클라이언트, fetch, repository 같은 건 쓰지 않는다. 데이터는 전부 `data.ts`/`data/` 안의 in-memory 객체.
- **도메인 = 페이지 핏**: 리소스(테이블) 중심이 아니라 어느 화면에서 쓰일지를 기준으로 묶는다. 화면이 바뀌면 api 응답도 바뀐다. 메인 화면에 핏한 내용을 하나의 도메인으로 묶는 걸 권장.
- **Minimal args**: userId/session 같은 건 mock 내부에서 가정한다 (예: "로그인된 mock user"). 파라미터로 받지 않는다.
- **Server actions**: 모든 메서드는 `'use server'` async 함수.
- **Frontend-friendly**: UI에서 바로 쓸 수 있게 변환해서 반환
  ```ts
  // data 원본
  { likeCount: 3, userId: 'abc' }
  // api 반환
  { likeCount: 3, isLikedByMe: true, displayCount: '3개' }
  ```
- **Latency 시뮬레이션**: 필요하면 actions 내부에서 `await sleep(200~400ms)` 정도로 흉내. 너무 길게 잡지 않는다. 데모는 ssgoi 트랜지션이 주역이라 latency가 길면 답답해 보임.
- **Type safety**: `DomainAPI` 인터페이스를 types.ts에 정의.
- **List 응답**: 페이지네이션이 있는 화면이면 `Pageable<T>` 형태로 통일. 타입은 도메인 types.ts에 정의하거나 쇼케이스 공통 타입을 두고 import.

## 작성 순서
1. **types.ts 먼저** — 어떤 화면에서 쓰일지 생각하며 API 인터페이스와 응답 타입 정의
2. `data.ts` (또는 `data/`) — mock 시드 데이터 작성
3. `actions/*.ts` — server action 구현 (data 읽고 변환)
4. `index.ts` — typed client

## types.ts

```ts
export interface RoomAPI {
  /** 목록 조회 */
  findAll: (filter: FindAllFilter) => Promise<Pageable<RoomSimple>>
  /** 상세 조회 */
  find: (id: string) => Promise<RoomDetail>
}

export type Pageable<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type FindAllFilter = {
  search?: string
  page?: number
}

export type RoomSimple = {
  id: string
  title: string
  thumbnail: string
  pricePerNight: number
}

export type RoomDetail = RoomSimple & {
  description: string
  images: string[]
}
```

## data.ts (또는 data/)

화면이 살아 있는 것처럼 보이는 데 필요한 시드 데이터. 가능하면 함수로 감싸서 actions에서 호출할 때마다 안전한 복제본을 돌려준다 (배열 mutation이 다른 호출을 오염시키지 않게).

**단일 파일 패턴 — 데이터가 적을 때:**
```ts
// data.ts
import type { RoomDetail } from './types'

const seed: RoomDetail[] = [
  {
    id: 'r-001',
    title: '한강뷰 도심 스튜디오',
    thumbnail: 'https://images.unsplash.com/photo-...',
    pricePerNight: 120000,
    description: '...',
    images: ['https://images.unsplash.com/photo-...'],
  },
  // ...
]

export const data = {
  all: () => seed.map((r) => ({ ...r })),
  byId: (id: string) => {
    const found = seed.find((r) => r.id === id)
    return found ? { ...found } : null
  },
}
```

**폴더 패턴 — 종류가 많아지면:**
```ts
// data/rooms.ts
export const rooms: RoomDetail[] = [ /* ... */ ]

// data/reviews.ts
export const reviews: Review[] = [ /* ... */ ]

// data/index.ts
import { rooms } from './rooms'
import { reviews } from './reviews'

export const data = {
  rooms: {
    all: () => rooms.map((r) => ({ ...r })),
    byId: (id: string) => rooms.find((r) => r.id === id) ?? null,
  },
  reviews: {
    forRoom: (roomId: string) => reviews.filter((r) => r.roomId === roomId).map((r) => ({ ...r })),
  },
}
```

## actions/*.ts (Server Actions)

- `'use server'` 필수
- 모든 export는 `createAction`으로 감싼다 (병렬 실행 직렬화 우회 + 에러 메시지 노출 처리)
- 내부 함수는 `_` prefix, `createAction(_xxx)`로 감싼 결과를 export
- **데이터 출처는 같은 폴더의 `data.ts`/`data/`만**

### 에러는 `ActionError`로 throw

- 사용자에게 노출하고 싶은 메시지는 **반드시** `new ActionError("...")`로 throw
- 일반 `new Error(...)`는 Next.js가 마스킹한다

```ts
'use server'

import { createAction, ActionError } from '@/lib/utils'
import { data } from '../data'
import type { RoomDetail } from '../types'

async function _find(id: string): Promise<RoomDetail> {
  const room = data.byId(id)
  if (!room) throw new ActionError('숙소를 찾을 수 없습니다')
  return room
}

export const find = createAction(_find)
```

## index.ts

- `resolveActions()`로 감싸서 export
- 개별 함수 export 금지 — 객체로만 export
- 타입 어노테이션 없음 (추론에 맡김)
- `resolveActions`는 인자에 들어 있는 comwit proxy(state)를 자동으로 deep-snapshot 한다. 호출부(state action)에서 `snapshot()`을 따로 감쌀 필요 없음.

```ts
import { resolveActions } from '@/lib/utils'

export * from './types'

import { find } from './actions/find'
import { findAll } from './actions/find-all'

export const room = resolveActions({ find, findAll })
```

**호출 측:**
```ts
// 단일 호출
const r = await room.find(id)

// 병렬 호출 — Promise.all 쓰면 자동으로 병렬 실행
const [rooms, stats] = await Promise.all([
  room.findAll(filter),
  room.getStats(),
])

// ActionError 메시지는 일반 Error로 다시 throw되어 try/catch에서 잡힘
try {
  await room.find(id)
} catch (e) {
  toast(e.message)
}
```
