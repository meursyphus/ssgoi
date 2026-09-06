# Plan 1 — Motion Theme (애니메이션 타이밍 테마 인터페이스)

브랜치: `feat/motion-theme-and-video-analyzer` (latest `9774ea0`에서 분기).
구현 착수 시 `feat/motion-theme`로 쪼개는 것을 권장 (Plan 2와 독립 배포 가능).

## 0. 한 줄 요약 (v1 범위)

**오버라이드만 한다. 테마는 나중.** 모든 프리셋이 두 번째 인자 `{ override }`를 받는다:
`drill({ type }, { override: { forward, backward } })`. 콜백 인자는 프리셋이 반환하는
**`MultiAnimation` 그 자체**이고, 고치는 값은 `anim.set("in"|"out"|"shared"|"overlay", { integrator })`와
`anim.startAt` 둘뿐이다. 구현체(`transition.ts`)는 손대지 않는다 — 각 프리셋의 공개 `index.ts`가
`withOverride()`로 감싸 확장된 타입으로 노출하고, 라벨은 wrapper가 **요소 동일성**(`from`→out,
`to`→in)과 `data-ssgoi-id`(overlay)로 붙인다. deprecated 별칭(axis `feel`, drill `crossfade`,
sheet `background-scale`, zoom `fade`)은 공개 타입에서 지운다. 적분기는 시맨틱 프리셋
(`smooth`, `snappy`, …)이나 공개된 클래스로 만든다.

## 1. 현황 진단

### 1.1 물리값이 흩어져 있음

`packages/core/src/lib/transitions/**` 안에 spring/inertia 상수가 20군데 이상 하드코딩되어
있고 공개 API로 바꿀 방법이 없다.

| 프리셋 | 위치 | 물리 | 비고 |
| --- | --- | --- | --- |
| axis x snappy | `axis/provider/x/snappy.ts` | spring 600/40 double×1.2 | out/in 동일, parallel |
| axis x fluid | `axis/provider/x/fluid.ts` | out inertia 150/1.5, in spring 180/34 | sequence |
| axis y directional | `axis/provider/y/directional.ts` | out inertia 150/1.5, in spring 180/34 | sequence |
| axis y non-directional | `axis/provider/y/non-directional.ts` | out inertia 150/1.5, in spring 400/30 double×1.2 | parallel |
| axis z | `axis/provider/z/*.ts` | spring 280/30 | parallel |
| drill parallax | `drill/provider/parallax.ts` | spring 230/25, follower 600/50 | out/in 공유 |
| drill slide | `drill/provider/crossfade.ts` | spring 250/23 | out/in 공유 |
| sheet static | `sheet/provider/static.ts` | spring 190/25 ×2 | 전 트랙 공유 |
| sheet scale / blur | `sheet/provider/{background-scale,blur}.ts` | enter spring 200/24, exit inertia 25/1.2 | 전 트랙 공유 |
| zoom static | `zoom/provider/static.ts` | spring 530/34 | 전 트랙 공유 |
| zoom expand / blur | `zoom/provider/{expand,blur}.ts` | spring 380/30, follower 260/30 | 전 트랙 공유 |
| hero default / smooth | `hero/provider/variant/*.ts` | 320/30, 300/30 double×1 | 전 트랙 공유 |
| slide | `slide/transition.ts` | 170/22 double×0.8 | out/in 공유 |
| fade | `fade/transition.ts` | 180/20, 170/20 double | sequence |
| blind / strip / rotate / scroll / film / jaemin | 각 transition.ts | 17/6 ~ 200/22 | web용 |

### 1.2 같은 "역할"인데 체감 길이가 제각각

Apple 공식(§2.1)으로 현재 값을 `duration/bounce`로 환산하면 (스크립트 계산):

| 이름 | k | c | ζ | bounce | 체감 D | settle(60fps) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 기본값 (IntegratorProvider) | 300 | 30 | 0.87 | 0.13 | 363ms | 517ms |
| axis x snappy | 600 | 40 | 0.82 | 0.18 | 257ms | 417ms |
| axis x fluid in | 180 | 34 | 1.27 | −0.21 | 468ms | 717ms |
| axis y non-dir in | 400 | 30 | 0.75 | 0.25 | 314ms | 317ms |
| drill parallax | 230 | 25 | 0.82 | 0.18 | 414ms | 467ms |
| drill slide | 250 | 23 | 0.73 | 0.27 | 397ms | 533ms |
| sheet static | 190 | 25 | 0.91 | 0.09 | 456ms | 667ms |
| zoom static | 530 | 34 | 0.74 | 0.26 | 273ms | 350ms |
| hero default | 320 | 30 | 0.84 | 0.16 | 351ms | 450ms |
| slide | 170 | 22 | 0.84 | 0.16 | 482ms | 967ms |
| fade | 180 | 20 | 0.75 | 0.25 | 468ms | 800ms |

