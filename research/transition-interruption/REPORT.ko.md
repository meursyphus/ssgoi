# SSGOI의 연속적인 페이지 전환 설계

## 1. 설계의 중심

**SSGOI가 유지해야 할 것은 이전 transition 객체 자체보다, 화면에 남아 있는 대상의 현재 자세와 운동 상태다.** 기존·신규 animation이 움직이는 요소를 ID로 연결하고, 같은 ID의 대상은 그 순간의 위치와 속도에서 계속 움직인다. 새 탐색은 목적지와 연출을 갱신한다. 같은 효과의 역전환은 기존 운동의 목표만 바꾸고, 다른 효과로 넘어갈 때는 공통 좌표에서 상태를 넘기거나 새 연출에 잔차를 붙인다.

이 방향에는 세 가지 서로 다른 선례가 있다. SwiftUI와 Compose는 오래 살아 있는 animatable value에 새 목표를 전달한다. Flutter Hero는 이미 비행 중인 shared element의 목적지를 바꾼다. 게임의 inertialization은 새 애니메이션으로 넘어갈 때 자세와 속도의 차이를 보정한다. 세 가지를 SSGOI의 페이지 생명주기와 결합하는 것이 가장 유망하다. 각각의 보장 범위와 제약은 4장에서 구분한다. [1](https://developer.apple.com/videos/play/wwdc2023/10156/) [3](https://developer.android.com/develop/ui/compose/animation/value-based) [4](https://api.flutter.dev/flutter/widgets/Hero-class.html) [10](https://theorangeduck.com/page/spring-roll-call)

권장하는 우선순위는 다음과 같다.

1. **동일한 대상·동일한 좌표계:** 전체 integrator state를 보존하고 target을 바꾼다.
2. **같은 움직임을 다르게 매개화한 효과:** 위치와 속도를 함께 좌표 변환한다.
3. **zoom → drill처럼 궤적의 모양까지 바뀜:** 새 연출의 출력에 pose/velocity 잔차를 더하고 감쇠시킨다.
4. **이전 페이지에만 남는 요소:** 현재 운동을 이어 퇴장시키되, 보존 비용과 화면 복잡도를 제한한다.
5. **의미상 다른 대상 또는 표현 불가능한 변화:** 명시적인 fade·settle·skip으로 전환한다.

이를 위해서는 물리 엔진보다 한 단계 위에 **어떤 대상을 이어받을지, 누가 현재 화면을 쓸지, 언제 자원을 버릴지**를 결정하는 계층이 필요하다. 이 보고서에서는 그 계층을 `MotionScene`이라고 부른다. 명칭과 API는 제안이며, 기존 SSGOI의 구현된 기능을 뜻하지 않는다.

![그림 1. 최신 탐색 의도와 계속 살아 있는 화면 운동을 분리하는 구조](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/assets/scene.svg)

그림 1의 핵심은 `A → B` 객체가 끝났는지와 A·B의 화면 표현이 사라져야 하는지를 같은 질문으로 취급하지 않는 것이다. 새 목적지가 C여도 A는 잠시 퇴장 중일 수 있고, B는 들어오던 속도를 유지한 채 나가는 역할로 바뀔 수 있다. 탐색 의도는 하나여도 화면에는 여러 생애 단계의 surface가 공존한다.

## 2. 현재 코드가 이미 가진 것과 끊기는 지점

현재 코드는 전부 취소만 하는 구조는 아니다. **단일 animation에 대한 운동 재개 기반은 있고, 페이지 수준의 handoff가 아직 그 기반을 충분히 활용하지 못한다.** 이 구분이 구현 범위를 크게 줄여 준다.

| 지점 | 확인한 구현 | 이번 설계에 주는 의미 |
|---|---|---|
| `Animation` 계약 | `getPose`, `getTimeline`, `matchInto`가 이미 존재 | 상태 인계라는 방향을 새로 발명할 필요가 없다. [C1](#c1) |
| `HostAnimation.attach` | 이전 pose 채집 → `prev.complete()` → `next.matchInto(pose)` → 재생 상태 전달 | handoff 훅은 있지만, 인계와 강제 완료가 결합돼 있다. [C2](#c2) |
| `WebAnimation.reverse` | 현재 값·속도에서 lower bound까지 새 시뮬레이션 | 같은 좌표계 안의 spring retarget에 가까우며 WAAPI 시간 역재생과 다르다. [C3](#c3) |
| `WebAnimation.matchInto` | DOM element identity로 첫 pose를 찾아 scalar value·velocity 복사 | 효과·채널·좌표 의미를 검증하지 않는다. 같은 DOM이라도 충분하지 않다. [C3](#c3) |
| `MultiAnimation.matchInto` | 명시적인 TODO이며 no-op | zoom·drill·slide 같은 composite에서 일반적인 연속 인계는 아직 구현되지 않았다. [C4](#c4) |
| `Pose` | `{ element, value, velocity }` | 화면상의 geometry도, track key도, 내부 integrator state도 없다. 계약 주석의 `id`와 실제 타입도 구분해서 봐야 한다. [C1](#c1) |
| hidden mode | real node 재사용, owner/epoch를 통한 최종 reconciliation 보호 | persistent surface의 좋은 출발점이다. 다만 모든 preset의 style cleanup까지 보호하는 계약은 아니다. [C5](#c5) |
| unmount mode | 분리된 실제 outgoing node 재삽입 후 완료 시 제거 | 이전 화면 DOM은 잠시 보존하지만, 나중에 A가 새로 mount되면 동일 DOM이라는 보장은 없다. [C5](#c5) |
| 임시 요소 | `createElement(id)`는 `data-ssgoi-id` 기록, hero는 별도 clone 생성 | semantic ID의 재료는 있지만 현재 matcher는 그 attribute를 읽지 않는다. [C5](#c5) [C8](#c8) |
| navigation resolver | history entry별 효과 기억, Back에서 방향을 뒤집어 재사용 | 이미 있는 entry identity를 활용해야 한다. URL 문자열 비교만으로 역전환을 판정할 이유가 없다. [C9](#c9) |
| 렌더링 | integrator를 60Hz로 미리 계산하고 WAAPI로 재생 | integrator 기반과 미리 계산한 keyframe 재생은 양립한다. 목표 변경 시 현재 상태에서 다시 계산하면 된다. [C3](#c3) [C6](#c6) |

현재 실행 순서는 대략 다음과 같다.

```text
route IN/OUT 감지
  → 방향·효과 결정
  → prepare: 초기 style, DOM, layout 준비
  → animation(args): Animation 반환
  → host.attach(next)
      → old.getPose()
      → old.complete(): upperBound 적용 + cleanup
      → next.matchInto(poses)
      → next.play()/reverse()/pause()
```

`getPose()`를 읽는 시점에는 새 `prepare`와 `animation` factory의 일부 DOM/style 변경이 이미 일어났을 수 있다. 지금 scalar pose는 내부 timeline에서 읽으므로 geometry를 직접 읽는 것과는 다르지만, 앞으로 world-space pose를 얻으려면 **새 effect가 측정 기준이나 transform origin을 바꾸기 전의 상태**를 보존해야 한다. 비동기 준비가 길어지면 처음의 snapshot을 끝까지 쓰는 것도 안 된다. 마지막 commit 직전의 상태와 새 layout을 같은 좌표계로 맞춰야 한다. [C5](#c5)

### 2.1 `complete()`는 중립적인 자원 해제가 아니다

현재 `WebAnimation.complete()`는 항상 `upperBound`를 적용하고 속도를 0으로 만든 뒤 `onComplete`를 부른다. 역방향으로 정착하려는 중이어도 이 메서드의 의미는 동일하다. 반면 자연스럽게 reverse가 끝나는 경로는 새 timeline의 마지막 위치에 도달한다. 따라서 “새 애니메이션이 왔으니 이전 것을 complete”와 “기존 움직임을 안전하게 다른 소유자에게 넘긴다”는 의미를 분리해야 한다. [C3](#c3)

`MultiAnimation.complete()`는 모든 child를 완료한다. 각 child의 `onComplete`에서 transform·opacity·z-index 등을 지우는 preset도 있다. hidden-mode context의 epoch 검사가 최종 reconciliation을 막더라도 **그 전에 실행되는 child의 직접적인 style 정리까지 자동으로 막지는 않는다.** 일부 stacking reset에는 값 비교 guard가 있으나, 공통된 소유권 계약은 아니다. 이는 연속 handoff 설계의 검토 항목이며, 특정 프레임에서 반드시 flash가 발생한다는 브라우저 재현 결과를 뜻하지 않는다. [C4](#c4) [C5](#c5) [C7](#c7)

### 2.2 double spring은 `(position, velocity)`만으로 재개할 수 없다

`DoubleSpringIntegrator`는 follower의 위치·속도 외에 `_leader`의 위치·속도를 state에 보관한다. 그런데 `SimFrame`, `Pose`, `interpolateFrame` 경로에는 follower의 두 값만 남는다. 새 시뮬레이션에서는 leader가 follower와 같은 상태로 재초기화된다. 따라서 화면 값·속도를 처음에 일치시켜도, 같은 시스템을 이어 돌린 궤적과 이후 가속도가 달라진다. **C1의 접합 조건과 전체 물리 상태 보존은 서로 다른 수준의 보장이다.** [C6](#c6)

직접 checked-out integrator를 호출한 수치 예제는 이 차이를 보여 준다. drill parallax와 같은 설정으로 0 → 1을 150ms 진행한 다음 목표를 0으로 바꾸었다. 두 실행은 접합 순간의 follower 위치와 속도가 동일하다.

| 값 | leader까지 보존 | follower의 두 값만 복원 |
|---|---:|---:|
| 인계 순간 위치 | 0.502601 | 0.502601 |
| 인계 순간 속도, /s | 4.325857 | 4.325857 |
| 16.67ms 뒤 위치 | 0.559379 | 0.516275 |
| 16.67ms 뒤 속도, /s | 3.406709 | 0.820440 |

이후 1초 동안 두 scalar 궤적의 최대 차이는 약 **0.123834**다. 이 scalar를 400px 이동에 선형 매핑한다면 약 **49.53px**에 해당한다. 이 값은 실제 페이지를 촬영한 측정값이 아니며, 지정된 설정·시점의 integrator 실험이다. 같은 방식으로 단일 spring을 복원했을 때 다음 step은 일치했다. 실행 코드와 전체 결과는 부록에 연결했다.

## 3. 무엇이 연속이어야 자연스러운가

### 3.1 위치, 속도, 가속도, 의도

화면에서 보이는 표현을 `y(t)`라고 하자. 접합 시점 `t₀`에서 보장하고 싶은 것을 나누면 명확해진다.

| 수준 | 수학적 조건 | 사용자에게 보이는 현상 |
|---|---|---|
| C0: 위치 연속 | `y(t₀⁻) = y(t₀⁺)` | 갑자기 다른 위치·크기로 튀지 않는다. |
| C1: 속도 연속 | `ẏ(t₀⁻) = ẏ(t₀⁺)` | 급정지·즉각적인 방향 반전이 줄어든다. |
| C2: 가속도 연속 | `ÿ(t₀⁻) = ÿ(t₀⁺)` | 접합 때 힘이 갑자기 바뀌는 느낌까지 줄인다. |
| 의미 연속 | 동일 대상, 납득 가능한 깊이·방향·목적지 | 잘못된 사진으로 변하거나 Back이 다른 페이지로 느껴지지 않는다. |

SSGOI의 기본 목표는 **움직이는 geometry에 C0·C1, 화면 구성에는 의미 연속성**을 주는 것이다. 모든 채널에 C2를 요구할 필요는 없다. `mÿ + cẏ + k(y − g) = 0`에서 목표 `g`를 순간적으로 바꾸면 위치·속도는 유지할 수 있지만 가속도는 달라진다. 이는 상태를 보존한 spring retarget의 정상적인 특성이다. 필요하면 목표 자체를 필터링하거나 고차 보정으로 C2까지 올릴 수 있지만, 그만큼 최신 의도로 돌아서는 시간이 늘 수 있다.

여기서 자연스러운 reverse는 기존 속도에 마이너스를 붙이는 것이 아니다. 오른쪽으로 가던 물체의 목표가 왼쪽으로 바뀌면 **처음에는 여전히 오른쪽 속도를 갖고**, 새 힘에 의해 감속한 뒤 왼쪽으로 움직인다. 입력은 즉시 반영되지만 물체가 반대 방향으로 움직이기까지의 시간은 0이 아닐 수 있다. 이 점은 응답 지연과 구분해서 측정해야 한다.

duration이라는 설정의 존재도 그 자체로 문제가 아니다. 초기 위치·속도를 경계 조건으로 넣는 Hermite/quintic 경로는 duration을 가지면서 C1을 맞출 수 있다. 반대로 `Integrator`라는 인터페이스를 구현해도 입력 velocity를 무시하면 C1을 보장하지 못한다. Apple도 spring의 지각적 duration과 실제 settling duration을 구분한다. 따라서 API를 “duration 대 integrator”로 나누기보다 **어떤 상태를 인계받고 어떤 연속성을 보장하는가**로 평가해야 한다. [2](https://developer.apple.com/videos/play/wwdc2023/10158/)

### 3.2 진행률은 화면 위치가 아니다

현재 스타일 함수가 `y = f(p)`라면 화면 속도는 다음과 같다.

```text
ẏ = J_f(p) · ṗ

layout이나 부모 좌표계도 움직일 때:
ẏ = J_f(p, layout, t) · ṗ + ∂f/∂t
```

`p = 0.4`, `ṗ = 2`를 그대로 복사하는 것은 두 animation의 `f`가 같거나, 호환되는 매핑이 선언된 경우에만 정당하다. zoom에서는 이 수치가 확대 비율·clip window·위치를 함께 결정하고, drill에서는 수평 이동을 뜻할 수 있다. 같은 값이 같은 모습도, 같은 속도도 만들지 않는다.

다음은 너비 400px인 slide의 B 화면이다. 왼쪽 진입 중 `p = 0.4`, `ṗ = 2/s`에서 Back을 누른다.

```text
기존 B 진입: x = 400(1 − p)
현재 화면:   x = 240px, ẋ = −800px/s

새 B 퇴장 효과의 식: x = 400q

올바른 인계: q = 1 − p = 0.6, q̇ = −ṗ = −2/s
결과:        x = 240px, ẋ = −800px/s

그냥 복사:   q = p = 0.4, q̇ = ṗ = 2/s
결과:        x = 160px, ẋ = +800px/s
```

잘못된 복사는 위치를 80px 바꾸고 속도를 1,600px/s만큼 불연속으로 만든다. 올바른 변환에서 `q̇`의 부호를 뒤집는 이유는 **좌표 표현이 뒤집혔기 때문**이다. 물체의 화면 속도는 그대로다. 같은 animation의 `p` 좌표계를 유지하고 target만 바꿀 때는 `ṗ`를 뒤집으면 안 된다.

![그림 2. 역전환에서 좌표의 방향과 화면 속도의 방향은 서로 다르다](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/assets/reverse.svg)

### 3.3 보존 대상은 raw pose와 presentation pose 두 종류다

같은 solver를 이어갈 때 필요한 것은 **전체 내부 state**다. 다른 solver·효과와 연결할 때 필요한 것은 **표현 공간의 pose와 그 시간 미분**이다. 하나를 다른 하나의 대용품으로 만들지 않는 편이 좋다.

```text
Integrator snapshot                Presentation pose
─────────────────────────          ──────────────────────────
follower position, velocity        screen center, size, rotation
leader position, velocity          clip window, opacity, …
constraint/contact state           각 채널의 속도와 좌표계
solver/schema version              timestamp, layout revision

동일 운동계의 정확한 재개          서로 다른 운동계 사이의 접합
```

현재 `getPose()`를 presentation pose의 출발점으로 발전시키고, solver state는 별도의 opaque snapshot으로 두는 방법이 적절하다. 모든 custom integrator 내부를 공통 타입 하나로 펼칠 필요는 없다. 대신 자신의 snapshot 생성·복원·시간 샘플링 기능과 호환성 범위를 선언해야 한다.

## 4. 다른 시스템에서 가져올 것

아래는 공개 문서에 명시된 동작을 기준으로 한 비교다. 특정 상용 앱의 비공개 구현을 역추정한 내용은 포함하지 않았다. “SSGOI 적용”은 이 보고서의 설계 판단이다.

| 시스템 | 문서로 확인되는 동작 | SSGOI 적용 | 그대로 가져오면 안 되는 가정 |
|---|---|---|---|
| SwiftUI | animatable attribute에 model/presentation value가 있고, spring은 이전 상태를 merge해 velocity를 이어받음. [1](https://developer.apple.com/videos/play/wwdc2023/10156/) | 상태는 오래 살고 animation 설명은 교체 가능하게 한다. | 프레임워크가 가진 안정적인 attribute identity가 웹의 remount에도 자동으로 존재하지는 않는다. |
| Jetpack Compose | `Animatable`은 이전 실행을 취소하면서 현재 값에서 새 target으로 이어감. spring을 쓰는 상태 인계에 현재 속도가 활용됨. [3](https://developer.android.com/develop/ui/compose/animation/value-based) | 실행 취소와 화면 snap을 분리한다. | coroutine 취소가 모든 animation spec의 속도 연속성을 뜻하지 않는다. |
| Flutter Hero | tag로 pair를 찾고 overlay에서 비행하며, 비행 중 새 navigation이면 목적지를 바꿈. [4](https://api.flutter.dev/flutter/widgets/Hero-class.html) | shared entity의 비행 수명을 navigation pair보다 길게 잡는다. | 문서는 임의의 두 flight 간 물리적 C1까지 보장한다고 말하지 않는다. |
| Motion layout | `layoutId`, 실제 element의 transform 기반 layout animation, interruptible motion을 제공. [5](https://motion.dev/docs/react-layout-animations) | 공통 geometry·identity·부모/자식 보정을 함께 설계한다. | layout matching만으로 임의의 custom style과 페이지 생명주기가 해결되지는 않는다. |
| Motion transitions / presence | 물리 spring은 기존 velocity를 활용하고 duration spring은 다름. Presence는 sync/wait/popLayout을 구분. [6](https://motion.dev/docs/react-transitions) [7](https://motion.dev/docs/react-animate-presence) | solver 정책과 입퇴장 orchestration 정책을 별도로 노출한다. | `wait`가 모든 빠른 navigation에 좋은 UX라는 뜻은 아니다. |
| Motion `animateView` | native View Transition 중 새 요청을 기본적으로 queue하며 immediate 옵션도 제공. [8](https://motion.dev/docs/animate-view) | 완주 대기 역시 제품 상황에 맞는 명시적 전략으로 둘 수 있다. | queue는 현재 위치·속도에서 즉시 방향을 바꾸는 전략과 다르다. |
| CSS transitions | 새 transition은 현재 property value에서 시작하며, 역전환 shortening 규칙을 정의. [9](https://drafts.csswg.org/css-transitions-1/) | 짧은 hover·opacity 효과에 복잡한 물리 인계를 강요하지 않는다. | 현재 값에서 시작한다는 사실만으로 C1이 생기지는 않는다. |
| Unreal inertialization | 새 pose에 대한 차이를 줄이는 후처리이며, 원래 source clip 평가를 중단할 수 있음. 반복 interruption의 품질·duration 제약도 설명. [11](https://dev.epicgames.com/documentation/en-us/unreal-engine/blend-nodes?application_version=4.27) | 이전 animation 전체를 계속 돌리지 않고 현재 motion만 남긴다. | 페이지 DOM·포커스·스크롤 수명까지 게임의 bone blending이 해결해 주지는 않는다. |
| Unity Animator | current/next/AnyState 중 어떤 transition이 interrupt 가능한지, 우선순위와 순서를 설정. [12](https://docs.unity3d.com/6000.0/Documentation/Manual/class-Transition.html) | 인터럽트 허용과 표현 연결 방식을 분리한다. | Animator의 transition 후보 queue를 사용자 navigation backlog와 동일시하면 안 된다. |
| Unreal Motion Matching | schema로 위치·속도·trajectory 등을 질의해 database의 pose를 선택. [13](https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-matching-in-unreal-engine) | `getTimeline()`으로 후보 phase를 비교하는 작은 연구에 응용 가능하다. | 데이터베이스 검색 시스템 전체를 이식할 필요는 없다. |

### 4.1 가장 가까운 실제 UX 모티브: iPhone의 유동적인 탐색

Apple의 *Designing Fluid Interfaces*는 iPhone X의 홈·멀티태스킹·앱 전환을 설명하면서, 진행 중인 동작을 다른 의도로 바꿀 수 있는 redirection을 핵심 원칙으로 제시한다. 앱을 열다가 홈으로 돌려보내거나, 앱이 열리는 중에 상호작용하는 예시도 보여 준다. 이는 SSGOI가 원하는 “끝날 때까지 기다리지 않고 생각이 바뀌는 대로 움직인다”와 직접 맞닿아 있다. [14](https://developer.apple.com/videos/play/wwdc2018/803/)

SSGOI에 필요한 영감은 특정 spring 상수보다 **행동의 주도권이 항상 입력에 있다는 것**이다. A → B의 연출이 시작되었다고 B를 완성해서 보여 줘야 하는 의무가 생기지는 않는다. 다만 router의 상태 변경·권한·데이터 준비까지 animation이 임의로 바꿔서는 안 된다. 운동은 탐색 결과를 표현하는 계층으로 남아야 한다.

### 4.2 View Transitions에 대한 오래된 비교는 그대로 쓰지 않는다

Level 1의 document transition은 새 `startViewTransition()` 호출에서 기존 active transition을 skip하는 절차를 정의한다. 이것은 이전 presentation의 속도를 새 animation으로 전달하는 계약이 아니다. 또한 skip해도 update callback 실행 자체는 별도의 문제다. [15](https://drafts.csswg.org/css-view-transitions-1/)

하지만 “브라우저 View Transition은 영원히 화면 전체에서 하나만 가능하고, 상대 좌표도 없다”는 식으로 일반화하면 부정확하다. 현재 Level 2 Editor’s Draft에는 **scoped transitions와 nested groups**가 들어 있다. 독립 subtree의 동시 transition과 동일 surface의 속도 연속 retarget은 다른 능력이다. 브라우저별 출시 여부를 검증한 호환성 표는 이 보고서의 범위에 포함하지 않았다. [16](https://drafts.csswg.org/css-view-transitions-2/)

SSGOI의 장점은 범용적인 “native보다 부드럽다”보다, **실제 page surface와 shared entity의 운동 상태를 interruption 시점에 다룰 수 있는 명시적인 계약**으로 설명하는 편이 정확하고 오래 간다.

## 5. 요소 ID로 연결하는 애니메이션 매칭

**각 animation 객체가 어떤 요소를 움직이는지 알고 있으므로, 기존·신규 객체의 요소 목록을 ID로 대응시켜 요소별 운동을 이어받는다.** 이것이 구현의 중심이다. 한 animation이 page, hero, backdrop, 여러 형제 요소를 움직이더라도 각각을 개별 target으로 비교하면 된다. `MultiAnimation` 전체에 진행률 하나를 끼워 맞출 필요가 없다.

게임에 대응하면 `MultiAnimation`은 여러 bone에 pose를 쓰는 clip/graph에 가깝고, DOM target의 semantic ID는 bone identity에 가깝다. 같은 skeleton의 bone을 연결하는 데는 대규모 nearest-neighbor 검색이 필요하지 않다. **누구와 연결할지는 ID로, 어떻게 자연스럽게 이어갈지는 pose·velocity와 blending으로 해결한다.** 게임의 “Motion Matching”이라는 전문 용어는 database에서 clip의 frame을 선택하는 기법까지 포함하므로, 이 두 종류의 matching을 구분해 두면 논의가 쉬워진다. [13](https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-matching-in-unreal-engine)

![그림 3. animation 객체 경계를 넘어 ID가 같은 요소별 track을 연결한다](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/assets/matching.svg)

그림 3에서는 배열의 순서도 child 수도 다르다. B surface와 photo:42는 각각 이어받고, A는 퇴장하며, C와 새 dim layer는 새로 시작한다. ID가 같은 대상을 찾았다고 이전의 모든 property를 새 animation에 무조건 복사하지는 않는다. 해당 target의 채널·좌표 호환성을 다음 단계에서 검사한다.

### 5.1 현재 DOM의 ID를 어디에 사용할 것인가

현재 코드에는 목적이 다른 여러 식별자가 있다.

| 현재 식별자 | 지금의 역할 | 제안하는 활용 |
|---|---|---|
| `data-ssgoi-transition` | page boundary의 경로/매칭 정보. React wrapper의 `id`도 여기에 기록 | route identity의 입력. 별도의 entry key·mount generation과 결합한다. [C10](#c10) |
| `data-ssgoi-id` | context의 `createElement(id)`로 만든 임시 DOM 식별 | backdrop·overlay 같은 역할을 이어받는 후보 key. [C5](#c5) |
| `data-hero-enter-key` / `data-hero-exit-key` | hero의 양쪽 요소를 pair로 연결 | DOM이 달라도 같은 시각적 entity임을 선언하는 key. [C8](#c8) |
| `data-zoom-enter-key` / `data-zoom-exit-key` | zoom의 상세 영역과 출발 영역 연결 | page transform을 움직이더라도 그 효과가 추적하는 entity를 식별. [C7](#c7) |
| 실제 `HTMLElement` 참조 | 현재 `WebAnimation.matchInto`의 매칭 기준 | 같은 node 재사용에서 빠르고 정확한 후보. 채널 검사는 여전히 필요하다. [C3](#c3) |

즉 ID의 재료는 이미 있다. 필요한 작업은 **그 ID가 animation의 target descriptor와 pose snapshot까지 흘러가도록 연결하는 것**이다. 매번 전체 DOM을 탐색하지 않고, animation을 생성할 때 등록한 target map으로 해결할 수 있다. native driver에서도 재사용하려면 core matcher가 DOM attribute를 직접 읽기보다 web adapter가 descriptor를 만들어 넘기는 편이 좋다.

### 5.2 한 종류의 ID로 세 가지 정체성을 섞지 않는다

예를 들어 `photo:42`는 리스트 썸네일과 상세 사진이 공유하는 **내용의 identity**다. `/photo/42`를 두 번 방문한 history entry는 서로 다른 **탐색 instance**일 수 있다. 그 상세 페이지를 새로 mount한 DOM은 또 다른 **렌더링 instance**다.

```text
navigation scope = main / modal / nested-pane
view instance    = history-entry-17 + mount-generation-2
entity           = photo:42
visual role      = page-surface / media / backdrop / chrome
channel group    = transform / opacity / clip / …
```

하나의 문자열로 묶어 사용할 수는 있지만, 매칭할 때 무엇을 같다고 보는지는 role별로 달라야 한다. page surface는 보통 entry identity가 중요하고, shared media는 서로 다른 entry를 가로지르는 entity identity가 중요하다. `from`/`to`, `in`/`out`은 바뀌는 역할이므로 영속 identity의 핵심 부분으로 쓰지 않는다.

`zoom-overlay` 같은 ID는 두 scope에서 동시에 존재할 수 있다. 따라서 `document.querySelector('[data-ssgoi-id="zoom-overlay"]')`로 전역에서 하나를 가져오는 방식은 부적절하다. `(scope, semantic key, visual role)` 범위 안에서 후보를 찾고, 한 destination track에 두 source가 동시에 들어가면 모호성을 보고해야 한다. geometry가 가깝다는 이유로 서로 다른 사진을 매칭해서는 안 된다.

### 5.3 target과 property writer는 별개다

같은 element에 transform animation과 opacity animation이 각각 있을 수 있다. 반대로 하나의 `WebAnimation`이 transform·clipPath·opacity를 한꺼번에 쓸 수도 있다. matcher는 **element 수와 animation child 수가 같다고 가정하면 안 된다.**

권장 규칙은 `(target, CSS property)`마다 최종 writer가 하나라는 것이다. 특히 `translateX`와 `scale`을 별도 animation이 내더라도 CSS에서는 하나의 `transform` 문자열로 합쳐질 수 있다. `transform.translation`과 `transform.scale`을 다른 논리 채널로 모델링하되, 쓰기 단계에서는 하나의 composer가 합친다. 2D/3D transform의 곱셈 순서와 transform origin도 composer가 소유해야 한다.

```ts
// 제안용 스케치. 현행 공개 API가 아니다.
type MotionTarget = {
  scopeKey: string;
  targetKey: string;        // 역할에 맞게 정규화한 영속 key
  viewInstanceKey?: string;
  entityKey?: string;
  role: "surface" | "media" | "backdrop" | "chrome";
  renderHandle: unknown;   // HTMLElement 또는 native handle
};

type TrackDescriptor = {
  target: MotionTarget;
  trackKey: string;
  writes: readonly string[];
  poseSchema: string;
  spaceKey: string;
  layoutRevision: number;
  solverSchema?: string;
};
```

매칭 우선순위는 다음 정도로 시작할 수 있다. exact key와 명시된 role을 먼저 보고, 같은 node 참조를 보조 정보로 사용한다. 선택된 후보만 schema/space/solver 호환성을 검사한다. geometry 근접 탐색은 명시적으로 허용된 동일 entity 후보 안에서의 마지막 선택 수단이며 기본값은 아니다.

```text
ID 기반 후보 생성
 → 중복·scope·역할 검사
 → 채널/좌표/solver 호환성 검사
 → 직접 재개 / 좌표 변환 / 잔차 보정 / 미매칭 정책 선택
```

등록된 track이 n개라면 key map으로 일반적인 후보 연결은 O(n)에 할 수 있다. 모든 child 조합을 비교하거나 전역 assignment 최적화부터 시작할 필요는 없다. 이후 one-to-many 또는 실제로 모호한 후보군이 요구될 때에만 그 부분을 별도로 설계한다.

## 6. 시나리오에 따른 UX와 전략

### 6.1 전체 시나리오 지도

아래 정책은 SSGOI에 대한 제안이다. 속도·임계값은 실제 사용성 및 frame capture로 조정해야 하며, 표 자체가 사용자 실험 결과는 아니다.

| 상황 | 목표로 하는 느낌 | 요소별 처리 | 핵심 제약 |
|---|---|---|---|
| A → B 중 같은 entry A로 Back | 방금 열던 화면을 되돌려 놓는다 | A/B와 shared entity의 target을 바꾸고 state 유지 | 동일 pair라도 cleanup과 DOM 생존이 보장돼야 함 |
| A ↔ B 반복 탭 | 입력을 놓치지 않고 짧게 방향을 바꾼다 | 최신 목표 하나, source history 누적 없이 재개 | 매번 정지·대기하거나 residual layer를 쌓지 않음 |
| A → B → C, 깊이가 계속 증가 | B를 지나 더 안으로 들어간다 | B는 entering → exiting, C는 enter, A는 retire | B가 화면에 두 번 나타나지 않음 |
| A → B → C, 관련 없는 탭 이동 | 마지막으로 선택한 탭에 도달한다 | 최신 탭 중심의 짧은 전환, 중간 페이지 표현 축소 | 모든 탭을 순서대로 완주하는 queue는 피함 |
| A → B → A이나 새 entry로 A를 push | 새 탐색을 A로 표현한다 | history 의미를 따라 새 run; geometry 인계는 가능 | URL이 같다고 Back으로 취급하지 않음 |
| A → B 준비 중 C로 변경 | 이미 지난 요청이 나중에 나타나지 않는다 | stale prepare 무효화, 최신 ready destination 사용 | DOM/데이터 commit 순서는 router 소유 |
| zoom(photo:42) → drill | 같은 화면이 확대하던 운동에서 옆 이동으로 넘어간다 | B geometry를 인계하고 scale/clip 잔차를 정리 | 진행률 scalar 복사 금지 |
| zoom(photo:42) → zoom(photo:99) | 선택 대상이 바뀌었음이 명확하다 | 서로 다른 entity, 이전 media retire + 새 media enter | 가까운 위치라는 이유로 사진끼리 morph하지 않음 |
| hero가 이동 중인데 다음 페이지에도 같은 key | 하나의 물체가 새 목적지로 향한다 | overlay flight를 유지/이관하고 endpoint 갱신 | 실제 source/destination visibility lease 관리 |
| Back 목적지 hero가 가상화로 없음 | 끊기지 않되 엉뚱한 곳으로 날아가지 않는다 | 짧은 anchor 준비 또는 현재 pose에서 fade/settle | 마지막 rect의 유효성·layout revision 확인 |
| gesture 도중 취소 | 잡아당겼던 화면을 놓으면 돌아간다 | 실제 pointer motion에서 value/velocity 채집 | progress 반전과 history commit을 구분 |
| 중첩 navigator 또는 sheet가 동시에 움직임 | 각 조작이 자기 영역에 반응한다 | scope별 motion, 부모/자식 좌표 보정 | 동일 DOM property를 두 scope가 쓰지 않음 |
| scroll/resize가 interruption과 겹침 | 화면 기준 위치가 튀지 않는다 | layout 재측정 + world/local 변환 + 재접합 | layout 변화 속도도 표현 속도에 포함 |
| reduced motion 또는 효과 생략 | 결과와 포커스가 즉시 명확하다 | geometry motion 최소화 또는 skip, lease 정리 | inertial spring을 강제하지 않음 |

### 6.2 A → B → A: 동일 pair의 목표 변경

첫 구현 대상으로 가장 적합하다. 동일한 두 surface와 동일한 entity가 살아 있고, layout/coordinate mapping도 유효하다면 기존 track을 그대로 재사용할 수 있다. 역방향으로 새 스타일 함수를 만드는 것보다 현재 함수의 target을 반대 bound로 바꾸는 것이 간단하다.

그렇다고 현재 `host.reverse()`를 호출하면 완성되는 것은 아니다. 기존 callback은 A를 outgoing, B를 incoming이라고 가정해 DOM을 지우거나 style을 복구한다. **같은 track을 재사용하되 최종 visibility와 retirement의 의미를 새 탐색에 맞게 다시 지정해야 한다.** 타임라인의 reverse와 route lifecycle의 reverse는 분리해야 한다.

병렬 children의 시작 시점이나 spring 설정이 달라졌다면 현재값도 모두 다르다. 각 track의 실제 state에서 목표를 바꾼다. 정착한 채로 기다리는 child도 현재 화면 표현을 제공해야 하며, 아직 시작하지 않은 child에는 가짜 velocity를 부여하지 않는다.

### 6.3 A → B → C: B의 입장과 퇴장을 이어 붙인다

이 경우에는 서로 다른 두 문제가 있다. B는 이미 움직이는 동일 surface이므로 인계 대상이다. A는 새 transition의 `from/to`에 없지만 여전히 화면에 보일 수 있으므로 잔존 surface의 퇴장 대상이다.

![그림 4. A에서 C까지의 연속 탐색에서 각 surface가 갖는 생애 단계](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/assets/lifecycle.svg)

**계층 탐색**에서는 C가 B보다 앞에 오고 B가 배경으로 물러나는 식의 stack 문법을 유지하는 것이 좋다. 예를 들어 B가 아직 오른쪽에서 들어오는 중이면, C 입력 순간 B의 속도는 계속 왼쪽을 향할 수 있다. 그 상태에서 B의 새 배경 위치를 목표로 잡으면 “중앙에 일단 세웠다가 다시 나가는” 중간 절차가 사라진다.

**탭 탐색**에서는 A/B/C가 같은 깊이의 대안이다. B를 반드시 다 보여 주거나, C가 오는데 A와 B를 모두 큰 진폭으로 움직이면 목적지가 흐려진다. 이미 화면에 보이는 B는 현재 pose에서 정리하되, 아직 보이지 않은 B의 enter는 생략할 수 있다. 여기서 생략하는 것은 시각적 경유 단계이며 실제 router history를 압축한다는 뜻은 아니다.

A의 처리에는 세 가지 선택지가 있다. 완전히 가려졌으면 즉시 retirement를 끝낼 수 있다. 가장자리가 보이면 기존 퇴장 궤적을 짧게 이어간다. 새 연출과 충돌하는 그림자·backdrop만 남으면 그 채널을 현재 값에서 감쇠한다. 어느 경우에도 C의 입장을 A의 완주에 종속시킬 필요는 없다.

### 6.4 zoom → drill: 이전 운동은 잔차로, 새 연출은 목적 경로로

photo:42를 열며 B가 커지는 중에 다음 상세 C로 drill한다는 장면을 생각하자. B의 위치·크기·clip은 zoom이 만들었고, 새 drill은 B를 옆으로 물리려 한다. ID는 B라는 target을 연결해 주지만 두 경로의 geometry는 다르다.

권장 동작은 B를 정상 크기로 강제 정착시키는 대신 **현재의 확대 상태에서 수평 이동이 이어지도록 하는 것**이다. 새 drill의 translation은 즉시 진행하면서, 기존 확대·clip·origin 차이는 하나의 보정 경로로 줄인다. C는 자신의 입장 문법을 따른다. 기존 zoom의 sibling fade나 blur가 새 effect에 없다면 그 채널 역시 갑자기 원복시키지 않고 retire한다.

반면 화면의 사각형이 원으로 잘리는 효과에서 전혀 다른 topology의 mask로 넘어가는 등, 공통 pose schema가 표현하지 못하는 변화도 있다. 이때는 geometry 인계와 시각적 crossfade를 조합할 수 있지만 “모든 픽셀의 C1”을 주장해서는 안 된다.

### 6.5 gesture: 조작 중과 놓은 뒤의 물리는 달라도 된다

사용자가 직접 붙잡은 상태에서는 포인터가 위치의 기준이 되는 편이 예측하기 쉽다. 놓는 순간의 속도를 spring 초기 상태로 넘겨 commit 또는 rollback target으로 진행한다. rubber-band 등 비선형 매핑이 있다면 finger velocity도 같은 미분으로 변환한다. `progress`만 보고 속도를 추측하거나 0으로 초기화하지 않는다.

Android의 predictive back 가이드는 pre-commit 상태, commit, cancel의 표현을 분리한다. 취소에서는 원래 상태로 되돌아가는 동작을 정의하고 shared element 사례에서는 gesture의 tension을 받는 미세한 overshoot도 다룬다. SSGOI 역시 gesture progress와 논리적 navigation commit을 분리하는 설계가 필요하다. 다만 웹에서 운영체제의 back gesture progress를 모든 브라우저가 제공한다고 전제해서는 안 된다. 아래 설계는 SSGOI가 실제 입력을 소유하거나, adapter가 progress를 전달할 수 있는 경우를 대상으로 한다. [17](https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back?hl=en)

## 7. 연결 알고리즘: 직접 재개부터 잔차 보정까지

### 7.1 같은 solver와 좌표계: 전체 state retarget

가장 정확하고 가장 싼 경로다. stable track의 target만 갱신하고, solver의 state를 통째로 유지한다. 단일 spring이라면 `(x, v)`이고 double spring이라면 leader/follower 모두다. integrator가 contact·constraint·누적값을 갖는다면 그것도 포함해야 한다.

```text
S₀ = old.sampleSolverState(sharedTimestamp)
new.target = destination
new.state = S₀
new.simulateOrContinue()
```

여기에는 두 전제가 있다. snapshot의 solver/schema가 새 solver와 호환되어야 하고, snapshot이 현재 presentation 시점에 해당해야 한다. 미리 구운 timeline의 마지막 state를 저장해 둔 것만으로는 중간 시점의 재개가 되지 않는다.

SSGOI에서는 full state를 모든 frame에 보관하거나, 일정 간격 checkpoint에서 해당 시각까지 재적분하거나, solver가 임의 시각 state를 계산하도록 할 수 있다. 첫 프로토타입에는 full-state checkpoint와 작은 재적분이 설명하기 쉽다. 보간 가능한 state와 임의 보간이 불가능한 state를 구분한다. snapshot은 immutable value이거나 복사 규약을 가져야 하며 같은 객체 참조를 재사용해 후속 step이 과거 기록을 바꾸지 않도록 한다.

### 7.2 다른 매개화: pose와 velocity의 동시 변환

새 경로를 `y = g(q)`라 하면 다음 조건을 풀어야 한다.

```text
g(q₀) = y_old
J_g(q₀) · q̇₀ = v_old
```

3장의 slide reverse처럼 `q = 1 − p`면 해가 쉽다. 일반적인 affine mapping `q = ap + b`라면 `q̇ = aṗ`다. 문제는 하나의 scalar로 translation·scale·clip 등을 동시에 움직이는 다른 효과로 바뀔 때다. 현재 pose가 새 경로 위에 아예 없을 수 있고, pose가 우연히 같아도 velocity가 그 경로의 접선 방향과 다를 수 있다.

근사로는 새 경로에서 pose가 가장 가까운 phase를 찾고, velocity를 그 접선에 투영할 수 있다. scalar `q`와 양의 가중치 행렬 W에 대해:

```text
q₀ = argmin_q ||g(q) − y_old||²_W
q̇₀ = (Jᵀ W v_old) / (Jᵀ W J)
```

그러나 이 방식은 잃어버린 직교 방향의 속도를 복구하지 못한다. `JᵀWJ`가 작으면 수치적으로 불안정하고, clip처럼 비미분 가능한 출력도 있다. 따라서 **작은 잔차로 이어 붙일 수 있는 경우의 phase 선택 도구**로 제한하고, 이것만으로 임의의 effect handoff가 해결됐다고 보지 않는다.

### 7.3 서로 다른 궤적: inertialization

새 animation이 원래 출력하려는 경로를 `d(τ)`라 하자. interruption 시각을 `τ = 0`으로 두고, 현재 화면의 pose와 velocity를 `y_old`, `v_old`라고 한다. 다음 잔차를 만든다.

```text
r₀ = y_old − d(0)
ṙ₀ = v_old − ḋ(0)

y(τ) = d(τ) + r(τ)
r̈ + 2ωṙ + ω²r = 0
```

critical damping의 해는 다음과 같다. ω는 양수이며 단위는 1/s다.

```text
r(τ)  = [r₀ + (ṙ₀ + ωr₀)τ] exp(−ωτ)
ṙ(τ) = [ṙ₀ − ω(ṙ₀ + ωr₀)τ] exp(−ωτ)
```

`τ = 0`을 넣으면 `y(0) = y_old`, `ẏ(0) = v_old`가 된다. 시간이 지나면 잔차가 작아져 새 연출이 그대로 나타난다. 중요한 것은 **원래 animation의 미래를 계속 재생하는 것이 아니라, 지금 남은 차이만 기록하는 것**이다. 이 spring 잔차 접근은 Holden의 구현 설명에 직접적인 선례가 있고, Gears of War의 원래 inertialization 발표는 polynomial로 차이를 줄이는 접근을 설명한다. 아래 수식과 UI 적용은 그 원리를 단순한 Euclidean 채널에 전개한 설계다. [10](https://theorangeduck.com/page/spring-roll-call) [18](https://media.gdcvault.com/gdc2018/presentations/bollo_david_inertialization_high_performance.pdf)

![그림 5. 새 효과의 경로에 현재 자세와 속도의 잔차를 더한다](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/assets/inertialization.svg)

예를 들어 기존 화면이 `x = 120px`, `v = −450px/s`이고, 새 연출의 시작이 `x = 40px`, `v = +200px/s`라면 잔차는 `r₀ = 80px`, `ṙ₀ = −650px/s`다. 새 연출에 잔차를 더한 순간의 출력은 그대로 `120px, −450px/s`다. 새 연출의 속도만 넣거나 기존 속도만 별도로 lerp하는 방법과 다르다.

다시 interruption이 생기면 **현재 최종 출력 `d + r`과 그 derivative**를 다음 source로 삼는다. 이전 base만 샘플하면 남아 있던 잔차가 사라져 튄다. 또한 이전 residual 객체를 리스트에 계속 쌓지 않는다. 새 destination과 현재 최종 출력의 차이로 하나의 residual state를 다시 만든다. 각 track의 추가 상태량은 반복 횟수에 비례해 커질 필요가 없다.

이 수식이 임의의 CSS 문자열에 그대로 적용되는 것은 아니다. 위치는 같은 공간의 px, 크기는 양수를 유지하도록 log-scale, 회전은 연속 각 또는 rotation manifold, clip은 지원되는 topology의 좌표로 변환해야 한다. 같은 key가 있어도 pose adapter가 없으면 generic fallback을 사용해야 한다.

### 7.4 같은 방식의 crossfade와 다른 점

두 경로를 `y = (1 − w)a + wb`로 blend하면 실제 속도는:

```text
ẏ = (1 − w)ȧ + wḃ + ẇ(b − a)
```

`lerp(sourceVelocity, targetVelocity, w)`만 계산하면 마지막 항을 빠뜨린다. 같은 실수는 여러 animation의 출력을 합성한 다음 `getPose()`에서 child의 velocity만 모을 때도 생긴다. 최종 출력의 derivative를 보존해야 한다.

crossfade도 `w`의 endpoint derivative와 두 pose의 상태를 적절히 정하면 C1 접합이 가능하다. 다만 서로 다른 DOM subtree의 opacity를 섞으면 물체 하나의 geometry가 이어지는 것과 달리 이중상이 보일 수 있다. 일반 crossfade, pose blend, inertialization은 서로 다른 표현 수단으로 유지하는 편이 좋다.

### 7.5 dead blending: 목적지가 불안정할 때의 보조 선택지

dead blending은 source의 현재 pose·velocity에서 짧게 extrapolate한 경로와 destination을 blend한다. source animation 전체를 계속 평가하지 않는다는 점은 유사하지만, destination과의 고정 잔차를 감쇠하는 inertialization과 구조가 다르다. Holden의 설명에는 회전 경로가 반대쪽으로 바뀌는 문제와 처리 예도 있다. [19](https://theorangeduck.com/page/dead-blending)

SSGOI에서는 layout이 약간 늦게 확정되거나 source의 방향감을 잠시 유지하는 데 실험할 수 있다. 다만 오랫동안 extrapolate하면 화면 밖으로 멀어지거나 새 목적지에 대한 반응이 느려진다. 첫 기본값은 직접 retarget과 inertialization으로 두고, dead blending은 비교 실험용으로 남기는 것을 권한다.

### 7.6 `getTimeline()`을 이용한 phase 선택

ID로 target을 찾은 다음, 새 animation의 어느 phase에서 이어 붙일지를 탐색할 수 있다. 이것이 게임 Motion Matching에 더 직접적으로 닿는 확장이다. 비교 feature에는 해당 target의 pose, velocity, 필요한 경우 짧은 미래의 목표 방향을 넣는다.

```text
candidate cost(q) =
    normalizedPoseError(q)
  + normalizedVelocityError(q)
  + semanticPhasePenalty(q)
  + estimatedResidualCost(q)
```

현재 화면과 가까운 frame이 새 animation 끝부분에 있을 수도 있다. 그 frame을 고르면 필요한 정보 노출 단계나 방향 문법을 건너뛰게 된다. 따라서 전체 timeline에서 무제한 최근접 검색을 하지 말고, effect가 허용한 phase 구간과 같은 identity의 후보만 비교해야 한다. 이미 선택한 phase를 작은 노이즈로 계속 바꾸지 않도록 hysteresis도 필요하다.

위치 px와 속도 px/s의 차이를 그냥 더하면 단위가 섞인다. Holden의 *Inertialization Transition Cost*는 이러한 단순 feature 거리의 한계와, transition 동안 발생하는 잔차의 총량으로 비용을 정의하는 방향을 논의한다. SSGOI에는 작은 후보군에서 짧은 horizon의 실제 보정량을 적분해 비교하는 실험이 더 이해하기 쉽다. [20](https://theorangeduck.com/page/inertialization-transition-cost)

이 단계는 **MVP 이후**다. 일반적인 같은 대상 역전환에는 exact target map과 state retarget으로 충분하고, 초기 버전에 pose database나 학습 모델을 도입할 이유는 없다.

## 8. 권장 구조: target registry, motion state, renderer

### 8.1 반환하는 Animation 객체는 유지할 수 있다

현재의 `animation(args) → Animation` 모델을 없앨 필요는 없다. 해당 객체가 track 목록과 인계 가능한 pose adapter를 선택적으로 제공하게 하면 된다. 오래 살아 있는 registry가 물리 상태와 rendering lease를 소유하고, 새 animation은 이번 목적지의 연출을 설명한다.

```text
기존 custom Animation
  → 기존 play/pause/complete 계약으로 실행
  → 새 연속성 기능 미선언이면 명시적인 fallback

연속성 지원 Animation
  → target/track descriptor 노출
  → presentation snapshot + optional solver snapshot
  → target별 인계 계획 수신
  → ownership을 넘겨받아 실행
```

이렇게 하면 built-in slide/drill/zoom부터 지원을 추가하고, custom animation 작성자는 자신의 표현 수준에 맞춰 opt-in할 수 있다. 내부 state를 모르는 animation을 런타임이 임의로 역추정해서 “지원”한다고 선언하지 않는다.

### 8.2 제안하는 다섯 가지 역할

| 구성 요소 | 소유하는 정보 | 소유하지 않는 정보 |
|---|---|---|
| Navigation intent | 최신 entry, 방향, effect rule, generation | solver의 위치와 속도 |
| Target registry | scope별 stable target, render handle, semantic identity | history 변경의 결정 |
| Motion track | 현재 pose, velocity, full solver snapshot, phase | 실제 page unmount의 권한 |
| Handoff planner | exact/reparam/residual/retire/enter 결정 | CSS 직접 쓰기 |
| Renderer & leases | property 합성, 화면 적용, DOM·overlay 보존·정리 | 어떤 URL로 이동할지 |

한 navigation의 generation이 이전 세대가 되었어도, 그때 만들어진 surface가 아직 visual retirement 중일 수 있다. generation은 **늦게 끝난 비동기 작업이 현재 의도를 덮어쓰지 못하게 하는 token**이고, lease는 **화면과 자원에 누가 아직 권리를 갖는지**를 나타낸다. 서로 다른 목적의 생명주기다.

### 8.3 handoff는 트랜잭션으로 처리한다

핵심 불변식은 **새 writer의 첫 출력이 준비되기 전에 이전 화면을 잃지 않는 것**이다. 기존 `complete()`를 먼저 부르는 구조에서 이 불변식을 표현하기 어렵다.

![그림 6. 읽기, 준비, 인계, 해제 순서를 분리하는 handoff](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/assets/handoff.svg)

권장 흐름은 다음과 같다.

1. 새 navigation intent에 generation을 부여한다. 이미 router가 확정한 상태는 그 계약대로 따른다.
2. 새 `prepare`가 기존 화면에 영향을 주기 전에 source layout basis와 target registry를 확보한다. 아직 없는 target은 별도로 준비한다.
3. 비동기 준비 동안 old run을 유지한다. prepare는 가능하면 측정과 staged write를 분리하고 live target의 transform을 직접 덮지 않는다.
4. commit 직전에 generation을 검사하고, 공통 시각 기준의 **현재 최종 presentation**을 다시 sample한다. layout이 바뀌었으면 그 기준도 함께 변환한다.
5. target key로 매칭하고, 이어받는 track·retiring track·새 track의 계획을 만든다.
6. 새 writer의 첫 pose를 준비한 상태에서 ownership을 원자적으로 교체한다. WAAPI 준비가 비동기라면 이전 frozen presentation을 유지하고 준비 후 인계한다.
7. 인계된 채널에 대해서는 old writer만 detach한다. 이전 endpoint를 쓰거나 “목적지 도착” callback을 호출하지 않는다.
8. 미매칭 source의 retirement가 끝나고 lease가 0이 되면 해당 자원을 정리한다.

“공통 시각”은 모든 WAAPI를 같은 `performance.now()` 경과로 추측한다는 뜻이 아니다. 각 driver의 실제 playback time을 하나의 snapshot epoch에서 읽고, clock mapping을 통해 동일한 presentation 시점의 값으로 정렬하는 계약이 필요하다. 현재 코드가 `currentTime`으로 startup 지연을 구분하는 장점은 유지한다. 브라우저가 실제로 display에 scanout한 시각까지 정확히 알 수 있다고 전제하지는 않는다. [C3](#c3)

비동기 prepare가 오래 걸리는 경우에는 처음 snapshot을 강제로 고정해 사용자 화면을 오래 멈추게 하지 않는 편이 좋다. 가능한 한 old run을 진행시키고, 새 layout이 준비된 시점에 다시 읽는다. 불가피하게 freeze해야 하는 효과는 그 시간을 측정하고 드러내야 한다.

### 8.4 완료와 폐기를 구분한다

다음은 API 이름이 아니라 필요한 의미의 분리다.

| 의미 | 화면에 하는 일 | callback / 정리 |
|---|---|---|
| settled | 현재 목표에 도달 | 이번 target 도착 통지 |
| superseded / handoff | 현재 pose를 다음 writer에게 넘김 | 이전 intent 종료 통지, 전송된 채널은 원복하지 않음 |
| force finish | 지정된 최종 상태로 이동 | 호출자가 요청한 강제 종료 |
| dispose | 더 이상 쓰이지 않는 자원 제거 | lease가 없는 항목만 정리 |

예를 들어 `onComplete`에서 B의 autofocus를 실행하는 custom animation이 있다고 하자. C로 이동하느라 A → B를 supersede한 경우 B에 실제 도착하지 않았는데 autofocus가 실행되면 잘못된 결과다. 애니메이션 완료 callback이 navigation commit·focus·analytics의 유일한 트리거가 되지 않도록 계약을 명확히 해야 한다.

Unreal 역시 inertialization에서 source clip의 평가가 멈추면 해당 clip의 notification이 더 이상 발생하지 않으므로 로직을 검토하라고 명시한다. 페이지 전환에서는 같은 교훈을 lifecycle event에 적용할 수 있다. [11](https://dev.epicgames.com/documentation/en-us/unreal-engine/blend-nodes?application_version=4.27)

### 8.5 실제 DOM을 언제까지 유지할 것인가

물리 상태를 저장한다고 DOM의 내용까지 재생성할 수 있는 것은 아니다. A가 사라졌는데 canvas·video·입력 상태를 계속 보여 주려면 실제 surface나 적절한 visual proxy가 남아 있어야 한다. reverse 때 되돌아오는 A가 새 DOM이라면 entity와 presentation은 이어 붙일 수 있어도 예전 DOM의 모든 런타임 상태가 복원되지는 않는다.

surface에 render lease, style lease, visibility lease를 두는 이유다. 숨겨진 실제 node, 다시 삽입한 outgoing node, hero clone, backdrop을 같은 resource API 아래에서 다루되 자원 특성은 유지한다. 기존 outgoing node 보존과 hidden-mode epoch는 이 구조의 출발점으로 사용할 수 있다. [C5](#c5)

실무적인 초기 정책으로는 **현재 목적지와 시각적으로 중요한 outgoing surface를 우선 유지하고, 추가 surface는 가림 여부와 메모리 비용에 따라 빨리 retire**하는 것이 좋다. 모든 상황에 “무조건 두 페이지”를 적용하면 A/B/C overlap을 표현하지 못하고, 반대로 무제한 보존은 빠른 탐색에서 비용이 늘어난다. live surface·overlay 개수와 픽셀 면적을 관찰하면서 예산을 정한다.

## 9. MultiAnimation을 어떻게 발전시킬 것인가

### 9.1 flat pose broadcast가 아닌 target별 인계 결과

현재 `MultiAnimation.matchInto()`의 TODO는 정당한 문제를 가리킨다. child에 같은 pose 배열을 전달하는 것만으로는 미시작 child, role 변경, stale callback, stagger 진행률, 동일 property 충돌이 해결되지 않는다. [C4](#c4)

구조는 flat registration이어도 좋다. composite를 순회해 target별 track을 모으고 matcher가 source/destination을 연결한다. 중요한 것은 반환값이 단순 성공/실패보다 구체적이어야 한다는 점이다.

```ts
// 제안용 스케치
type TrackHandoff =
  | { kind: "reuse"; sourceTrackKey: string; solverSnapshot: unknown }
  | { kind: "reparameterize"; value: unknown; velocity: unknown }
  | { kind: "inertialize"; pose: unknown; velocity: unknown }
  | { kind: "enter" }
  | { kind: "retire"; policy: "continue" | "damped" | "fade" }
  | { kind: "fallback"; reason: string };
```

`getPose()`는 진단 용도로 여전히 flat list를 줄 수 있다. 다만 engine 내부 snapshot에는 `trackKey`, 실제 active phase, timestamp, writer ownership과 pose schema가 필요하다. **ID를 갖는 element-level mapping은 필수이고, 그 아래에 property/track-level mapping이 따라온다.**

### 9.2 choreography phase와 물리 값은 분리한다

현재 `progress`는 bounds 사이 scalar를 0..1로 clamp한 값이고, Multi는 child progress를 평균한다. sequence/stagger는 이전 child의 threshold를 본다. 이 값은 한 run의 관찰·시작 신호에는 쓸 수 있지만 **복합 화면의 물리 상태를 대표하지는 않는다.** 두 child가 `(1, 0)`인 경우와 `(0.5, 0.5)`인 경우는 평균이 같아도 전혀 다른 화면이다. [C3](#c3) [C4](#c4)

특히 spring이 overshoot하면 `progress = 1`이 곧 정착은 아니다. 현재 코드의 sequence는 startAt=1로 표현되므로, 주석상 “정착 후 시작”이라는 설명과 first crossing에서 시작할 수 있는 조건을 구현 단계에서 다시 확인해야 한다. 이번 보고서는 이 부분을 수정하지 않는다. 새 계약은 `onFirstCrossing`, `onSettled`, `afterVisible`처럼 trigger의 의미를 구분하는 편이 좋다.

각 child는 적어도 `not-started / active / holding / retired`의 표현 상태를 알려 줄 수 있어야 한다. 이미 보이는 child를 새 effect가 다시 delay시키면 현재 화면에서 멈춰 기다리는 이상한 상황이 생긴다. 기본 정책은 다음과 같다.

- **이어받는 visible child:** 새 intro delay를 다시 걸지 않고 즉시 retarget한다.
- **아직 보이지 않은 새 child:** 새 choreography의 dependency를 따른다.
- **완료 후 유지 중인 child:** 현재 pose와 0 velocity를 유효한 source로 제공한다.
- **사라질 child:** 이전 sequence의 다음 동작을 시작하지 않고 retire한다.

reverse도 배열 순서만 뒤집으면 해결되는 문제가 아니다. 기하학적으로 공유하는 phase의 역전환과, “A가 사라진 뒤 B가 나타난다”라는 choreography의 역전환은 다르다. fade-through에서 아직 B가 안 보였으면 B 입장을 생략하고 A를 되돌리는 편이 자연스럽다. 반면 이미 B가 보인 상태라면 B의 현재 opacity에서 퇴장해야 한다.

### 9.3 같은 역할의 요소는 공통 controller를 공유할 수 있다

게임에서 여러 bone이 같은 clip time을 공유하듯, page와 backdrop·clip이 항상 같은 기하 관계를 따라야 한다면 `phase controller` 하나를 공유할 수 있다. 이러면 각 child가 독립된 spring을 갖고 시작 clock이 조금씩 달라지는 문제를 줄인다. 같은 설정의 solver를 여러 개 만드는 것과 하나의 state를 공유하는 것은 다르다.

하지만 title, toolbar, media가 일부러 다른 반응성을 갖는 연출도 있다. 따라서 모든 child를 하나의 progress로 강제하지 않는다. **공통 controller를 쓰는 motion group**과 **독립적으로 state를 가지는 track**을 모두 표현하되, group의 어느 채널이 transfer/retire되는지를 확인한다.

## 10. 표현 공간과 물리적 제약

### 10.1 처음부터 모든 CSS를 일반화하지 않는다

첫 canonical schema는 2D page surface에 맞추면 된다. center x/y, 양수 scale, translation, 회전, 사각 clip inset, opacity 정도를 지원한다. arbitrary CSS string은 이 schema의 일부가 아니다. 필요하면 기존 style 함수 외에 `samplePresentation(state, geometry)`와 `composePresentation(pose)`를 built-in effect에 추가한다.

| 채널 | 권장 표현 | 접합에서 주의할 점 |
|---|---|---|
| translation | 공통 surface/viewport 공간의 px | `%`의 기준 너비, scroll, 부모 transform |
| scale / size | 양수 크기 또는 log-scale | 0·음수·mirror는 별도 처리, 회전된 bbox와 구분 |
| rotation | unwrap한 2D angle, 3D는 별도 manifold adapter | ±π 경계, transform 곱셈 순서 |
| clip | topology가 같은 clip window/inset 좌표 | 서로 다른 polygon 점 개수, object-fit 내용 영역 |
| opacity | bounded scalar | 외부로 나가는 속도와 hard bound를 동시에 완벽히 보존할 수 없음 |
| blur / radius | 허용 범위를 가진 scalar | 과도한 overshoot, 성능·시각적 번짐 |
| z-index / display | 이산 lifecycle 상태 | 물리 보간 대상이 아니라 stack·visibility 정책 |

`getBoundingClientRect()`만으로 모든 변환을 복원하는 것도 위험하다. 회전한 사각형의 axis-aligned bbox에는 원래 rotation과 local geometry가 충분히 남지 않는다. supported transform stack은 처음부터 engine의 descriptor로 관리하고, `getComputedStyle`은 handoff 때의 보조 검증으로 쓰는 편이 안정적이다.

### 10.2 부모와 자식의 운동을 두 번 적용하지 않는다

게임 skeleton에서 child pose는 보통 parent에 상대적이다. 페이지도 마찬가지다. zoom하는 page 안의 hero 위치를 world-space로 읽은 다음, 다시 움직이는 page의 child transform으로 적용하면 parent motion이 중복될 수 있다.

```text
M_world = M_parent · M_local
Ṁ_world = Ṁ_parent · M_local + M_parent · Ṁ_local
```

부모가 바뀌면 pose뿐 아니라 derivative도 변환해야 한다. parent와 child를 모두 독립 world-space writer로 만들기보다는 같은 rig의 local pose로 유지하거나, hero를 독립 overlay로 올리고 양쪽의 geometry를 그 overlay 공간으로 변환한다. Flutter Hero도 overlay 좌표로 변환하며 axis-aligned 제약을 문서화한다. SSGOI는 이를 그대로 제한으로 복사하기보다, **공통 공간과 지원 transform 범위를 명시하는 설계의 선례**로 볼 수 있다. [4](https://api.flutter.dev/flutter/widgets/Hero-class.html)

### 10.3 속도 보존과 제약은 충돌할 수 있다

예를 들어 opacity가 이미 1이고 양의 속도를 갖는다고 하자. `[0,1]` 범위를 절대 벗어나지 않으면서 그 양의 derivative까지 유지하는 것은 불가능하다. 위치가 viewport 끝에 붙은 상황에서도 같은 종류의 충돌이 생긴다. 이를 “물리적 자연스러움” 하나로 덮으면 정책이 불명확해진다.

geometry는 가급적 C1을 지키되, alpha/clip/radius에는 채널별 제한을 둔다. hard clamp는 경계에서 derivative를 바꿀 수 있음을 인정한다. 부드러운 제한 함수를 쓰면 derivative도 그 함수의 chain rule로 변환한다. 시각적으로 의미 없는 채널에는 overshoot를 허용하지 않는 쪽이 좋다.

목표가 바뀌면 spring의 에너지는 새 target의 외력으로 달라진다. “에너지 보존”을 보장이라고 부르기보다 **상태 인계, 제한된 overshoot, 최신 target으로의 수렴**을 보장으로 삼아야 한다. 서로 다른 mass/stiffness 효과 사이에서 무조건 이전 운동량까지 보존하려는 일반화도 필요하지 않다.

### 10.4 잔차가 너무 클 때는 품질 경로를 바꾼다

같은 key라도 현재 pose와 새 경로가 매우 다르면 correction이 큰 우회·급가속을 만들 수 있다. 이를 해결하려고 매 프레임 효과를 다시 선택하면 오히려 불안정해진다. handoff 시점에 보정량을 예측하고 지원 가능한 범위를 넘으면 중간 surface 정리나 짧은 fade를 선택한다.

실험용으로는 화면 너비 대비 위치 차이, log-scale 차이, 속도 차이, 남은 surface 수를 기록하면 된다. 어느 숫자를 넘으면 사용자가 불편한지는 별도의 실험 대상이다. 이 보고서는 보편적인 “100ms면 자연스럽다” 같은 임계값을 제시하지 않는다.

## 11. WAAPI 기반에서 유지해야 할 성능과 정확성

### 11.1 bake 방식은 유지 가능하다

현재처럼 새 target이 결정될 때 궤적을 계산하고 WAAPI로 넘길 수 있다. inertialization도 `d(t) + r(t)`를 미리 계산하면 compositor 재생 경로를 유지할 여지가 있다. 어떤 property가 compositor에서 처리되는지는 별도의 조건이며, geometry 수식이 GPU 실행을 보장하지는 않는다.

고빈도 gesture에서는 목표가 매 pointer event마다 바뀔 수 있으므로, 매번 긴 전체 timeline을 다시 굽기보다 frame마다 최신 입력을 coalesce하거나 gesture 동안 직접 driver를 쓰고 release 때 bake하는 비교가 필요하다. 이는 렌더러 선택 문제이며 element identity와 pose schema는 공유할 수 있다.

### 11.2 현재 수치 모델과 실제 화면 derivative는 일치하지 않을 수 있다

현재 `simulate()`는 1/60초 간격이고 `interpolateFrame()`은 position과 velocity를 각각 선형 보간한다. 실제 WAAPI는 생성된 CSS keyframe 사이를 보간한다. 따라서 기록된 velocity와 화면 property의 정확한 derivative가 항상 같은 것은 아니다. 예를 들어 non-linear `styleFn`은 scalar의 선형 보간과 스타일의 보간이 같은 결과를 만들지 않는다. [C3](#c3) [C6](#c6)

이 차이를 줄이는 선택지는 다음과 같다. 첫째, handoff contract의 기준을 “solver space의 C1”으로 먼저 제한하고 표현상의 오차를 측정한다. 둘째, supported canonical channel의 derivative를 구해 presentation 기준으로 보정한다. 셋째, 빠른 곡률 변화 구간의 keyframe을 더 촘촘하게 만든다. 큰 refactor보다 먼저 오차의 크기를 측정하는 것이 좋다.

`playbackRate`도 계약에 들어가야 한다. timeline 속도가 `dp/dτ`이고 playback이 `dτ/dt = rate`라면 wall-clock 속도는 그 곱이다. 현재 `getPose()`는 timeline velocity를 반환한다. 같은 rate를 그대로 넘기는 내부 사용과, rate를 변경하거나 다른 driver로 옮기는 경우를 구분해야 한다. paused 상태도 “화면상 0인 속도”와 “resume할 동역학의 저장 속도”를 분리하는 편이 좋다. [C3](#c3)

### 11.3 startup hold는 C1 보장과 별도로 검사한다

현재 WebAnimation은 paused 0ms frame과 paint 준비, 안정적인 startup frame을 거쳐 WAAPI로 넘어간다. 이 과정은 mount 지연을 진행률로 잘못 계산하지 않는 장점이 있다. 하지만 이미 움직이던 animation을 새 run으로 연결하면서 매번 수 frame 정지하면, state에 velocity가 저장돼 있어도 실제 화면에서는 잠깐 멈춘다. **수학적 접합 성공과 presentation의 시간 연속성은 별도로 검증해야 한다.** [C3](#c3)

빠른 direct retarget은 가능하면 준비된 surface의 clock을 유지하고, 신규 layout이 필요한 handoff에만 startup barrier를 적용하는 설계를 실험한다. barrier 동안 old writer를 유지할지 frozen pose를 유지할지는 렌더러의 원자적 교체 능력에 따라 정한다.

### 11.4 정착·최대 시간·메모리의 계약

현재 simulation은 최대 600 frame을 계산하고, 정착 조건을 일정 시간 만족하면 끝낸다. 이 상한에 도달했다고 물리적으로 target에 정착했다는 뜻은 아니다. 새 구조에서는 `settled / budget-exhausted / invalid-state`를 구분하고, budget 소진 시 최종 pose와 cleanup의 정책을 명시해야 한다. 모든 custom integrator가 유한 시간에 수렴한다고 가정하지 않는다. [C6](#c6)

기본 scalar restDelta 0.01은 400px 선형 이동에서는 4px다. nonlinear zoom에서는 geometry 오차의 관계가 더 복잡하다. 시각적 정착 판단은 실제 표현 공간의 위치·크기·속도 오차도 관찰하는 것이 좋다. 또한 full-state timeline과 retiring surface가 늘어나는 비용을 함께 측정해야 한다.

## 12. 구현 순서와 완료 조건

**첫 단계의 주제는 “모든 효과 자동 매칭”보다 “요소별 상태와 수명 인계를 정식 계약으로 만들기”가 적합하다.** 그 위에서 같은 pair reverse를 검증하고, A/B/C와 서로 다른 효과로 넓힌다.

| 단계 | 구현 범위 | 다음 단계로 넘어갈 조건 |
|---|---|---|
| 0. 관측 | target key, track key, solver state, generation, handoff reason 기록 | 실제로 어떤 요소가 매칭/탈락했는지 설명 가능 |
| 1. 인계 기반 | target registry, property ownership, handoff와 complete 분리, stale prepare guard | 인계된 DOM/style이 이전 cleanup에 손상되지 않음 |
| 2. 같은 pair reverse | slide/drill의 compatible track, full solver snapshot, direction-aware final lifecycle | 여러 interruption 시점·반복 역전환에서 상태·리소스 검증 |
| 3. Multi와 A/B/C | child별 phase/상태, source-only retirement, 최신 destination, resource budget | 중복 B 없이 C 도착, 미시작 child가 불필요하게 재생되지 않음 |
| 4. effect 간 인계 | canonical 2D pose, supported channel adapters, inertialization | zoom → drill과 hero 리디렉션을 presentation 기준으로 검증 |
| 5. 확장 | timeline phase matching, custom integrator capability, native adapter | 복잡도가 품질 개선으로 확인될 때 선택적으로 공개 |

단계 1은 설계상 작지 않다. 다만 완전한 engine rewrite일 필요는 없다. `HostAnimation`을 coordinator로 유지하면서 target registry를 추가하고, built-in preset의 cleanup을 lease 방식으로 옮기는 점진적인 구현이 가능하다. 기존 custom animation은 이전 경로를 유지하되 continuity capability가 없는 이유를 devtools에 표시한다.

### 12.1 권장 API의 최소 의미

최종 이름을 고정하기 전에 다음 능력만 합의하면 된다.

```ts
// 의사 API: 구현 방향을 검토하기 위한 예시
interface HandoffCapableAnimation {
  describeTracks(): readonly TrackDescriptor[];
  sample(at: PresentationEpoch): SceneSnapshot;
  prepareHandoff(plan: HandoffPlan): PreparedRun;
  detachTransferredChannels(transfer: OwnershipTransfer): void;
}

interface IntegratorContinuation<State> {
  schema: string;
  snapshotAt(time: number): State;
  resume(state: State, target: number): void;
}
```

`sample`은 관측이고, `prepareHandoff`는 새 출력 준비이며, `detach`는 이전 writer의 권리 해제다. 하나의 함수가 값 샘플·DOM 제거·최종 endpoint 적용·callback 호출을 모두 수행하지 않게 만드는 것이 중요하다. 필요하면 초기 구현은 내부 API로 두고 preset 두세 개에서 semantics를 검증한 후 공개한다.

### 12.2 의미 있는 검증 시나리오

| 검증 | 확인해야 할 불변식 |
|---|---|
| A → B를 10/40/80% 부근, overshoot 중, settle 직전에 reverse | 현재 pose 보존, velocity 의미 일치, 올바른 A/B 최종 상태 |
| A ↔ B를 빠르게 반복 | source history·residual·callback·DOM 개수가 반복 횟수에 따라 누적되지 않음 |
| A → B → C 후 즉시 B로 Back | B surface 중복 없음, entry의 effect 방향과 실제 목표 일치 |
| sequence 첫 child만 시작한 상태에서 interruption | 미시작 child가 오래된 sequence를 뒤늦게 실행하지 않음 |
| 같은 element에서 transform·opacity가 다른 child 소유 | writer 충돌 없이 property 합성 |
| zoom → drill, drill → zoom, hero clone → 새 clone | ID 매칭 이후 pose adapter가 실제 표현을 연결 |
| 새 prepare가 이전 prepare보다 먼저 완료 | stale generation이 host를 덮어쓰지 않음, stale resources 해제 |
| hidden mode와 unmount/remount | 이전 cleanup의 style 원복·DOM 제거가 새 owner를 침범하지 않음 |
| startup/paused/playbackRate 0.5·2·negative | timeline velocity와 wall-clock velocity의 계약 일치 |
| scroll·resize·font/image layout 변경 | layout basis 변환 후 위치 연속, stale rect 사용 금지 |
| reduced motion, no matching effect, failure/abort | 최종 destination·focus·visibility가 정확하고 잔존 overlay 없음 |

수치 검증은 solver state와 presentation pose 양쪽에서 해야 한다. 같은 solver의 exact path에서는 허용 가능한 수치 오차 이내의 일치, 다른 effect의 residual path에서는 명시한 채널의 C0/C1을 검사한다. DOM에서는 writer 충돌, 중복 entity 표시, 뒤늦은 cleanup, 클릭 가능한 stale surface를 검사한다.

성능은 평균 FPS 하나보다 **입력 수신 → 새 목표의 첫 시각 반응, reversal의 방향 전환 시간, handoff 때 최대 frame gap, live surface/overlay 수, bake 비용**을 나눠 본다. 60/120Hz 장치, mount가 무거운 화면, 연속 요청으로 비교한다. 실제 기준값은 baseline을 얻은 뒤 정한다.

## 13. 영감을 줄 수 있는 확장 방향

### 13.1 페이지를 작은 rig로 본다

page surface를 root, media·chrome·backdrop을 역할별 node로 생각하면 각 preset은 이 rig에 목표 pose를 주는 graph가 된다. drill과 zoom은 서로 전혀 다른 블랙박스보다 **같은 rig를 다른 방식으로 움직이는 프로그램**이 된다. 모든 임의 DOM을 rig로 등록할 필요는 없고, effect가 소유한 target만 다루면 된다.

이 접근은 ID 매칭의 효용을 높인다. 같은 entity가 다음 페이지에서 다른 DOM이 되어도 rig node의 의미는 유지할 수 있다. transform/clip처럼 함께 움직여야 하는 채널은 같은 group에 두고, 글자 fade처럼 독립적인 채널은 별도로 둔다.

### 13.2 화면의 관성은 보존하되, 주목도는 최신 의도를 따른다

사용자가 C를 골랐을 때 B의 모든 장식이 물리적으로 끝까지 살아야 하는 것은 아니다. B의 큰 surface 운동은 이어받고, A의 작은 그림자나 흐림은 빨리 없애도 전체적으로 자연스러울 수 있다. 엔진은 물리 연결 방법을 제공하고, effect는 어떤 target의 연속성이 중요한지 role로 표현한다.

이는 “모든 요소가 똑같이 부드럽게 움직이는 엔진”보다 실용적인 목표다. content identity와 주요 geometry에 높은 우선순위를 주고, 화면이 복잡해질수록 주변부를 정리한다. 정확한 우선순위·예산은 preset과 제품 맥락에 맞춰 조정한다.

### 13.3 motion debugger는 매칭의 이유를 보여 준다

`getPose()`와 `getTimeline()`이 이미 있으므로 devtools에는 파형만 아니라 다음을 보여 줄 수 있다.

```text
target photo:42 / media
old track zoom.tile → new track drill.media
match: explicit entity ID
continuation: inertialize
preserved: center, scale, velocity
retiring: clip residual
owner: generation 18
```

같은 방식으로 “DOM은 같지만 schema가 달라 scalar를 복사하지 않음”, “duplicate key 때문에 fallback”, “source-only라 retire”를 보여 주면 custom effect 작성자가 결과를 이해할 수 있다. 매칭 품질을 추상적인 점수로만 보여 주기보다 실제 연결 관계와 버린 상태를 보여 주는 편이 유용하다.

### 13.4 처음 실험할 세 장면

가장 먼저 **느린 slide A ↔ B**로 identity·속도·전체 solver state·cleanup을 확인한다. 다음은 **A → B 진입 도중 C 선택**으로 target별 role 변경과 source-only retirement를 확인한다. 마지막으로 **동일 B의 zoom → drill**로 서로 다른 pose 함수 사이의 잔차 보정이 실제로 좋아지는지 비교한다.

이 세 장면이 설득력 있게 이어지면 SSGOI의 방향은 분명해진다. transition 함수는 원하는 연출을 계속 반환하되, 실행기는 그 연출이 닿는 각 target의 현재 운동과 수명을 이해한다. 그다음부터 효과의 종류가 늘어도 공통 handoff 계약 위에서 확장할 수 있다.

## 14. 조사 범위와 재현 자료

코드 기준은 `@ssgoi/core` 7.1.0, commit `ded5c0789dd3696ba5da73422f52668664421127`이다. 자료 확인일은 2026-09-12다. 웹 경로는 core animation·preset·navigation context를 중심으로 읽었다. React Native는 별도의 `PageMotionPlan`과 UI clock 경로임을 확인했으며, 웹 `HostAnimation`의 handoff 수정이 native에 자동 적용된다고 가정하지 않는다. [C11](#c11)

외부 근거는 프레임워크 공식 문서, Apple의 실제 인터페이스 설계 발표, 게임 엔진 문서, 원 저자의 알고리즘 설명을 우선했다. Unreal inertialization의 세부 근거 중 일부는 접근 가능한 4.27 문서의 설명이다. Motion Matching은 현재 공식 문서를 별도로 확인했다. CSS Level 2는 Editor’s Draft이므로 배포된 브라우저 기능 전체와 동일시하지 않는다. 상용 앱별 최신 build를 설치해서 reverse UX를 촬영하거나 사용자 실험을 수행한 보고서는 아니다.

수식은 supported Euclidean 채널에서 유도한 접합 조건이며, 임의의 DOM/CSS에 대한 자동 보장을 뜻하지 않는다. 코드의 가능한 수명·clock 문제는 구현 위치에 근거한 설계 검토 사항이다. 수치 예제는 아래 script로 checked-out integrator를 직접 호출했으며, product runtime 수정이나 end-to-end 브라우저 검증을 수행한 것은 아니다.

- [실험 코드](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/experiments.cjs): 저장소 루트에서 `node research/transition-interruption/experiments.cjs`로 재현.
- [실험 결과와 sample](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/experiment-results.json): double spring 비교, 좌표 재매개화, residual의 초기 derivative 확인.
- [읽기용 보고서](/Users/moon/work/오픈소스/ssgoi/research/transition-interruption/report.html): 도식과 간단한 target 변경 실험을 포함하는 독립 문서. 실험은 개념 설명용이며 현재 SSGOI의 실제 화면 동작을 재현하는 제품 demo가 아니다.

## 15. 출처

본문 숫자 링크는 원문으로 연결되며, 아래에 전체 서지와 사용 범위를 정리했다. 수치 example과 아키텍처·UX 정책은 별도 표시한 SSGOI 설계 제안이다.

1. Apple. [Explore SwiftUI animation](https://developer.apple.com/videos/play/wwdc2023/10156/). WWDC23, 2023. Animatable attribute, model/presentation value, merge와 velocity.
2. Apple. [Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/). WWDC23, 2023. Retarget의 초기 속도, 지각적 duration과 settling duration.
3. Android Developers. [Value-based animations](https://developer.android.com/develop/ui/compose/animation/value-based). 상시 갱신 문서. Animatable, Transition, 현재 값에서의 interruption.
4. Flutter. [Hero class](https://api.flutter.dev/flutter/widgets/Hero-class.html). 상시 갱신 API 문서. Tag, overlay, in-flight redirection, geometry와 content 제약.
5. Motion. [Layout animations](https://motion.dev/docs/react-layout-animations). 상시 갱신 문서. LayoutId, transform, interruptible layout와 nested motion. Native 비교의 포괄적인 성능 주장은 이 보고서에서 채택하지 않음.
6. Motion. [React transitions](https://motion.dev/docs/react-transitions). 상시 갱신 문서. Physics/duration spring의 velocity 차이와 spring 설정.
7. Motion. [AnimatePresence](https://motion.dev/docs/react-animate-presence). 상시 갱신 문서. Sync, wait, popLayout.
8. Motion. [View animations / animateView](https://motion.dev/docs/animate-view). 상시 갱신 문서. Native view transition의 queue 및 immediate 정책.
9. CSS Working Group. [CSS Transitions Module Level 1](https://drafts.csswg.org/css-transitions-1/), §3 및 §3.1. 현재 값에서 재시작, reversing shortening 규칙.
10. Daniel Holden. [Spring-It-On: The Game Developer’s Spring-Roll-Call](https://theorangeduck.com/page/spring-roll-call). 2021-03-04, 이후 갱신. Spring residual을 이용한 inertialization 절.
11. Epic Games. [Blend Nodes — Inertialization](https://dev.epicgames.com/documentation/en-us/unreal-engine/blend-nodes?application_version=4.27). Unreal Engine 4.27 문서. Source 평가 종료, 반복 interruption, graph 위치, notification 제약.
12. Unity. [Animation transitions](https://docs.unity3d.com/6000.0/Documentation/Manual/class-Transition.html). Unity 6.0 (6000.0) 문서. Interruption Source와 Ordered Interruption.
13. Epic Games. [Motion Matching](https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-matching-in-unreal-engine). 현재 공식 문서. Pose/trajectory query, schema, database 선택.
14. Apple. [Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/). WWDC18, 2018. iPhone X의 방향 재지정·interruption·진행 중 상호작용.
15. CSS Working Group. [CSS View Transitions Module Level 1](https://drafts.csswg.org/css-view-transitions-1/), `startViewTransition()` algorithm 및 lifecycle. Existing active transition skip과 update callback.
16. CSS Working Group. [CSS View Transitions Module Level 2](https://drafts.csswg.org/css-view-transitions-2/). Editor’s Draft, 확인한 문서 표기 2026-08-31. Scoped transitions와 nested groups. 브라우저별 shipping 여부는 별도.
17. Android Developers. [Predictive back design](https://developer.android.com/design/ui/mobile/guides/patterns/predictive-back?hl=en). 상시 갱신 문서. Pre-commit, cancel, shared-element gesture 설계.
18. David Bollo, The Coalition / Microsoft Studios. [High Performance Animation Transitions in Gears of War](https://media.gdcvault.com/gdc2018/presentations/bollo_david_inertialization_high_performance.pdf). GDC 2018, 특히 PDF p.16–20. Pose 차이 감쇠, velocity, quintic, overshoot 제어.
19. Daniel Holden. [Dead Blending](https://theorangeduck.com/page/dead-blending). 2023-02-25. Source extrapolation과 destination blending.
20. Daniel Holden. [Inertialization Transition Cost](https://theorangeduck.com/page/inertialization-transition-cost). 2022-06-02. 단위가 다른 feature의 비용과 residual 기반 transition cost.

### 저장소 근거

각 링크는 확인한 checkout의 실제 파일과 시작 행이다. 같은 commit의 코드 기준이며, 이후 코드가 바뀌면 행 번호도 달라질 수 있다.

<a id="c1"></a>**C1. Animation과 Pose 계약.** [runtime/animation.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/runtime/animation.ts:3), [runtime/motion-state.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/runtime/motion-state.ts:1).

<a id="c2"></a>**C2. Host의 인계 순서.** [host-animation.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/animation/host-animation.ts:26).

<a id="c3"></a>**C3. Web driver.** [web-animation.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/animation/web-animation.ts:83). `reverse` 100행, `complete` 120행, `getPose` 185행, `matchInto` 213행, `runToward` 222행, `captureLiveState` 299행, startup 308행 이후.

<a id="c4"></a>**C4. Composite.** [multi-animation.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/animation/multi-animation.ts:31). `matchInto` 90행, child scheduling 123행 이후.

<a id="c5"></a>**C5. DOM 수명과 prepare/attach.** [create-ssgoi-transition-context.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/ssgoi-transition/create-ssgoi-transition-context.ts:162). Hidden owner 169행 이후, `runTransition` 261행, `createElement` 351행, prepare/cleanup/attach 369행 이후.

<a id="c6"></a>**C6. Integrator와 timeline.** [double-spring-integrator.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/animation/integrator/double-spring-integrator.ts:45), [spring-integrator.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/animation/integrator/spring-integrator.ts:40), [runtime/timeline.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/runtime/timeline.ts:7).

<a id="c7"></a>**C7. Zoom과 drill.** [zoom/transition.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/transitions/zoom/transition.ts:193), [drill/transition.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/transitions/drill/transition.ts:28), [drill/provider/parallax.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/transitions/drill/provider/parallax.ts:11).

<a id="c8"></a>**C8. Hero pair와 clone.** [hero/transition.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/transitions/hero/transition.ts:66). Key pair 92행, clone 318행 이후.

<a id="c9"></a>**C9. Navigation entry와 효과 기억.** [navigation-transition.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/ssgoi-transition/navigation-transition.ts:13), [navigation-direction.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/ssgoi-transition/navigation-direction.ts:34).

<a id="c10"></a>**C10. Page boundary ID.** [React ssgoi-transition.tsx](/Users/moon/work/오픈소스/ssgoi/packages/react/src/lib/ssgoi-transition.tsx:18).

<a id="c11"></a>**C11. Native의 별도 실행 경로.** [React Native playback.ts](/Users/moon/work/오픈소스/ssgoi/packages/react-native/src/playback.ts:14), [runtime/page-motion.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/runtime/page-motion.ts:44).