"페이지가 들어온다"는 같은 역할인데 체감 길이가 257~482ms, bounce가 −0.21~0.27로
흩어져 있다. 앱 하나 안에서 drill → sheet → zoom을 섞어 쓰면 일관된 느낌이 나올 수 없는
구조. "육안으로 비슷하게 맞추는데 엉망"의 근본 원인.

### 1.3 프리셋이 실제로 만드는 트랙 인벤토리 (2026-09 기준)

`new WebAnimation(` 호출을 전부 세어 정리한 것. **이 표가 통합 모델의 근거다.**

| 프리셋 | 트랙 (요소 · 무엇이 변하나) | 적분기 공유 | 합성 |
| --- | --- | --- | --- |
| axis | out 페이지(translate+opacity, snappy/non-dir out은 opacity만) · in 페이지(translate+opacity) | **각각** | parallel(startAt) 또는 sequence |
| drill | out 페이지 · in 페이지 (parallax로 기하 결합) | 공유 1개 | parallel |
| slide | out · in | 공유 1개 | parallel |
| fade | out(opacity) · in(opacity) | 각각 | sequence |
| sheet | 시트 페이지(translateY) · 배경 페이지(scale+opacity) · 오버레이(blur) | 공유 1개, **방향으로 선택**(enter spring / exit inertia) | parallel |
| zoom | 타일(= 페이지 노드 자체, rect morph) · 배경 페이지(scale) · 페이지 opacity(fade variant) · 오버레이(blur) | 공유 1개 | parallel |
| hero | 타일 클론(morph) · from/to 페이지 opacity(fade type) | 공유 1개 | parallel |
| blind | 스트립 N개 out → 스트립 N개 in | 공유 | 중첩 sequence(parallel, parallel) |

관찰:

1. **노드(in/out)와 방향(forward/backward)은 서로 다른 축이다.** in/out은 노드의 종류일 뿐이고
   방향은 별개로 지정될 수 있어야 한다. 적분기를 공유하는 프리셋(drill·sheet·zoom·hero)에서
   방향이 하는 일은 **어느 노드가 리드하는지**를 정하는 것이다: drill은 forward면 in 페이지가
   앞에서 리드하고 backward면 out 페이지가 리드한다. sheet는 forward면 시트(in)가 올라오고
   backward면 시트(out)가 내려간다. 그래서 물리는 (방향, 리드 노드)로 결정된다.
2. 노드가 2개든 3개든, 기하학적으로 묶인 트랙들은 **한 적분기를 공유해야** 한다
   (zoom 배경은 타일을 향해 줄어들고, sheet 배경 scale은 시트 높이에 결합). 이 결합은
   테마가 깰 수 없고 프리셋이 결정한다.
3. 동시/순차는 트랙 그룹 사이의 합성이고 효과의 정체성이라 테마 밖.

### 1.4 현재 공개 props 표 (v6 `{ type, variant, options }`)

`packages/core/src/lib/transitions/*/index.ts` 기준. 공개 이름은 `variant`이고 `feel`은 axis의
deprecated 별칭이다(내부 provider 키로만 남아 있음). **물리는 어느 프리셋에서도 공개되지
않는다** — 6개 프리셋이 내부 `physics?` 옵션을 갖지만 공개 index가 전부 버린다.

| 프리셋 | `type` (기본) | `variant` (기본) | `options` | deprecated 별칭 | 내부에만 있음 (공개 안 됨) |
| --- | --- | --- | --- | --- | --- |
| axis | `x` · `y` · `z` | x: `default`(=fluid) · `snappy` / y: `default`(=directional) · `non-directional` / z: `default` | — | `feel: "snappy"｜"fluid"` (x) | z `non-directional` provider(도달 불가) |
| drill | `parallax` · `slide` | `default` | — | `type: "crossfade"` | — |
| sheet | `static` · `scale` · `blur` | `default` | — | `type: "background-scale"` | — |
| zoom | `static` · `expand` · `blur` | `default` · `fade` | — | `fade: boolean` | — |
| hero | `static` · `fade` | `default` · `smooth` | — | — | — |
| slide | — | `default` | — | — | — |
| fade | `fade-through` | `default` | — | — | — |
| film | — | `default` | `borderColor` | — | `physics`(3 스프링 오버라이드), `border.color` |
| blind | `horizontal` · `vertical` | `default` | (빈 object) | — | `blindCount`(10), `blindColor`(#000), `physics` |
| scroll | `directional` · `non-directional` | `default` | (빈 object) | — | `physics` |
| strip | — | `default` | — | — | `physics` |
| rotate | — | `default` | — | — | `physics` |
| jaemin | — | `default` | — | — | `physics`, `initialRotation`(45), `initialScale`(0.01), `rotationTriggerPoint`(0.8) |

관찰:

1. 공개 축은 정확히 둘 + options다. 이 문서의 "feel"은 공개적으로는 **`variant`** 다.
2. `variant`가 `default` 하나뿐인 프리셋이 13개 중 10개. §3.9의 "타이밍만 다른 feel 프리셋"이
   들어갈 자리가 바로 이 빈 슬롯이다(`drill({ variant: "snappy" })`).
3. 내부 `physics?` 옵션 7군데(film 포함)는 §3의 `override`/`theme`으로 대체되므로 공개할 필요
   없이 정리 대상이다.
4. 테마 key는 기본값을 채운 전체 경로로 쓴다: `axis/x/default`, `axis/x/snappy`,
   `axis/y/non-directional`, `drill/parallax`, `sheet/blur`, `zoom/expand/fade`, `hero/fade/smooth`,
   `slide`, `fade`, `film`, `blind/vertical`, `scroll/non-directional`, `strip`, `rotate`, `jaemin`.

## 2. 리서치 요약

### 2.1 Apple — duration + bounce (WWDC23 "Animate with springs")

- 파라미터 2개: `duration`(perceptual ≈ settle), `bounce ∈ [−1, 1]`.
- 변환식 (mass 1): `stiffness = (2π/D)²`, `damping = 4π(1−bounce)/D` (bounce ≥ 0),
  `damping = 4π/(D(1+bounce))` (bounce < 0). 즉 `bounce = 1 − ζ`.
- SwiftUI 프리셋: `.smooth`(0.5s, b 0), `.snappy`(0.5s, b 0.15), `.bouncy`(0.5s, b 0.3).
  0.15는 거의 안 튕김, 0.3부터 체감, **0.4 초과는 UI에 부적합**.
- 핵심: bounce를 바꿔도 체감 길이가 유지되게 파라미터화. stiffness/damping은 하나만
  바꿔도 길이·튕김이 같이 바뀌어 튜닝이 발산한다.

### 2.2 Material 3 Expressive — MotionScheme

- 토큰 `{spatial, effects} × {fast, default, slow}`. spatial = 위치/크기, effects =
  opacity/color 등 비공간(항상 ζ = 1, 튕기지 않음).
- 스킴 두 벌(`standard`, `expressive`)을 `MaterialTheme(motionScheme=…)` 한 줄로 교체.
  컴포넌트는 숫자를 모르고 토큰만 참조.

| 토큰 | standard (k / ζ) | expressive (k / ζ) | ssgoi 환산 (k / c), 체감 D |
| --- | --- | --- | --- |
| spatial.fast | 1400 / 0.9 | 800 / 0.6 | 1400/67.3 (168ms) · 800/33.9 (222ms, b .4) |
| spatial.default | 700 / 0.9 | 380 / 0.8 | 700/47.6 (237ms) · 380/31.2 (322ms, b .2) |
| spatial.slow | 300 / 0.9 | 200 / 0.8 | 300/31.2 (363ms) · 200/22.6 (444ms, b .2) |
| effects.fast | 3800 / 1.0 | 동일 | 3800/123 (102ms) |
| effects.default | 1600 / 1.0 | 동일 | 1600/80 (157ms) |
| effects.slow | 800 / 1.0 | 동일 | 800/56.6 (222ms) |

(출처: m3.material.io motion, Flutter `motor` 패키지 토큰 구현. 단위는 Compose와 같은
mass 1 · 변위 0→1 정규화라 ssgoi 적분기에 그대로 들어간다.)

### 2.3 Motion(구 Framer Motion) — `visualDuration` + `bounce`

`spring({ visualDuration, bounce })` → Newton 반복으로 ω₀를 풀어 stiffness/damping 산출
(`motion-dom/animation/generators/spring/find.mjs`, docs 앱 의존성에 이미 있음).
`dampingRatio = 1 − bounce`로 Apple과 동일.

### 2.4 springs.studio — 의미 토큰

`motion.drawer.enter`처럼 목적 이름으로 참조, exit는 enter의 70%로 더 빠르게, 에이전트가
읽는 JSON/DTCG 내보내기.

### 2.5 시사점

1. 사람 단위는 `duration + bounce`. 물리값은 파생.
2. 테마는 **역할**로 말하고 숫자는 모른다. 프리셋은 역할을 선언한다.
3. 통째로 교체, 부분 덮어쓰기는 extend.
4. 효과(opacity/blur)는 튕기지 않는다.
5. exit는 enter보다 빠르다.
6. 시간 스케일 `speed`는 1급 노브.

## 3. 설계

### 3.0 엔진 책임 지도 — 무엇을 바꾸고 무엇을 두는가

| 클래스 | 받는 것 | 하는 일 | 오버라이드 |
| --- | --- | --- | --- |
| `WebAnimation` | `element`, `integrator`, `style(t,u)`, bounds, 콜백 | play 때 적분기 60fps 시뮬레이션 → `style`로 키프레임 → WAAPI 재생, 안정 프레임 후 컴포지터 핸드오프, 라이브 pose, 모션 매칭 | `integrator`만 |
| `MultiAnimation` | `children`, `{ mode, startAt }` | 앞 자식 라이브 진행률이 `startAt`에 닿으면 다음 자식 시작, 상태 집계, pose 팬아웃 | `startAt`만 |
| `HostAnimation` | 트랜지션마다 `attach(next)` | 이전 pose를 다음에 넘겨 잇기, 배속·정지 상태 유지(데모 독) | — |
| 트랜지션(프리셋) | `prepare`/`animation` | 어떤 노드·어떤 `style`·어떤 적분기·어떤 겹침으로 묶을지, 시작 스타일·z-index·정리 | `type/feel/variant`로만 |

`element`와 `style`은 효과의 정체성이라 두고, 재생 시점에 읽히는 두 값(`integrator`,
`startAt`)만 바꾼다. `style`도 기술적으로는 재생 시점에 읽히지만 그걸 바꾸는 건 다른 효과를
만드는 것이므로 새 트랜지션(§3.7)으로 간다.

### 3.1 왜 되는가 — 엔진이 이미 지연 평가한다

- `WebAnimation.runToward()`는 `play()` 때 `simulate(this.integrator, …)`를 돈다. 생성 후 재생
  전에 `integrator`를 바꾸면 그 값으로 시뮬레이션된다.
- `MultiAnimation.scheduleStart()`는 실행 시점에 `this.startAt[next]`를 읽는다. 재생 전에 바꾸면
  그 겹침으로 돈다.
- 프리셋의 `animation()`은 `MultiAnimation`을 만들어 반환하고, 디스패처가 `host.attach()`로
  재생한다(`create-ssgoi-transition-context.ts:391-421`). 프리셋은 반환 직전에 옵션 `override`를,
  디스패처는 attach 직전에 앱 `override`를 적용한다.

필요한 엔진 변경은 **라벨 + setter 공개**뿐이다.

```ts
// animation/web-animation.ts
interface WebAnimationOptions { …; label?: string; follows?: WebAnimation }
class WebAnimation { readonly label?: string; readonly follows?: WebAnimation; get integrator(); set integrator(i) }

// animation/multi-animation.ts
class MultiAnimation {
  readonly children: readonly Animation[];
  get startAt(): number[]; set startAt(v: number[]);
  /** 라벨로 WebAnimation을 찾는다. 중첩 MultiAnimation은 재귀. */
  select(label: string): WebAnimation[];
  /** 라벨의 리드에 패치. follows로 묶인 팔로워에 전파. 팔로워 라벨에 직접 걸면 dev 경고 후 무시. */
  set(label: string, patch: { integrator?: Integrator | PhysicsOptions }): this;
}
```

`follows`가 기하 결합을 표현한다. drill의 파랄랙스 짝, zoom 배경, sheet 배경·오버레이는
리드를 `follows`하고 `set(리드)`가 전파한다.

### 3.2 라벨 — wrapper가 요소 동일성으로 붙인다 (transition.ts 무변경)

`withOverride`는 `animation(args)`의 반환값을 받아 `args.from`/`args.to`와 각 `WebAnimation.element`를
비교해 라벨을 붙인다. 실제 프리셋을 전수 확인한 결과(§1.3의 `new WebAnimation` 31곳):

| 규칙 | 근거 | 해당 |
| --- | --- | --- |
| `element === from` → `out` | 페이지 트랙은 전부 from/to 실제 노드 | 13개 프리셋 모두. 정확 |
| `element === to` → `in` | 동상 | 동상 |
| `element.dataset.ssgoiId`가 `*-overlay` → `overlay` | 디스패처 `createElement(id)`가 `data-ssgoi-id`를 붙임. sheet `sheet-overlay`, zoom `zoom-overlay` | sheet, zoom |
| 나머지 생성 요소 → `shared` | hero 클론(`cloneNode`). zoom의 "타일"은 클론이 아니라 페이지 노드 자체(`tileEl = isEnter ? to : from`)라 in/out으로 잡힌다 | hero |
| 자식이 요소 없는 `MultiAnimation`이면 인덱스로 `out`/`in` | blind = `Multi([outPhase, inPhase], sequence)` | blind |
| film | 세 스프링을 구운 `LinearIntegrator` 트랙이라 적분기 교체가 의미 없음 | wrapper 옵션 `labels: false` → `set` 무시 |

억지가 아닌 이유: 사용자가 실제로 만지는 `in`/`out`은 요소 동일성으로 **정확**하고, `shared`/
`overlay`는 디스패처가 이미 남기는 id로 구분된다. 전제는 "프리셋당 id 없는 생성 요소는 한
종류"인데 현재 전부 만족한다. 깨지는 프리셋이 생기면 그 파일에만 `label:` 한 줄을 넣는다.

**결합(coupled).** 한 물리를 공유해야 하는 프리셋은 wrapper가 `coupled: true`로 표시하고,
그 경우 `set(어느 라벨이든)`이 모든 `WebAnimation`에 적용된다.

| 프리셋 | 라벨 | coupled | 기본 `startAt` |
| --- | --- | --- | --- |
| axis, fade | `out` · `in` | ✗ | snappy `[0,0]`, fluid·directional·fade `[0,1]` |
| slide, drill | `out` · `in` | ✓ (파랄랙스·동시 이동) | `[0,0]` |
| sheet | forward `in`(시트)·`out`(배경) / backward 반대, `overlay` | ✓ | `[0,0,0]` |
| zoom | `in`/`out`(타일 = 페이지 자체, 배경, 페이드) · `overlay` | ✓ | `[0,…]` |
| hero | `shared`(클론, 여러 개 가능) · `out`/`in`(fade 타입 페이지) | ✗ | `[0,…]` |
| blind | `out` · `in` (각 Multi, 스트립은 그 자식) | ✗ | `[0,1]` |
| scroll, strip, rotate, jaemin | `out` · `in` | ✗ | 프리셋별 |
| film | — | — (무시) | — |

### 3.3 사용 — 두 번째 인자 `{ override }`, 방향별

```ts
type OverrideFn = (anim: MultiAnimation, ctx: SsgoiTransitionContext) => void;
type Override = OverrideFn | { forward?: OverrideFn; backward?: OverrideFn };
type PresetExtras = { override?: Override };          // 두 번째 인자. 나중에 theme 등 확장 자리

drill(config?: DrillConfig, extras?: PresetExtras)   // 모든 프리셋 동일
```

```ts
import { drill, axis, sheet, hero } from "@ssgoi/react/view-transitions";
import { smooth, snappy, swift, gentle, accelerate, spring, SpringIntegrator } from "@ssgoi/react/motion";

// 양방향 같음 — 함수 하나. drill은 coupled라 어느 라벨이든 전체에 적용
drill({ type: "parallax" }, { override: (anim) => anim.set("in", { integrator: snappy }) })

// 방향별
drill({}, { override: {
  forward:  (anim) => anim.set("in",  { integrator: smooth }),
  backward: (anim) => anim.set("out", { integrator: swift }),
}})

// 노드별 + 겹침 — axis는 out/in 독립
axis({ type: "x" }, { override: {
  forward:  (anim) => { anim.set("in", { integrator: snappy }).set("out", { integrator: accelerate }); anim.startAt = [0, 0.3]; },
  backward: (anim) => { anim.startAt = [0, 0]; },
}})

// sheet — coupled. 방향으로 리드가 바뀌므로 방향별로 쓰는 게 자연스럽다
sheet({ type: "blur" }, { override: {
  forward:  (anim) => anim.set("in",  { integrator: gentle }),
  backward: (anim) => anim.set("out", { integrator: accelerate }),
}})

// hero — 타일과 페이지 페이드 따로
hero({ type: "fade" }, { override: (anim) => {
  anim.set("shared", { integrator: spring({ duration: 0.45, bounce: 0.15 }) });
  anim.set("in", { integrator: swift }).set("out", { integrator: swift });
  anim.startAt = [0, 0.2, 0.2];
}})

// 클래스 직접, 기존 모양도 통과
axis({ type: "y" }, { override: (anim) => {
  anim.set("in", { integrator: new SpringIntegrator({ stiffness: 400, damping: 30 }) });
  anim.set("out", { integrator: { inertia: { acceleration: 150, resistance: 1.5 } } });
}})
```

규칙에서는 `transition: drill({ type }, { override })`로 끝난다. 규칙 키는 늘지 않는다.

### 3.4 (나중) 앱 전체 — 테마는 프리셋 key별 Override 표

프리셋 인스턴스마다 **key**가 있다: `name/type/feel|variant`. 예) `axis/x/snappy`,
`axis/y/non-directional`, `drill/parallax`, `sheet/blur`, `hero/fade/smooth`, `film`.
테마는 이 key로 Override를 묶은 표다. `*`는 key가 없을 때의 라벨 기반 폴백.

```ts
type Theme = Override | Record<string, Override>;    // 함수 하나 = 전부에, 표 = key별

<Ssgoi config={{ theme: themes.ios, transitions }}>

export const ios: Theme = {
  "*":                (anim) => anim.set("in", { integrator: smooth }).set("out", { integrator: swift }).set("shared", { integrator: snappy }),
  "drill/parallax":   { forward: (anim) => anim.set("in", { integrator: smooth }), backward: (anim) => anim.set("out", { integrator: swift }) },
  "sheet/*":          { forward: (anim) => anim.set("in", { integrator: gentle }),  backward: (anim) => anim.set("out", { integrator: accelerate }) },
  "axis/x/snappy":    (anim) => { anim.set("in", { integrator: swift }).set("out", { integrator: swift }); anim.startAt = [0, 0]; },
};
```

순서: 프리셋 기본값(= 내장 `ssgoi` 테마, provider 상수) → 앱 `theme[key]`(없으면 `theme["*"]`)
→ 프리셋 옵션 `override`. 방향 분기는 각 Override 안에서. 라벨이 없는 곳에서 `set`은 조용히
지나간다. `sheet/*` 같은 접두 매칭은 규칙 매처(`path-pattern.ts`)를 재사용한다.

### 3.5 시맨틱 적분기 프리셋과 수동 생성

적분기는 사용자가 만들어 넣는다. 만들기 번거로우니 "느낌"으로 미리 만든 인스턴스를 둔다.
값은 ssgoi가 최적 UX 타이밍으로 관리하고 Plan 2로 실측·보정한다.

| 이름 | 종류 | 초기값 (D / bounce) | 쓰는 곳 |
| --- | --- | --- | --- |
| `smooth` | spring | 0.40s / 0 | 기본 in |
| `snappy` | spring | 0.30s / 0.15 | 탭·짧은 이동 |
| `bouncy` | spring | 0.45s / 0.30 | 강조. UI 상한 |
| `gentle` | spring | 0.55s / 0 | 큰 표면(sheet) |
| `swift` | spring | 0.20s / 0 | opacity·blur, 빠른 exit |
| `accelerate` | inertia | 0.20s 도달 | out 쪽 낙하 |

(SwiftUI `.smooth/.snappy/.bouncy`의 bounce 0/0.15/0.3을 따르되 duration은 페이지 전환에 맞게
짧게 잡은 추정치. §1.2와 대조하면 axis snappy ≈ `snappy`, fluid in ≈ `smooth`, out inertia ≈
`accelerate`, sheet ≈ `gentle`.)

수동은 클래스를 공개해 직접 만들거나 상속한다. `spring()`은 편의일 뿐이다.

```ts
new SpringIntegrator({ stiffness: 400, damping: 30, restDelta: 0.1 })
class Overshoot extends SpringIntegrator { step(s, target, dt) { return super.step(s, target * 1.05, dt); } }
const custom: Integrator = { step(state, target, dt) { … }, isSettled(state, target) { … } };
spring({ duration: 0.28, bounce: 0.05 })   // Apple 식 → SpringIntegrator
easeIn({ duration: 0.15 })                 // → InertiaIntegrator (acceleration 역산)
scale(snappy, 1.2)                         // 어떤 적분기든 시간 스케일 (dt·s 래퍼, 클래스 무관)
describe(snappy)                           // → { duration, bounce, zeta, settleMs }
```

내장 적분기는 상태를 `IntegratorState`에만 두는 무상태 객체라 하나를 여러 애니메이션이
공유해도 안전하다. 이 계약을 `Integrator` 문서에 명시하고 커스텀 구현에도 요구한다.
시간 스케일 법칙(검증 완료): spring `k·s², c·s`; inertia(quadratic) `a·s², r 유지`.

### 3.6 겹침 — `startAt`은 이미 있다. 확인은 `schedule()`

겹침은 `MultiAnimation.startAt`이다. 새 개념이 아니라 setter만 연다. 진행률 기준이라 적분기를
바꿔도 겹침의 의미가 유지된다. 확인은 film의 `bakeStaggerSchedule`을 일반화한 `schedule(anim)`:
DOM 없이 각 자식의 적분기와 `startAt`으로 60fps 시뮬레이션해 `[{ label, startMs, settleMs }]`
간트를 낸다. transition-lab 독에 그리고, 테스트가 "fluid의 in은 out 정착 후"를 단언하고,
Plan 2가 녹화의 레이어별 t0와 나란히 놓는다.

**film도 MultiAnimation으로.** film이 세 스프링을 굽는 이유는 셋이 같은 요소의 `transform`
문자열 하나(`translateY(…) scale(…)`)에 합쳐지기 때문이다(`film/transition.ts:467,485`). CSS
개별 변환 속성 `translate`/`scale`(Chrome 104+, Safari 14.1+, Firefox 72+)로 바꾸면 한 요소에
두 WAAPI 트랙을 독립으로 걸 수 있어 bake가 필요 없다:

```
MultiAnimation([
  out:    from.scale   1 → 0.8               (scaleDown)
  shared: from.translate 0 → −H              startAt 0.2 of out
          to.translate   H → 0   follows shared
  in:     to.scale     0.8 → 1               startAt 0.8 of shared
  corners follows out
], { startAt: [0, 0.2, 0, 0.8, …] })
```

그러면 film도 예외 없이 `set("out"|"shared"|"in")`과 `startAt`으로 고쳐지고, `schedule()`은
그냥 MultiAnimation 시뮬레이션이다. `bakeStaggerSchedule`은 `schedule()` 구현으로만 남는다.
스냅샷 테스트로 곡선 동일성을 보장한다(체인 트리거 규칙이 bake와 같다).
이 전환 전까지 film은 **따로 노출하지 않는다**: 라벨이 없으므로 `set`은 조용히 지나가고,
film 전용 인자도 두지 않는다.

### 3.7 새 트랜지션 — `withOverride`로 같은 확장을 받는다

```ts
import { defineTransition, withOverride, WebAnimation, MultiAnimation } from "@ssgoi/react";
import { smooth, accelerate, type PresetExtras } from "@ssgoi/react/motion";

const base = () => defineTransition({
  prepare: ({ to }) => { to.then((el) => { el.style.transform = "translate3d(100%,0,0)"; }); return {}; },
  animation: ({ from, to }) => new MultiAnimation([
    new WebAnimation({ element: from, integrator: accelerate, style: (t) => ({ opacity: 1 - t }) }),
    new WebAnimation({ element: to,   integrator: smooth,     style: (t) => ({ transform: `translate3d(${100 * (1 - t)}%,0,0)` }) }),
  ], { startAt: [0, 0.3] }),
});

// 프리셋 index.ts가 하는 것과 같은 한 줄. from/to 동일성으로 out/in이 붙는다
export const myPush = (extras: PresetExtras = {}) => withOverride(base(), extras.override);
```

### 3.8 내부 — wrapper 하나, index.ts 한 줄씩

```ts
// motion/with-override.ts
export function withOverride(
  config: AnyTransitionConfig,
  override: Override | undefined,
  opts: { coupled?: boolean; labels?: boolean } = {},
): AnyTransitionConfig {
  if (!override) return config;
  return {
    ...config,
    animation: (args) => {
      const anim = config.animation(args);
      if (opts.labels !== false && anim instanceof MultiAnimation) {
        labelByIdentity(anim, args.from, args.to);      // §3.2 규칙
        anim.coupled = opts.coupled ?? false;
      }
      const fn = typeof override === "function" ? override : override[args.context.direction];
      if (anim instanceof MultiAnimation) fn?.(anim, args.context);
      return anim;                                     // 디스패처가 그대로 host.attach
    },
  };
}

// transitions/drill/index.ts — 기존 본문 그대로, 반환만 감싼다
export function drill(config: DrillConfig = {}, extras: PresetExtras = {}): AnyTransitionConfig {
  const internalType = resolveInternalType(config.type);
  return withOverride(transition({ type: internalType }), extras.override, { coupled: true });
}
```

엔진 쪽 변경은 getter/setter뿐이다: `WebAnimation.element`(get), `.integrator`(get/set), `.label`
(get/set); `MultiAnimation.children`(get), `.startAt`(get/set), `.coupled`, `.select(label)`,
`.set(label, { integrator })`(coupled면 전체). `set`의 `PhysicsOptions` 리프는
`IntegratorProvider.from`으로 정규화. 사용자가 보는 최종 타입은 `TransitionConfig` 그대로이고
프리셋 함수 시그니처만 `(config, extras)`로 넓어진다.

### 3.9 (나중) feel — 미리 정의된 타이밍 프리셋, theme이 key별로 맞춘다

프리셋 인자는 지금도 두 축이다: `type`(기하·메커니즘: x/y/z, parallax/slide, static/scale/blur)과
`feel`/`variant`(맛: snappy/fluid, default/smooth). 여기에 `options`. 그리고 "같은 type에 여러
타이밍"은 정확히 §3.3의 두 값(라벨별 적분기 + `startAt`)의 조합이다. 그러니:

- **feel = 기하 차이(있으면) + 기본 타이밍 한 벌.** snappy는 8px·parallel·600/40, fluid는
  30px·sequence·inertia+180/34. 타이밍만 다른 feel은 provider 한 줄이라 얼마든지 늘린다:
  `feel: "snappy" | "fluid" | "brisk" | "lazy" | "kakao" | "ios" | "material"` 같은 식으로 레퍼런스
  앱 이름을 feel로 미리 정의해 두는 것도 된다(Plan 2가 실측한 값이 그대로 들어간다).
- **theme = key별로 그 타이밍을 통째로 바꾼 표.** 내장 `ssgoi` 테마는 provider의 현행 상수
  그 자체이고, `ios`/`material` 테마는 같은 key들에 다른 값을 넣은 표다. 앱은 테마 하나로
  모든 프리셋·feel의 타이밍을 한 번에 일관되게 가져간다.
- **override = 그 위의 한 곳 예외.**

세 층이 같은 어휘(라벨 + `startAt`)를 쓰므로 Plan 2 출력은 어느 층에든 붙는다: 한 화면이면
`override`, 앱 전체면 `theme[key]`, 라이브러리에 넣을 값이면 provider의 feel 기본값.

## 4. 구현 단계 (v1)

### 4.1 엔진 — getter/setter (behavior 무변경)

- `WebAnimation`: `element` get, `integrator` get/set, `label` get/set.
- `MultiAnimation`: `children` get, `startAt` get/set, `coupled` 필드, `select(label)`(재귀),
  `set(label, { integrator })`(coupled면 전체, `PhysicsOptions`는 `IntegratorProvider.from`).
- `Integrator` 문서에 무상태 계약. 적분기 클래스 4종 + 타입을 메인 엔트리와 `/motion`에서 export.
- 테스트: setter 후 `play()`가 새 적분기·새 startAt으로 시뮬레이션되는지, 중첩 `select`.

### 4.2 wrapper와 헬퍼

- `motion/with-override.ts`: `withOverride`, `labelByIdentity`, `Override`/`PresetExtras` 타입.
- `motion/spring.ts`: `spring()`, `easeIn()`, `describe()`, `scale()`(dt·s 래퍼). 왕복·스케일 테스트.
- `motion/presets.ts`: `smooth/snappy/bouncy/gentle/swift/accelerate` 인스턴스.
- `motion/schedule.ts`: film의 `bakeStaggerSchedule`을 `schedule(anim)`으로 추출(film은 재import).
- 테스트: 라벨 규칙을 프리셋 13개 × direction × variant에 대해 스냅샷(어떤 요소가 어떤 라벨을
  받는지), coupled 전파, 방향 선택, film 무시.

### 4.3 프리셋 index.ts — 두 번째 인자 + deprecated 제거

- 13개 `index.ts`: 시그니처를 `(config, extras)`로, 반환을 `withOverride(...)`로. `coupled`는
  slide·drill·sheet·zoom, `labels: false`는 film. `transition.ts`는 무변경.
- 공개 타입에서 제거: axis `feel`/`AxisFeelDeprecated`, drill `"crossfade"`/`DrillTypeDeprecated`,
  sheet `"background-scale"`/`SheetTypeDeprecated`, zoom `fade`. 내부 provider 키는 그대로.
  (선택) axis z `variant: "non-directional"` 공개 — 내부 provider가 이미 있다.
- 스냅샷 테스트: `extras` 없이 얻은 자식별 60fps 곡선과 시작 시각이 변경 전과 동일.

### 4.4 어댑터·문서

- 어댑터 6종은 `config`를 통과만 시키므로 무변경. `/motion` 서브패스 re-export 추가.
- `/docs/motion` 페이지: 라벨 규칙 그림, `{ override }` 방향별, coupled 표, 시맨틱 프리셋 표,
  `spring()`/클래스 수동 생성. `withOverride`로 커스텀. `llms/motion.txt` + `llms.txt` 링크.
  deprecated 제거는 릴리스 노트에 명시. 릴리스 시 `Current version:` 갱신.
- transition-lab에 라벨별 시맨틱 프리셋 셀렉터 + `schedule()` 간트 패널.

### 4.5 규모·순서

엔진 약 120 LOC, wrapper·헬퍼 약 400 LOC, index.ts 13개(각 3~5줄), 문서 1페이지.
4.1 → 4.2 → 4.3(스냅샷 통과) → 4.4. 이후 테마(§3.4·§3.9)는 `PresetExtras`와
`SsgoiConfig`에 키를 더하는 것으로 이어진다.

## 5. 열린 결정

1. 시맨틱 프리셋 6종의 초기값(§3.5)은 추정치. Plan 2로 실측해 확정.
2. `shared` 규칙의 전제("프리셋당 id 없는 생성 요소는 한 종류")를 테스트로 고정할지, 아니면
   hero·zoom 두 파일에 `label:`을 명시해 전제를 없앨지. 전자로 시작.
3. blind의 인덱스 라벨(0→out, 1→in)은 blind 전용 가정. 테스트로 고정.
4. film: v1 무시. 개별 `translate`/`scale` 속성으로 MultiAnimation 전환은 후속(§3.6).
5. `easeIn({duration})` 역산 기준: "타깃 도달" 시각을 duration으로 정의.

## 6. 출처

- Apple WWDC23 "Animate with springs": https://developer.apple.com/videos/play/wwdc2023/10158/
- 변환식 정리: https://www.kvin.me/posts/effortless-ui-spring-animations
- SwiftUI `.snappy` / `.bouncy` 기본값: Apple SwiftUI `Animation` 문서
- Material 3 Motion: https://m3.material.io/styles/motion/ , 토큰 수치: https://pub.dev/packages/motor
- M3 Expressive motion theming: https://m3.material.io/blog/m3-expressive-motion-theming
- Motion `spring()`: https://motion.dev/docs/spring
- springs.studio: https://www.springs.studio/
