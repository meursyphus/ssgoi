# SSGOI의 인터럽트 가능한 전환 런타임 청사진

## 1. 논의의 출발점: 끝나지 않은 전환에 다음 전환이 들어온다

SSGOI의 페이지 전환은 효과가 반환한 `Animation` 객체를 실행하면서 진행된다. 이 객체는 하나의 요소를 움직일 수도 있고, 여러 animation을 묶어 페이지·사진·배경·가림판을 함께 움직일 수도 있다. 효과마다 움직이는 대상, 속성, 시작 순서가 다르다.[^20]

문제는 사용자가 그 전환이 끝날 때까지 기다리지 않는다는 데서 시작한다. A에서 B로 이동하다가 바로 A로 돌아갈 수 있고, B가 들어오는 중에 C를 열 수도 있다. 다음 전환은 이전과 같은 효과일 수도 있지만, drill에서 zoom으로, blind에서 slide로 바뀔 수도 있다.

**이 문서의 질문은 진행 중인 전환을 다음 전환으로 교체할 때, 여러 요소의 움직임을 어떻게 취소·중첩·인계해야 하나의 자연스러운 동작으로 보이게 할 것인가다.**

### 1.1 전환 하나가 여러 움직임을 소유한다

예를 들어 A에서 B로 drill 전환이 진행 중이라고 하자. A는 뒤로 물러나고 B는 오른쪽에서 들어온다. 그 도중 B의 사진을 눌러 C를 zoom으로 열면, B는 이제 새 전환의 배경이 되고 C와 사진의 확대 동작이 추가된다. 이전 A가 아직 화면에 남아 있을 수도 있다.

```text
First request: A -> B / drill

    A surface -------- leaving
    B surface -------- entering

                  [next request arrives here]

Next request: B -> C / zoom

    B surface -------- new background motion
    C surface -------- entering
    shared media ----- expanding

Still on screen?

    A surface -------- unfinished old motion
```

여기서 이전 animation을 강제 완료하고 새 animation을 처음부터 시작하면, B가 들어오던 위치에서 갑자기 기본 위치로 바뀌거나 속도가 끊길 수 있다. 반대로 이전 animation들을 모두 계속 실행하면 같은 B를 여러 실행이 동시에 제어하거나, 이미 지난 탐색의 연출이 뒤늦게 나타날 수 있다.

blind는 이 문제를 더 분명하게 보여 준다. 페이지뿐 아니라 임시 가림판 여러 개가 움직이고, 다음 효과에는 그 가림판이 아예 없을 수 있다. 따라서 전환 객체 하나에 대한 취소 여부만으로는 부족하다. **그 객체가 움직이던 각각의 대상이 앞으로 어떻게 되어야 하는지**를 판단해야 한다.[^19]

### 1.2 적분기를 도입한 이유: 움직임 도중에 목표를 바꾸기 위해

이런 연속 입력은 SSGOI가 integrator 기반의 움직임을 선택한 중요한 배경이다. 단순히 spring 특유의 튕김을 만들기 위한 선택이 아니다. 이미 움직이고 있는 상태에서 목표가 바뀌어도, 현재 위치와 속도를 다음 움직임의 출발점으로 삼고 싶기 때문이다.

일반적인 duration + Bezier easing은 정해진 시간 동안 시작값에서 끝값까지 가는 경로를 만든다. 진행 중 새 easing을 시작할 때 현재 위치만 가져오면 위치는 맞출 수 있어도 속도는 자동으로 이어지지 않는다. 특히 새 곡선의 시작 속도가 0이면, 움직이던 대상이 잠깐 멈췄다가 다시 출발하는 느낌이 생긴다.

물리 기반 spring은 현재 위치와 속도를 상태로 두고 목표를 향해 진행한다. 오른쪽으로 가던 대상의 목표가 왼쪽으로 바뀌면, 오른쪽 속도를 유지한 상태에서 감속한 뒤 왼쪽으로 돌아선다. 입력 순간에 속도의 부호를 뒤집거나, 일단 원래 목적지까지 도착할 필요가 없다. Apple의 spring 설명도 gesture와 retarget에서 현재 속도를 초기 조건으로 사용하는 이유를 다룬다.[^21]

```text
Typical easing restart

    current position --------> next curve's start position
    current velocity --- ? --> next curve's initial velocity

State-based continuation

    current position --+
    current velocity --+-----> continue toward a new target
    new target --------+
```

Bezier 곡선으로 속도 연속성을 만들 수 없다는 뜻은 아니다. 현재 속도에 맞게 경계 조건을 다시 구성할 수도 있다. 중요한 차이는 **고정된 easing을 새로 재생하는 것과, 기존 운동 상태를 받아 다음 경로를 계산하는 것**이다. 마찬가지로 integrator라는 이름만 붙였다고 연속성이 보장되는 것은 아니며, 실제로 그 상태를 보존하고 사용해야 한다.

### 1.3 적분기가 있어도 전환 사이의 연결은 남는다

같은 대상의 목표만 바꾸는 경우에는 상태 인계가 비교적 명확하다. 그러나 페이지 전환이 교체되면 새 animation 객체와 새 요소들이 만들어지고, 이전 요소의 역할도 달라진다. integrator는 전달받은 상태로 움직임을 계산할 수 있지만, **어느 이전 요소의 상태를 어느 새 요소에 넘겨야 하는지까지 결정하지는 않는다.**

또한 효과 내부의 진행률이 같다고 화면의 자세가 같은 것도 아니다. drill의 진행률은 주로 페이지의 수평 위치를 결정하고, zoom의 진행률은 위치·크기·clip을 함께 결정할 수 있다. `0.4`라는 값과 그 변화 속도를 그대로 복사해도, 서로 다른 효과에서는 전혀 다른 화면 위치와 속도로 나타날 수 있다.

그래서 두 층의 연속성을 함께 다뤄야 한다.

| 층 | 해결해야 하는 질문 |
|---|---|
| 운동의 연속성 | 현재 위치·크기·회전과 그 변화 속도에서 어떻게 새 목표로 이어갈 것인가 |
| 대상과 실행의 연속성 | 어떤 요소가 같은 대상이며, 무엇을 유지·교체·제거하고 어떤 미시작 단계를 취소할 것인가 |

현재 SSGOI에는 `getPose()`와 `matchInto()`라는 인계 계약의 출발점이 있고, Host가 이전 pose를 채집해 다음 animation에 전달하는 경로도 있다. 이 논의는 그 의도를 여러 요소·서로 다른 효과·연속 탐색까지 확장하는 설계에 관한 것이다.[^16][^18]

### 1.4 게임과 다른 라이브러리를 조사하는 이유

게임 캐릭터도 달리던 중 멈추거나, 다른 방향으로 돌거나, 새로운 동작을 시작한다. 여러 bone이 서로 다르게 움직이는데 clip이 바뀔 때마다 모두 초기 자세로 돌아간다면 자연스럽지 않다. UI 프레임워크 역시 animation 도중 target이 바뀌고, 움직이는 element나 화면 자체가 교체되는 일을 다룬다.

이 사례들에서 얻고 싶은 것은 특정 spring 상수나 효과 하나가 아니다. **현재 운동을 누가 기억하고, 새 동작을 누가 선택하며, 두 실행 사이의 연결과 대상의 수명을 어디서 관리하는가**라는 구조다. 게임의 pose matching·blending·inertialization과 UI의 value holder·shared-element flight·presence 관리를 이 관점에서 비교한다.

게임의 Motion Matching은 다음 clip의 적절한 frame을 검색하는 단계까지 포함한다. SSGOI에서는 다음 효과가 이미 route rule로 정해지는 경우가 많다. 따라서 먼저 가져올 아이디어는 **동일 대상을 연결하고 현재 pose·velocity를 이어 주는 공통 처리**이며, 다음 효과를 검색하는 알고리즘 전체를 도입하는 것은 아니다.

### 1.5 이 문서가 제안하려는 방향

출발 가설은 다음과 같다. **새 전환은 앞으로의 연출을 갱신하고, 현재 화면에 있는 대상의 운동 상태는 그 전환 객체보다 오래 유지한다.** 현재 대상과 새 효과가 필요로 하는 대상을 연결해, 이어받는 대상은 새 경로로 보내고 나머지는 등장시키거나 정리한다.

이때 ‘중첩’도 구분해야 한다. B가 작아지는 동안 가림판이 열리는 것은 서로 다른 대상의 동작이 공존하는 경우다. 같은 B의 transform에 두 효과가 기여한다면 최종 출력을 합성할 주체가 필요하다. 예전 animation을 계속 실행할지, 현재 상태만 남겨 새 animation에 넘길지는 공통 연결 정책으로 다룬다.

목표는 `drill -> zoom`, `blind -> drill` 같은 조합마다 예외를 작성하는 것이 아니다. **요소의 대응 관계와 현재 운동 상태를 바탕으로 반복 적용할 수 있는 매칭·인계 규칙**을 만드는 것이다. 다음 절에서는 실제 구현에서 그 구조를 찾고, 이를 근거로 SSGOI의 Host·Scene·Plan 경계를 제안한다.

## 2. 실제 코드에서 확인한 관리 방식

아래 사례는 새 동작이 들어왔을 때 무엇을 교체하고 무엇을 계속 유지하는지에 초점을 맞춘다. 각 구현이 제공하는 연속성의 수준도 구분한다. 현재 위치에서 다시 시작하기와 속도까지 보존하기는 같은 보장이 아니며, 공개 프레임워크도 모든 상황에 한 가지 처리만 적용하지는 않는다.

### 2.1 게임 Motion Matching: clip보다 오래 사는 pose와 잔차

Daniel Holden의 공개 Motion-Matching 구현은 현재 clip의 pose, 최종 출력 pose, bone별 위치·속도·회전 잔차를 별도 배열로 유지한다. 검색으로 더 적절한 frame이 선택되면 `inertialize_pose_transition()`으로 인계 상태를 만들고 `frame_index`를 교체한다. 이후에는 새 frame의 pose를 읽고 `inertialize_pose_update()`를 적용한다. 과거 clip 목록을 무한히 쌓는 구조가 아니다.[^1]

```text
Input / desired trajectory
            |
            v
      Pose search ----------------> selected clip + frame
                                            |
                                            v
                                       raw pose
                                            |
Persistent bone offsets -------------------+
                                            |
                                            v
                                   final output pose
```

`spring.h`의 인계 함수는 기존 잔차까지 포함한 source와 새 destination의 차이를 기록한다. update 함수는 그 잔차를 감쇠하고 새 pose와 합친다. 위치·회전은 서로 다른 연산을 사용한다. 즉 공통화의 기반은 “모든 데이터를 숫자 하나로 본다”가 아니라 **같은 skeleton과 정의된 pose 연산을 공유한다**는 것이다.[^2]

SSGOI에 가져올 아이디어는 두 가지다. 첫째, 새 효과를 고르는 일과 연결하는 일을 분리한다. 둘째, 이미 움직이는 요소의 상태는 효과 실행보다 오래 유지한다. 페이지 전환에서는 다음 효과가 route rule로 이미 정해지는 경우가 많으므로, 대규모 pose 검색부터 도입할 필요는 없다.

다만 게임의 같은 skeleton은 매 clip마다 bone 구성이 비교적 안정적이다. 페이지에서는 DOM이 추가·제거되고 blind의 조각까지 생긴다. 따라서 bone별 연결 원리에 **요소의 생존 관리**를 더해야 한다.

### 2.2 Godot: 여러 animation의 기여를 모으는 공통 mixer

Godot의 `AnimationMixer`는 animation track을 실제 node·property·bone에 연결하는 cache를 만든다. 매 평가에서는 기본값을 준비하고, 여러 animation의 가중 기여를 계산한 뒤, 연속적인 transform/value 결과를 적용한다. animation마다 각자 최종 화면을 덮어쓰게 두는 대신 공통 합성 단계가 존재한다. 기본 pose를 정의하는 `RESET` animation도 이 과정에 사용된다.[^3]

```text
Clip X ---- weight / track values ---+
                                    |
Clip Y ---- weight / track values ---+--> Mixer --> Node / Bone
                                    |
Base pose --------------------------+
```

중간 전환을 무제한 허용한다고 가정해서는 안 된다. 확인한 state-machine 코드에는 `current`와 `fading_from`을 가중치로 함께 평가하는 경로가 있고, 일반적인 다음 상태 전이는 fade가 남아 있으면 기다리는 조건이 있다. 명시적인 next 요청은 별도로 다룬다. 이것은 해당 코드 경로의 정책이며, 모든 Godot animation이 같은 제한을 갖는다는 뜻은 아니다.[^4]

SSGOI에 필요한 영감은 **합성 방식과 전환 허용 정책을 분리할 수 있다**는 점이다. 동일 target의 translation·scale·clip은 하나의 출력 계층에서 합성하고, 최신 탐색을 즉시 반영할지는 Host의 정책으로 정한다. Godot의 대기 정책을 그대로 채택할 필요는 없다.

### 2.3 Compose: 값의 수명, transition의 수명, content의 수명이 다르다

`Animatable`은 `internalState`에 현재 value와 velocity를 보관한다. 새 `animateTo()`는 현재 value를 시작값으로 쓰고, 기본 initial velocity도 현재 velocity다. 실행의 상호 배제와 취소는 `mutatorMutex`가 관리한다. **이전 실행이 취소되어도 value holder 자체가 사라지는 것은 아니다.**[^5]

여러 값을 관리하는 `Transition`에는 공통 interruption 정책도 있다. 확인한 `updateAnimation()` 경로는 진행 중인 non-spring animation이 interruption되면 별도의 spring spec을 선택하고, 현재 value와 velocity vector로 새 animation을 만든다. 모든 원래 timing curve를 그대로 유지하려는 방식은 아니다.[^6]

콘텐츠 자체는 `AnimatedContent`에서 별도로 관리한다. `currentlyVisible` 목록과 `contentKey`로 기존 콘텐츠와 새 target을 연결하고, 퇴장 조건을 만족한 content는 dispose한다. 따라서 중간에 target이 바뀌는 문제에는 **값의 retarget과 콘텐츠의 생존 여부 판단**이 함께 들어간다.[^7]

```text
target state
    |
    v
Transition
    +-- child value state ----> new animation / spring continuation
    +-- child value state ----> new animation / spring continuation
    |
    +-- AnimatedContent
          +-- currently visible contents
          +-- keyed target content
          +-- exit / disposal
```

SSGOI에서는 `Animation` 객체를 취소하는 행위가 페이지 제거와 곧바로 연결되지 않게 해야 한다. 또한 “normal run에서는 authored curve, interruption에서는 공통 spring 연결”처럼 **평상시 연출과 접합 정책을 다르게 두는 선택**도 가능하다.

### 2.4 Motion: MotionValue, layout projection, presence를 구분한다

일반 값 애니메이션에서 `MotionValue`는 현재값과 이전 frame 정보를 유지한다. `start()`는 이전 animation을 멈추고 새 실행을 등록한다. `animateMotionValue()`는 새 실행 옵션에 `value.getVelocity()`를 전달한다. 값 holder와 실행 객체가 분리되어 있다.[^8][^9]

layout/shared-element 경로는 구조가 더 크다. `ProjectionNode`가 layout snapshot과 target delta를 유지하고, 같은 `layoutId`의 node들은 `NodeStack`으로 관리된다. 새로운 lead를 선택할 때 이전 lead의 snapshot과 animation values를 넘기는 경로가 있다. **같은 의미의 대상이 다른 DOM instance로 표현되는 문제를 별도로 관리하는 셈이다.**[^10][^11]

```text
Property motion              Shared layout              Element lifetime

MotionValue                  ProjectionNode             AnimatePresence
  current / previous           snapshot / delta           rendered children
  active animation             shared NodeStack           exiting keys
       |                             |                         |
       +-----------------------------+-------------------------+
                                     v
                              final rendered element
```

여기서 보장 수준을 정확히 봐야 한다. 확인한 projection `startAnimation()`은 진행률을 다시 0으로 설정하고 새 progress animation에 `velocity: 0`을 넣는다. 따라서 일반 MotionValue의 속도 전달을 근거로 모든 layout handoff가 화면 좌표의 속도까지 그대로 보존한다고 말할 수 없다.[^10]

`AnimatePresence`는 또 별도로 keyed children과 exit 완료를 추적하고, 제거된 child를 렌더 목록에 남겼다가 정리한다. `wait`일 때 진입을 기다리게 하는 정책도 여기 있다.[^12]

SSGOI에 가져올 것은 세 역할의 분리다. **값을 이어받기, 다른 DOM을 같은 대상으로 연결하기, 퇴장 중인 DOM을 살려 두기는 서로 다른 기능**이다. 하나의 `getPose()` 구현만으로 세 가지가 모두 생기지는 않는다.

### 2.5 Flutter: 여러 수준의 연결 장치가 이미 있다

Flutter는 이 문제를 하나의 API로 해결하지 않는다. **같은 widget의 값 변경, 여러 child의 입퇴장, route 사이의 협조, shared element의 비행**을 각각 다른 장치로 다룬다. 따라서 Flutter에서 자연스러운 장면을 보았다고, 그 장면 전체가 하나의 pose matcher로 실행된다고 가정해서는 안 된다.

#### 같은 widget의 목표 변경: AnimatedContainer와 직접 spring 구동

크기 100인 상자가 300으로 커지는 도중 목표를 180으로 바꾼다고 하자. `ImplicitlyAnimatedWidgetState.didUpdateWidget()`의 일반적인 tween 갱신 경로는 현재 tween을 평가해 새 시작값으로 삼고, controller를 0부터 다시 실행한다. 크기가 처음 값으로 튀는 문제는 줄이지만, 현재 크기 변화의 속도까지 새 곡선에 넘기는 일반적인 경로는 아니다.[^22]

`AnimationController.animateWith()`에 현재 value와 velocity로 구성한 `SpringSimulation`을 넘기는 방식으로 물리적 연결을 직접 만들 수도 있다. 이것은 SSGOI의 integrator 의도와 가깝다. 다만 어떤 property와 어떤 controller의 상태를 이어받을지는 작성자가 구성해야 한다. `animateTo()`를 쓴다는 사실만으로 같은 보장이 생기지는 않는다.[^14]

#### 연속 콘텐츠 교체: AnimatedSwitcher

A가 B로 바뀌고, A의 퇴장이 끝나기도 전에 B가 C로 바뀌면 `AnimatedSwitcher`는 여러 outgoing child를 동시에 보존할 수 있다. 코드에는 `_currentEntry`와 `_outgoingEntries`가 있고, 이전 current의 controller를 reverse하면서 새 child의 controller를 만든다.[^23]

```text
After A -> B -> C in quick succession

AnimatedSwitcher
    +-- A entry / exiting
    +-- B entry / exiting
    +-- C entry / entering
```

이 기능은 “이전 화면이 아직 나가는 동안 새 화면이 온다”는 수명 문제를 해결한다. 그러나 이미 outgoing인 A와 같은 key의 새 A를 넣어도 두 entry를 같은 대상으로 복구하는 것은 아니다. 공식 문서도 그 둘은 관련된 대상으로 취급되지 않는다고 설명한다. 따라서 `A -> B -> A`를 현재 A의 운동 상태로 되돌리는 일반적인 identity handoff와는 구분해야 한다.[^24]

effect 자체를 바꾸는 경우도 주의해서 읽어야 한다. `transitionBuilder`가 바뀌면 current와 outgoing entries를 새 builder로 다시 구성하는 코드가 있다. 이것은 기존 화면의 pose를 해석해서 새 builder에 물리적으로 인계하는 절차와 다르다. 같은 controller 값이라도 새 builder가 다른 geometry를 만들면 연속성은 작성자가 맞춰야 한다.[^23]

#### 서로 다른 page transition: primary/secondary와 delegatedTransition

Flutter에는 B 자신의 진입·퇴장을 나타내는 `animation`과, 위에 올라오는 C의 전환에 맞춰 B를 움직이는 `secondaryAnimation`이 있다. B의 입장이 아직 진행 중이면 B의 자체 움직임과 C에 대응하는 움직임을 함께 표현할 수 있다.[^25]

더 직접적인 사례는 **`delegatedTransition`**이다. 새 C route가 “내가 들어올 때 아래의 B는 이렇게 움직여 달라”는 builder를 제공하고, B는 이를 `receivedTransition`으로 받는다. 공식 예제는 Material zoom, Cupertino slide, custom vertical 전환을 한 앱에서 섞으면서 이 방식을 사용한다.[^26]

```text
B route                                     C route
    |                                           |
    +-- own primary animation                   +-- enter animation
    |                                           |
    +-- received outgoing transition <----------+-- delegatedTransition
    |
    v
composed appearance of B
```

확인한 `_buildFlexibleTransitions()`는 B의 기존 secondary 전환을 억제한 원래 transition 결과를 만들고, 그 결과를 C가 넘겨준 builder로 감싼다. **일부 경로에서는 B의 기존 진입 표현 위에 새 퇴장 표현을 합성하는 방식**이다. `drill -> zoom`마다 별도 adapter를 작성하기보다 새 효과가 자기 진입과 짝을 이루는 outgoing 표현을 한 번 제공한다는 점에서 SSGOI에 매우 가까운 선례다.[^25][^26]

전환 신호 자체가 바뀔 때에는 `_updateSecondaryAnimation()`이 `TrainHoppingAnimation`을 쓰는 경로도 있다. 기존 신호와 새 신호의 값이 교차하면 연결을 바꾸고, 교차하지 않으면 새 animation 종료 시 교체한다. 값을 이어 붙이기 위한 장치이며, 두 신호의 속도가 같다는 보장이나 임의의 geometry에 대한 C1 보장은 아니다.[^25][^27]

#### shared element: Hero flight의 재지정

`HeroController`에는 tag로 식별되는 `_flights` map이 있다. 새 route 전환에서 이미 비행 중인 같은 tag를 찾으면 새 flight를 만들기보다 기존 flight의 `divert()`를 호출한다. flight는 overlay, 현재 rect 경로, source/destination manifest를 가진다.[^13]

```text
Navigation events
  A -> B
  B -> C
  C -> B
     |
     v
HeroController
  flights["photo:42"] ------------------ same ongoing flight
      |
      +-- new destination / manifest
      +-- updated rect path
      +-- overlay + placeholders
```

`divert()`는 push->pop, pop->push, 다른 목적지로의 재지정을 구분한다. 일반 재지정 경로는 현재 rect를 평가해서 새 rect 경로의 시작으로 쓴다. 이는 위치 인계의 구체적인 구현이지만, arbitrary effect 간 물리적 속도 보존을 일반적으로 보장하는 코드는 아니다. 완료 시 overlay와 양쪽 Hero의 placeholder도 flight 생명주기에 맞춰 정리한다.[^13]

**Flutter에 대한 판단:** 연속 콘텐츠의 수명, 같은 Hero의 재지정, 서로 다른 route 효과의 협조까지 상당 부분 구현되어 있다. 특히 delegated transition은 이 청사진에 직접 가져올 만하다. 다만 이 장치들이 모든 자식 요소의 pose·velocity를 모아 임의의 effect 교체를 자동 연결하는 하나의 엔진은 아니다. 각 API의 표현 단위와 연결 보장을 결합해야 한다.

Cupertino의 back gesture에서도 구분이 필요하다. 확인한 `dragEnd()` 경로는 release velocity를 완료/복귀 방향 결정에 사용하지만, 이후에는 정해진 duration과 curve로 `animateTo/animateBack`한다. gesture의 속도를 사용한다는 사실과, 그 속도 자체를 그대로 spring의 초기 속도로 넘긴다는 것은 다르다.[^28]

### 2.6 SwiftUI와 UIKit: 내장 전환에서는 목표에 상당히 가깝다

SwiftUI의 내부 엔진 전체는 공개 소스로 확인한 대상이 아니다. 공식 설명에서 확인되는 계약은 animatable attribute의 model/presentation value와, animation의 `animate`, `shouldMerge`, `velocity`다. spring은 이전 animation의 상태를 merge하고, 다른 animation은 결과를 함께 합성하는 방식도 사용한다.[^15]

#### 같은 표현 속성을 계속 바꾸는 경우

같은 view의 offset이나 scale을 spring으로 움직이는 도중 새 값을 지정하는 장면은 SwiftUI가 직접 다루는 문제다. 현재 속도를 새 spring으로 전달하는 merge 계약이 있으므로, 이 범위에서는 SSGOI가 원하는 “현재 운동에서 새 목표로 간다”와 상당히 가깝다. animation의 identity와 animatable data가 이어지는 범위를 전제로 봐야 한다.[^15][^21]

#### 사진을 열다가 바로 닫거나 다시 붙잡는 경우

Apple은 iOS 18의 zoom navigation/presentation을 처음부터, 또는 진행 중에도 잡아서 조작할 수 있는 전환으로 소개한다. SwiftUI에서는 source ID와 namespace를 통해 출발 view를 연결한다. 셀에서 상세 화면으로 확대하던 중 되돌리는 UX는 여기서 직접적인 모티브를 얻을 수 있다.[^29][^30]

같은 발표의 UIKit 설명에는 수명 처리도 나온다. push 중 pop이 시작되면 appearance lifecycle에서는 push를 즉시 완료한 뒤 pop으로 넘어간다. **화면 운동의 연속성과 view controller의 논리적 lifecycle을 다른 규칙으로 처리**하는 사례다. 이 lifecycle 설명을 “화면을 최종 좌표로 한 프레임 snap한다”는 뜻으로 읽어서는 안 된다.[^29]

```text
User action:       begin zoom in ---- grab / reverse ---- zoom out

Visual motion:     current presentation continues

UIKit lifecycle:   appearing -> appeared -> disappearing
                               logical handoff
```

**SwiftUI/Apple 플랫폼에 대한 판단:** 정해진 source/destination과 시스템이 관리하는 zoom·gesture에서는 목표로 삼을 만한 수준을 이미 보여 준다. “다른 프레임워크는 이런 것을 못 한다”는 전제는 맞지 않는다. 반면 이 공개 계약이 custom blind 조각, 임의의 mask, 서로 다른 효과의 모든 자식 요소를 자동 매칭·퇴장시키는 범용 기능까지 보장하는 것은 아니다. 내장 전환의 높은 완성도와 custom effect의 표현 범위는 별도로 비교해야 한다.

### 2.7 React Native: 값의 animation과 화면 navigation을 나눠 봐야 한다

React Native에서는 core `Animated`, Reanimated, React Navigation의 JS stack, native stack이 서로 다른 수준을 맡는다. “React Native에서 애니메이션을 취소했다”는 말만으로 어떤 상태가 보존되는지 알 수 없다.

#### 단일 값의 목표 변경: Reanimated와 core Animated

Reanimated에서는 같은 shared value에 `withSpring(newTarget)`을 다시 할당하는 방식으로 목표를 바꾼다. `valueSetter()`는 이전 animation을 취소하고, 현재 value와 이전 animation 객체를 새 `onStart()`에 전달한다. 즉 취소와 상태 전달이 함께 존재한다.[^31]

**그렇지만 확인한 Reanimated 4.6.0의 spring은 모든 방향의 기존 속도를 그대로 보존하지 않는다.** 이전 속도를 받아온 뒤, 그 속도가 새 목표의 반대 방향이면 0으로 만든다. 개발 branch뿐 아니라 배포 tag `4.6.0`의 동일 코드에서도 확인했다.[^32]

```text
Before interruption:      x = 120, velocity = +400
New target:               x = 0

Strict velocity carry:    +400 -> slows down -> 0 -> negative
Reanimated 4.6.0 path:        0 -> negative
```

이 경로는 새 목표 쪽으로 즉시 움직이는 성질을 택한다. SSGOI가 원하는 “반대쪽으로 조금 더 갔다가 물리적으로 돌아선다”와는 차이가 있다. 이는 숫자 `withSpring`의 초기화에 대한 설명이며, native navigator의 모든 gesture가 같은 규칙을 쓴다는 뜻은 아니다.

여러 요소를 하나의 progress에서 구동하는 경우에는 또 다른 구분이 필요하다. progress의 속도를 보존하더라도, 그 값을 화면 위치로 해석하던 함수를 scale이나 다른 경로로 바꾸면 표현 속도가 자동으로 일치하지 않는다. Reanimated가 shared value를 유지하는 능력과 SSGOI가 필요로 하는 effect 간 presentation pose 인계는 다른 층의 문제다.

core `Animated`의 `SpringAnimation.start()`에도 이전 spring의 위치·속도 상태를 가져오는 코드가 있다. 다만 이 기반을 가졌다고 여러 page·shared element·임시 effect의 identity와 수명이 자동으로 연결되는 것은 아니다. native driver까지 포함한 모든 조합의 결과를 이 함수 하나로 일반화할 수도 없다.[^33]

#### 화면 전체의 전환: React Navigation JS stack

JS stack의 `Card`는 하나의 gesture 값을 spring 또는 timing animation으로 구동하고, gesture 종료 속도와 open/close spec을 사용한다. `CardStack`은 route key에 따른 상태를 유지하며 `current`, `next`, `previous` progress를 계산한다. 따라서 C가 들어올 때 B를 배경으로 움직이는 협조를 작성할 수 있다.[^34][^35]

```text
React Navigation JS stack
    |
    +-- route B / gesture value / current progress
    |                         / next progress from C
    |
    +-- route C / gesture value / current progress
    |
    +-- card style interpolation + route lifetime
```

확인한 Card 코드에는 open/close 값 변경이 중간에 보이는 점프를 만들지 않도록 일정 상태를 유지하는 처리도 있다. 즉 실제 navigator도 단순히 모든 상태를 즉시 뒤집는 것이 아니라 자기 표현에 맞는 규칙을 둔다. 이 구조는 route 단위의 전환 조정이며, B 안의 사진·가림판까지 자동으로 다른 효과와 연결하는 matcher는 별도로 필요하다.[^34]

#### native stack: 플랫폼이 소유하는 전환

`@react-navigation/native-stack`은 iOS의 `UINavigationController`, Android의 `Fragment`를 사용한다고 공식 문서가 설명한다. React 쪽 구현도 animation 및 gesture 옵션을 `ScreenStackItem`으로 전달한다. 익숙한 native push/pop과 gesture를 플랫폼에 맡길 수 있지만, customization은 공개된 플랫폼·wrapper의 범위에 영향을 받는다.[^36][^37]

따라서 native stack의 부드러운 Back 동작을 보고 “내가 만든 모든 Reanimated child animation이 route 취소와 함께 velocity까지 인계된다”고 해석하면 안 된다. page navigation의 진행 상태와 custom child motion을 연결하는 것은 별도의 일이다.

#### 화면 사이의 같은 사진: Reanimated Shared Element Transitions

현재 4.x 문서의 shared-element 기능은 old/new top screen에서 같은 `sharedTransitionTag`를 찾고, 두 원본을 숨긴 상태에서 별도 전환 view를 움직인 뒤 복구하는 방식이다. iOS back gesture에는 progress 기반 취소 경로도 설명되어 있다. 동일 사진을 다른 화면 위치로 연결하는 문제는 실제로 다룬다.[^38]

그러나 확인 시점의 공식 문서는 이 기능을 feature flag 뒤의 experimental 기능으로 분류한다. native stack 위주이며, fully custom animation function은 지원하지 않고 duration·spring 설정을 제공한다. native modal 및 일부 progress 기반 property에도 제약이 명시되어 있다. 현재 C++ 코드에서도 snapshot pair, progress 적용, 완료·취소 시 전환 view 정리가 구분되어 있다.[^38][^39][^40]

**React Native 생태계에 대한 판단:** 단일 값 animation, route 전환, tag 기반 shared element에 필요한 구성 요소는 이미 있다. 하지만 그 중 하나를 설치하면 `drill -> zoom -> blind`의 모든 대상과 운동을 같은 계약으로 자동 인계한다고 볼 근거는 없다. 특히 4.6.0의 역방향 속도 처리처럼, 이름이 spring이어도 SSGOI가 선택하려는 UX 정책과 다를 수 있다.

## 3. 공통점과 차이

각 구현의 이름은 다르지만, 오래 살아 있는 것과 교체되는 것을 나눠 보면 구조가 드러난다. 아래 표는 앞 절의 코드를 종합한 해석이다.

| 시스템 | 계속 살아 있는 것 | 새 요청에서 바뀌는 것 | 연결 방법 |
|---|---|---|---|
| Holden의 게임 구현 | bone pose와 잔차 | clip/frame | 공통 pose 공간에서 inertialization |
| Godot | mixer와 target binding | 활성 animation과 weight | 채널별 합성, 상태 전이 정책 |
| Compose | value state, transition, content 목록 | target/spec/실행 | 현재값·속도 인계, content exit 관리 |
| Motion | value, projection node/stack, presence | 실행·layout target·lead | 값 retarget, snapshot 인계, exit 유지 |
| Flutter | controller, outgoing entries, route proxy, tag별 flight | target·route 전환 신호·manifest | tween 재시작, route 표현 합성, Hero divert |
| SwiftUI / UIKit | animatable attribute와 시스템이 관리하는 view | animation/transaction·navigation 의도 | merge, 내장 zoom의 연속 조작, 별도 lifecycle 처리 |
| React Native 생태계 | animated/shared value, keyed route, shared-transition snapshot | animation·route target·전환 view | 값 인계, card progress 협조, 플랫폼 전환과 tag 매칭 |

이들에서 가져올 수 있는 청사진은 **persistent presentation + replaceable motion + separate presence**다. 그러나 그 위의 연결 정책은 하나로 통일되어 있지 않다. 일반 interpolation의 현재값 재시작, spring의 상태 인계, residual correction, crossfade, 전이 대기가 모두 등장한다.

SSGOI는 현재의 integrator 기반을 활용해, 지원되는 geometry에서는 위치와 속도를 함께 인계하는 쪽을 기본으로 잡을 수 있다. 동시에 요소의 생성·제거와 콘텐츠 의미는 별도의 계약으로 관리해야 한다.

### 3.1 SSGOI가 원하는 수준을 어디까지 이미 제공하는가

비교 기준을 나눠야 한다. **같은 property의 목표 변경**, **정해진 page/shared-element 전환의 취소와 재지정**, **임의의 여러 효과를 가로지르는 모든 대상의 공통 인계**는 서로 다른 범위다. 아래 판단은 위에서 확인한 코드와 공개 계약에 한정한다.

| 구성 | 이미 처리하는 구체적인 장면 | SSGOI의 목표에 비춰 남는 부분 |
|---|---|---|
| Reanimated의 shared value / spring | 같은 x나 scale에 새 목표를 할당 | 4.6.0은 반대 방향 속도를 초기화. 여러 대상의 identity·수명은 별도 |
| React Navigation JS/native stack | route 진입·퇴장, gesture 취소, 이전/다음 card의 협조 | custom child effect 전체를 pose matcher로 통합하는 계약은 별도 |
| Reanimated shared elements | 동일 tag의 사진을 두 screen 사이에서 연결 | experimental, navigator·custom 표현 범위 제약. 임의 효과 조합과 다름 |
| Flutter implicit animation / AnimatedSwitcher | 현재값에서 target 변경, 여러 outgoing content 유지 | strict velocity 인계와 기존 outgoing entity의 재사용은 별도 |
| Flutter route delegation / Hero | 새 route가 이전 route의 outgoing을 지정, 같은 Hero flight 재지정 | 강한 조합 기능이지만 모든 child의 world-space velocity 보장은 아님 |
| SwiftUI spring / Apple 내장 zoom | 동일 animatable 속성 retarget, zoom 진행 중 재조작·되돌리기 | 지원된 속성·내장 전환에 강함. 임의 effect 조각의 자동 의미 매칭은 별도 |

**원하는 UX의 일부분은 이미 잘 구현되어 있다.** 특히 동일 대상 retarget, native gesture, Hero/zoom의 연속 조작은 새로운 문제가 아니다. SSGOI가 이들보다 무조건 더 자연스럽다고 주장할 근거도 없다.

다만 이 문서가 목표로 삼는 것은 그 능력을 **여러 built-in effect와 custom effect가 함께 사용하는 하나의 대상·운동·수명 계약**으로 제공하는 것이다. `drill -> zoom -> blind`에서 page, media, 가림판이 서로 다른 소유자로 넘어가더라도 효과 쌍마다 인계 로직을 작성하지 않게 만드는 범위다. 검토한 공개 기능 중 이 전체 범위를 그대로 보장하는 계약은 확인하지 못했다. 각 프레임워크 위에서 직접 구성할 수 없다는 뜻은 아니다.

### 3.2 한계 중 무엇이 구현 문제이고, 무엇이 의미의 문제인가

현재 위치를 새 시작값으로 쓰되 속도를 버리는 것은 연결 알고리즘의 선택이다. 필요하면 현재 velocity를 사용하는 solver나 잔차 보정으로 바꿀 수 있다. Reanimated의 방향별 velocity 정책처럼, 빠른 방향 반응을 중시할지 관성을 중시할지도 선택할 수 있다.

반면 사진 42와 사진 99가 같은 대상인지, 가로 가림판 10개와 세로 가림판 20개가 같은 조각들인지는 solver가 결정할 수 없다. source/destination을 ID로 연결하고, 일치하지 않는 요소의 release 의미를 효과가 선언해야 한다. 이것은 엔진이 덜 발전해서 생긴 제약이라기보다 표현의 의미를 어디에 둘 것인가의 문제다.

또한 view가 이미 제거되었거나 destination이 아직 만들어지지 않았다면 운동 데이터만으로 내용을 표시할 수 없다. 따라서 좋은 spring, 좋은 matcher, 좋은 view 생존 관리가 모두 필요하다. 하나의 API가 세 가지를 모두 담당할 수도 있지만, 설계에서는 책임을 구분하는 편이 이해하기 쉽다.

### 3.3 새로 얻은 설계 아이디어: 인계와 합성을 모두 공통 연산으로

Flutter의 delegated transition은 중요한 선택지를 보여 준다. **기존 진입 표현이 아직 유효하면 그것을 유지하고, 새 효과가 요구하는 outgoing 표현을 그 위에 합성**할 수 있다. 새 효과가 이 outgoing 표현을 한 번 제공하면 이전 효과마다 별도의 case를 작성할 필요가 없다.

SSGOI에서도 모든 교체에 한 가지 수학만 강제할 필요는 없다. 같은 운동계를 유지할 수 있으면 retarget하고, 새 경로로 바꿔야 하면 pose·velocity를 인계하고, 호환되는 표현들을 함께 유지하는 것이 의도라면 합성한다. 공통 실행기는 그 방법을 target과 채널의 계약에 따라 선택한다. **합성은 두 실행이 제각각 같은 style을 덮어쓰는 것과 다르며, 최종 출력의 소유자는 하나여야 한다.**

## 4. SSGOI의 Host, Scene, Plan

앞의 사례를 SSGOI에 적용하면, 전환이 교체되어도 계속 살아 있어야 하는 상태와 이번 전환에만 속하는 연출을 분리하는 구조가 나온다. 아래 명칭은 그 역할을 설명하기 위한 설계 제안이며, 다른 프레임워크가 모두 같은 이름의 클래스를 사용한다는 뜻은 아니다.

```text
Router / application
    |
    | latest navigation intent
    v
TransitionHost                         long-lived owner
    |
    +-- MotionScene                    current presentation state
    |     +-- page A
    |     +-- page B
    |     +-- shared media
    |     +-- temporary effects
    |
    +-- MotionPlan                     replaceable choreography
    |
    +-- Reconcile + Continuity         common handoff policy
    |
    +-- Renderer / view lifetime       display and resource ownership
```

**Host는 관리 주체, Scene은 그 주체가 관리하는 현재 상태, Plan은 이번 입력이 요구하는 연출**이다. 별도의 Host와 Scene이 서로 화면 소유권을 다투게 만들 필요는 없다. 처음에는 하나의 Host 내부에 scene registry와 reconcile 로직을 두어도 된다.

### 4.1 Host: 한 transition 영역의 관리 주체

Host는 새 탐색을 받고, 효과를 선택한 결과를 적용하며, 현재 motion을 누가 소유하는지 관리한다. 하나의 `<Ssgoi>` 영역 안에서 최신 의도와 실행 상태를 연결하는 책임을 갖는다. nested 영역은 자기 Host를 가질 수 있다.

현재 `HostAnimation`은 이미 오래 살아 있는 실행 관리 객체다. 다만 하나의 child animation을 붙이고, 다음 child가 오면 이전 pose를 읽고 `complete()`한 뒤 인계한다. 이를 **하나의 실행 슬롯을 교체하는 구조에서, 현재 대상들의 운동을 갱신하는 구조로 넓히는 것**이 핵심이다.[^16]

Host가 URL이나 router history까지 소유할 필요는 없다. 애플리케이션이 확정한 목적지와 방향을 입력받고, 시각적 전환을 관리한다. 물리적 정착과 탐색의 논리적 완료를 동일한 사건으로 취급하지 않는다.

### 4.2 Scene: 지금 보이는 것과 아직 버릴 수 없는 것

Scene은 앱 전체의 DOM을 복제한 거대한 가상 scene graph가 아니다. **transition에 참여하는 대상과 그 현재 표현 상태를 기록한 registry**면 충분하다. 처음에는 page surface, shared media, 임시 overlay 정도만 등록해도 된다.

```text
MotionScene
|
+-- page:B
|     +-- render handle
|     +-- current geometry + velocity
|     +-- base layout
|     +-- current motion owner
|
+-- media:photo42
|     +-- logical identity
|     +-- current presentation / flight
|
+-- effect:blind-group
      +-- parent / coordinate space
      +-- pieces and current motion
      +-- release behavior
```

element의 의미와 실제 DOM 참조는 구분한다. shared media는 DOM이 바뀌어도 같은 대상으로 연결할 수 있고, page는 같은 URL이어도 다른 방문 instance일 수 있다. 이 구분은 Flutter의 tag/flight와 Motion의 layoutId/NodeStack에서 얻을 수 있는 아이디어다.

Scene은 이번 `from/to`만 기록해서도 안 된다. A가 아직 퇴장 중인데 B에서 C로 넘어가면, 현재 화면에는 A·B·C가 함께 존재할 수 있다. 다음 입력은 직전 animation 두 개가 아니라 **현재 살아 있는 scene 전체**와 비교해야 한다.

### 4.3 Plan: 이번 효과가 앞으로 만들고 싶은 연출

효과는 이번 탐색에서 필요한 대상, 원하는 pose 또는 경로, 요소 사이의 의존 관계를 제공한다. 복잡한 정상 연출까지 최종 target 하나로 축소할 필요는 없다. zoom의 경로, blind의 가림/열림 단계, 여러 child의 sequence는 Plan에 남길 수 있다.

```text
Effect factory
    |
    | receives: from / to / layout / intent
    v
MotionPlan
    +-- participating surfaces and effects
    +-- desired paths / targets
    +-- local dependencies
    +-- release behavior of temporary nodes
```

Plan은 이전 효과가 무엇이었는지 몰라도 작성할 수 있어야 한다. `drill` 작성자는 “이 요소를 이 경로로 움직인다”를 정의한다. 기존 화면과 그 경로의 연결은 Host의 공통 continuity 단계가 담당한다.

### 4.4 Renderer와 presence: 화면 적용과 실제 생존

Renderer는 같은 target의 여러 채널을 하나의 결과로 합성하고, 그 결과를 web 또는 native에 적용한다. 두 effect가 같은 CSS `transform` 문자열을 독립적으로 쓰는 구조를 피할 수 있다. 이것은 Godot mixer에서 가져올 만한 핵심 원칙이다.

Presence는 어떤 실제 view를 아직 보존해야 하는지 결정한다. active destination, 퇴장 중인 page, shared flight가 참조하는 surface를 구분한다. 화면에서 사라진 자원은 정리하지만, 이전 실행의 cleanup이 새 owner의 대상을 제거해서는 안 된다.

SSGOI에는 이미 `runtime/presence.ts`에 route entry 보존·reconcile·settle 개념이 있고, 웹 context에도 outgoing DOM 수명 관리가 있다. 새 Scene이 이 기능을 모두 다시 구현하기보다 **기존 view 수명 계층과 motion 상태를 연결**하는 편이 좋다.[^17]

## 5. 조합별 규칙을 공통 연산으로 바꾸기

여기서 제안하는 매칭 알고리즘은 **현재 화면의 대상들과 새 Plan의 대상들을 대응시키고, 대상별로 어떤 운동을 이어받을지 결정하는 절차**다. ID 매칭은 대응 후보를 찾고, pose 호환성은 어떻게 이어 붙일지를 결정하며, 대상의 생존 여부는 인계와 퇴장을 구분한다. 이렇게 해야 단일 integrator의 상태 연속성이 실제 페이지 전환 전체의 연속성으로 연결된다.

### 5.1 매칭은 첫 단계이고, 다음 상태의 의미까지 알아야 한다

같은 ID를 찾으면 연결 후보가 생긴다. 그러나 새 effect의 animation 목록에 어떤 track이 없다는 이유만으로 그 element를 지워서는 안 된다. blind처럼 page를 움직이지 않고 가림판만 움직이는 효과도 있기 때문이다.

**원래 있어야 할 view와, 이번 효과가 추가로 움직이는 채널을 구분한다.** page의 기본 geometry는 layout에서 얻고, effect는 필요한 변화만 선언한다. 이 기본 표현이 있어야 사용이 끝난 채널을 어디로 돌려놓을지도 알 수 있다.

| 비교 결과 | 공통 연산 |
|---|---|
| 대상과 채널을 새 계획도 사용 | 현재 상태에서 새 목표/경로로 연결 |
| 대상은 남지만 이전 motion 채널은 사용하지 않음 | transition이 소유하던 채널을 기본 표현으로 복귀 |
| 대상 자체가 더 이상 필요 없음 | 퇴장 표현을 실행한 뒤 자원 해제 |
| 새 대상이 필요함 | 선언된 시작 표현 또는 대응하는 source에서 등장 |

이 판단은 effect 이름이 아니라 **identity, target의 존재 여부, 채널의 소유권**을 사용한다. `blind -> zoom`과 `slide -> rotate`를 별도 case로 늘리는 대신, 각각의 대상이 위 네 가지 중 어디에 속하는지 판단한다.

### 5.2 연속성을 만드는 계산도 소수의 방법으로 제한한다

공통 연산이 선택된 뒤, 연결 계산은 대상의 지원 능력에 따라 정한다.

```text
Current target state
        |
        +-- same motion system --------> continue / retarget full state
        |
        +-- common presentation pose --> bridge into new motion
        |                                 using residual correction
        |
        +-- compatible contributions --> compose under one output owner
        |
        +-- no useful correspondence --> enter / release / visual fallback
```

같은 solver를 이어 쓸 수 있으면 전체 내부 state를 유지한다. 다른 효과라도 같은 presentation pose 공간을 제공하면 새 경로와의 차이를 잔차로 연결할 수 있다. 기존 표현을 새 표현과 함께 유지하는 것이 적절하면 하나의 출력 계층에서 합성한다. 대응이 없거나 표현 방식이 달라지면 퇴장/등장으로 처리한다.

이 선택은 `drill`, `zoom`, `blind`라는 이름을 몰라도 가능하다. 대신 지원되는 pose의 의미는 명확해야 한다. 현재 SSGOI의 `Pose`는 element에 연결된 scalar value와 velocity이므로, 서로 다른 style 함수의 화면 상태를 일반적으로 표현하기에는 부족하다. **효과 조합 규칙을 줄이는 대가는, 공통 pose 표현과 작성 계약을 갖추는 것**이다.[^18]

### 5.3 이전 animation을 어떻게 끝낼 것인가

이전 Plan의 미래 실행을 종료하는 것과, 이미 화면에 나온 요소를 제거하는 것을 분리한다.

```text
Old plan superseded
    |
    +-- not-yet-started steps ------> invalidated
    |
    +-- active, reused targets ----> transferred or adopted by new plan
    |
    +-- active, unused targets ----> release motion
    |
    +-- unreferenced resources ----> disposed
```

이 규칙이면 이전 blind의 아직 시작하지 않은 열림 단계가 뒤늦게 실행되지 않는다. 이미 보이는 가림판은 현재 상태에서 정리할 수 있다. 새 효과가 이어받은 B는 이전 Plan의 완료 callback 때문에 기본 자세로 덮이거나 제거되지 않는다.

합성을 선택한 경우에도 이전 Plan 전체를 무조건 살리는 것은 아니다. 새 Plan이 필요한 활성 motion만 명시적으로 이어받고, 그 motion과 자원의 소유권을 관리한다. “오래된 실행이 우연히 계속 돈다”와 “현재 계획이 기존 표현을 자신의 일부로 채택한다”를 구분한다.

Host의 `complete()` 하나에 모든 의미를 맡기기보다 **목표 도착, 다른 계획으로의 인계, 자원 해제**를 분리해야 하는 이유다. 이 구분은 효과의 개수가 늘어나도 바뀌지 않는다.

### 5.4 반복 interruption에도 같은 절차를 적용한다

```text
Input       A -> B          B -> C          C -> D
Plan        [ AB ]         [ BC ]         [ CD ]

Scene       A leaving      A releasing    ...
            B entering     B leaving      B releasing
                           C entering     C leaving
                                          D entering

Each update samples the current Scene, including ongoing corrections.
It does not replay the whole history of AB + BC + CD.
```

새 목표가 오면 그 순간의 최종 pose와 velocity를 읽는다. 이전 접합에서 남긴 잔차도 최종 출력의 일부이므로 함께 반영한다. 과거 animation들을 계속 보관해야 운동이 이어지는 것은 아니다.

실제 surface는 완전히 가려지거나 퇴장이 끝나고 더 이상 참조되지 않으면 해제한다. 최신 destination을 표현하는 의무와 오래된 surface를 계속 보존하는 의무는 별개다. Host는 시각적 보존량에 대한 공통 예산을 둘 수 있다.

## 6. blind로 확인하는 공통화의 경계

blind는 일반화가 충분한지 확인하는 좋은 예다. page 외의 임시 요소가 생기고, 덮기/열기 단계가 있으며, 다음 effect에는 같은 조각이 없을 수도 있기 때문이다. 현재 구현도 page 위에 가림판들을 만들고 두 phase의 `MultiAnimation`으로 구성한다.[^19]

### 6.1 효과가 선언할 것은 자기 조각의 의미다

blind가 알아야 할 정보는 다음 정도다.

```text
Blind plan
    |
    +-- participating page surfaces
    |
    +-- occlusion group
    |     +-- identity and piece layout
    |     +-- parent / coordinate space
    |     +-- normal covering / revealing motion
    |     +-- release state: no visible occlusion
    |
    +-- choreography dependencies
```

“다음이 zoom이면 이 코드, drill이면 저 코드”는 없다. 다음 효과가 동일한 occlusion group을 사용하면 연결하고, 사용하지 않으면 blind가 선언한 비가림 상태로 정리한다. release의 기본값을 공통 fade로 두고, blind는 자신의 열림 동작을 제공하는 것도 가능하다.

이 선언은 효과별로 한 번 필요하다. 임의의 `div`와 `transform`만 보고 엔진이 “이것은 콘텐츠를 가리는 판이므로 이렇게 사라져야 한다”는 의미까지 알아내는 구조를 목표로 하지 않는다.

### 6.2 같은 공통 연산에서 나오는 세 장면

**drill 도중 blind:** B surface는 계속 필요하지만 새 blind가 translation을 요구하지 않을 수 있다. B의 남은 이동은 현재 상태에서 기본 위치로 정리되고, 새 occlusion group이 등장한다. 이는 “대상 유지 + 이전 채널 복귀 + 새 대상 등장”의 조합이다.

**blind 도중 zoom:** B surface는 새 zoom 경로를 이어받는다. 기존 가림판은 새 계획에서 사용하지 않으므로 release한다. B의 zoom과 가림판의 정리가 잠시 공존하지만, 각각의 대상과 property writer는 구분된다.

**가로 10조각 blind 도중 세로 20조각 blind:** 같은 index가 같은 의미의 조각이라는 보장이 없다. compatible group이 아니면 기존 그룹 release와 새 그룹 enter를 적용한다. 조각을 실제로 재분할하며 morph하는 기능은 나중에 지원할 수 있지만, 기본 연결에 반드시 필요한 것은 아니다.

### 6.3 sequence는 효과 내부의 문법으로 남긴다

blind가 “충분히 덮은 뒤 다음 화면을 드러낸다”는 순서를 필요로 한다면, 그것은 해당 Plan의 의존 관계다. 모든 효과 조합에 대한 규칙이 아니다. Host는 현재 유효한 Plan의 의존 관계를 실행하고, 오래된 Plan의 미시작 단계는 버린다.

어떤 단계는 source/destination view가 준비되어야 하고, shared-element 연결은 대응하는 anchor가 있어야 한다. 이런 준비 조건도 공통 형태로 표현할 수 있다. 준비되지 않은 대상에 원래 연출을 억지로 실행하기보다, Host의 공통 대기·단순 전환 정책을 적용한다. 준비 여부 판단과 interruption의 수학을 분리하는 것이 중요하다.

## 7. 권한을 어디에 둘 것인가

다음은 권장하는 경계다. 역할을 처음부터 모두 별도의 클래스로 구현할 필요는 없다.

| 역할 | 결정하는 것 | 알 필요 없는 것 |
|---|---|---|
| Router / application | 목적지, 탐색 방향, 콘텐츠 준비 | pose 접합 알고리즘 |
| Effect / Plan | 정상 연출, 참여 대상, local 순서, 임시 요소 release | 이전 효과의 이름 |
| Host / reconciler | 현재 의도, identity 연결, 인계·복귀·등장·퇴장, 자원 소유권 | 각 효과 조합의 별도 시나리오 |
| Scene / motion state | 실제 살아 있는 대상과 현재 최종 표현 | route 선택 정책 |
| Pose / solver layer | 상태 재개, 공통 공간 연결, 잔차 감쇠 | blind인지 zoom인지 |
| Renderer / presence adapter | 최종 출력 적용, view 보존과 해제 | 다음 URL 선택 |

여기서 공통 실행기는 추상적인 “자연스러움 판단 AI”가 아니다. 효과가 제공한 표현 계약을 대상으로 정해진 연산을 수행한다. 좋은 기본 정책을 만들 수는 있지만, arbitrary CSS나 서로 다른 콘텐츠의 의미까지 자동으로 추론할 필요는 없다.

자연스러움의 보장도 나누는 것이 좋다. supported geometry에는 위치·속도 연속성을 목표로 한다. 대상이 생성·제거되는 경우에는 continuity보다 올바른 identity와 납득 가능한 등장·퇴장을 보장한다. opaque custom animation에는 명시된 fallback을 제공한다. 모든 종류의 변경을 동일한 pose matching 문제로 몰아넣지 않는다.

## 8. 현재 구조에서 시작하는 방법

### 8.1 Animation 반환 모델은 유지할 수 있다

현재 `animation(args) -> Animation`을 전부 없애야 하는 것은 아니다. 반환 객체가 자신의 target과 motion 정보를 노출하고, Host가 인계에 필요한 정보를 가져갈 수 있게 확장할 수 있다. `MultiAnimation`은 계속 정상 연출을 구성하는 도구가 될 수 있다.[^20]

다만 임의의 DOM/style 변경과 cleanup이 외부에 드러나지 않는 완전한 블랙박스라면, 공통 실행기가 소유권과 pose를 안정적으로 다루기 어렵다. built-in effect부터 공통 target/pose/lifetime 계약에 참여시키고, 기존 custom animation은 기존 경로를 유지하는 점진적인 접근이 적절하다.

처음부터 모든 효과를 완전히 data-only graph로 다시 쓰거나, 웹 렌더러를 전부 frame loop로 바꿀 필요도 없다. Plan과 Scene의 수명을 분리하는 일은 WAAPI bake 방식을 유지하면서 시작할 수 있다.

### 8.2 작은 구현으로 검증할 세 가지 가설

| 순서 | 장면 | 검증하려는 아키텍처 |
|---|---|---|
| 1 | slide로 A/B를 반복해서 되돌리기 | 실행을 바꿔도 같은 대상의 운동 상태가 유지되는가 |
| 2 | drill 도중 zoom으로 C 열기 | 서로 다른 효과가 같은 presentation 계약으로 연결되는가 |
| 3 | blind 도중 다른 효과로 교체 | 임시 요소·미시작 phase·기존 page의 수명이 분리되는가 |

이 세 가지는 모든 시나리오를 미리 구현하려는 테스트 목록이 아니다. 각각 **상태 수명, 표현 호환성, 대상 수명**이라는 서로 다른 기반을 확인한다. 효과 이름을 조건문에 추가하지 않고 세 장면을 처리할 수 있는지 보는 것이 중요하다.

### 8.3 먼저 합의할 설계 선택

첫째, **현재 상태의 주인은 Host가 관리하는 Scene**으로 둔다. animation 객체는 해당 state를 움직이는 실행 또는 계획이지, 대상을 지울 수 있는 유일한 소유자가 아니다.

둘째, **초기 공통 표현의 범위를 좁힌다.** page surface, shared media, occlusion/overlay와 이들의 2D geometry부터 시작하면 의미가 명확하다. 모든 CSS property를 처음부터 통합하는 것은 목표가 아니다.

셋째, **기본 연결은 공통이고 release 의미는 local하게 선언한다.** 효과별로 한 번 작성하는 자기 수명 규약은 필요하지만, 이전·다음 효과의 모든 조합을 작성하지 않는다.

넷째, **검색보다 지속적인 상태 소유를 먼저 구현한다.** ID 기반 target 연결과 공통 pose 인계가 작동한 뒤, 더 좋은 시작 phase를 고르는 timeline 검색을 선택적으로 추가한다. 게임 Motion Matching 전체를 가져오는 것보다 먼저 해야 할 일이다.

이 방향에서 SSGOI의 핵심 단위는 “전환 하나”에서 “여러 전환을 거치며 계속 움직이는 대상”으로 확장된다. 효과 작성자는 자기 연출에 집중하고, Host는 입력이 연속해서 바뀌는 상황을 일관되게 관리한다.

## 9. 코드 근거를 읽는 순서와 범위

직접 코드를 따라갈 때는 다음 묶음이 특히 유용하다.

1. **상태 인계:** Compose `Animatable.animateTo/runAnimation`과 `Transition.updateAnimation`. 오래 살아 있는 값 holder와 교체되는 실행이 어떻게 연결되는지 본다.
2. **같은 대상의 지속:** Flutter `HeroController._flights`와 `_HeroFlight.divert`. route가 바뀌어도 같은 flight를 찾아 재지정하는 구조를 본다.
3. **범용 접합과 합성:** Holden의 `inertialize_pose_transition/update`, Godot의 `_blend_init/process/apply`. 효과 선택과 출력 접합·적용을 분리하는 구조를 본다.
4. **다른 page 효과의 협조:** Flutter `ModalRoute._buildFlexibleTransitions`와 공식 flexible route transitions 예제. incoming 효과가 이전 page의 outgoing을 제공하는 구조를 본다.
5. **모바일의 실제 보장 범위:** Reanimated `valueSetter/withSpring.onStart`, React Navigation `Card/CardStack`. 이전 실행의 상태를 전달하는 것과 최종적으로 어떤 속도 정책을 적용하는지를 구분한다.

Motion의 value/projection/presence 세 경로는 위 역할을 하나의 라이브러리 안에서 어떻게 분리하는지 비교하는 데 적합하다. 특히 일반 값의 velocity 전달과 layout progress의 재시작을 구분해서 읽어야 한다.

확인일은 2026-09-12다. 외부 코드는 여덟 공개 저장소의 28개 소스·예제 파일을 특정 commit으로 고정해 확인했다. Flutter는 stable branch의 snapshot이고, AndroidX·Motion·Godot·React Native·React Navigation 및 Reanimated의 일부 경로는 개발 branch의 snapshot이다. Reanimated의 역방향 velocity 초기화는 별도로 배포 tag 4.6.0에서도 확인했다. snapshot의 내부 구현을 모든 배포 버전·플랫폼의 보장으로 일반화하지 않는다. Holden의 저장소는 알고리즘 원 저자의 공개 reference 구현이다.

SwiftUI와 Apple의 내장 zoom은 공식 설명의 공개 계약과 사례를 참고했으며 내부 엔진 소스를 검토했다고 주장하지 않는다. Reanimated shared-element의 지원 범위는 확인 시점의 4.x 문서 기준이다. 이 문서는 코드 독해에 기반한 구조 비교와 설계 제안이다. 각 프로젝트를 빌드해 모든 interruption을 재현한 비교 벤치마크는 아니다.

## 10. 출처

각 주석은 확인한 소스의 commit과 주요 시작 행으로 연결된다. 본문의 SSGOI 청사진, 역할 분리 및 기본 정책은 이 소스들을 바탕으로 한 설계 제안이다.

[^1]: Daniel Holden. [controller.cpp](https://github.com/orangeduck/Motion-Matching/blob/57b7250e0d34a4e456a34d47e24c2f05fdcc711e/controller.cpp#L1279). 현재/출력 pose, bone offsets; 인계 340행, 검색과 전환 1702행, 업데이트 1793행. 코드 snapshot `57b7250e0d34`, commit 2025-02-06.

[^2]: Daniel Holden. [spring.h](https://github.com/orangeduck/Motion-Matching/blob/57b7250e0d34a4e456a34d47e24c2f05fdcc711e/spring.h#L162). inertialize_transition / inertialize_update. 코드 snapshot `57b7250e0d34`, commit 2025-02-06.

[^3]: Godot Engine contributors. [scene/animation/animation_mixer.cpp](https://github.com/godotengine/godot/blob/c24bf5d933c53d9477d5e82c51403856a9e7da62/scene/animation/animation_mixer.cpp#L1026). target cache 699행, _blend_init 1071행, _blend_process 1234행, _blend_apply 1913행. 코드 snapshot `c24bf5d933c5`, commit 2026-09-11.

[^4]: Godot Engine contributors. [scene/animation/animation_node_state_machine.cpp](https://github.com/godotengine/godot/blob/c24bf5d933c53d9477d5e82c51403856a9e7da62/scene/animation/animation_node_state_machine.cpp#L851). current/fading_from 평가; _can_transition_to_next 1015행. 코드 snapshot `c24bf5d933c5`, commit 2026-09-11.

[^5]: AndroidX / Google. [compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/Animatable.kt](https://github.com/androidx/androidx/blob/e8cac06846dd0164454bd44b77ed1c4e95ec7591/compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/Animatable.kt#L227). animateTo; internalState 73행, runAnimation 291행. 코드 snapshot `e8cac06846dd`, commit 2026-09-12.

[^6]: AndroidX / Google. [compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/Transition.kt](https://github.com/androidx/androidx/blob/e8cac06846dd0164454bd44b77ed1c4e95ec7591/compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/Transition.kt#L1629). updateAnimation; interruption spec 선택 1645행, updateTargetValue 1730행. 코드 snapshot `e8cac06846dd`, commit 2026-09-12.

[^7]: AndroidX / Google. [compose/animation/animation/src/commonMain/kotlin/androidx/compose/animation/AnimatedContent.kt](https://github.com/androidx/androidx/blob/e8cac06846dd0164454bd44b77ed1c4e95ec7591/compose/animation/animation/src/commonMain/kotlin/androidx/compose/animation/AnimatedContent.kt#L1079). currentlyVisible/contentKey; exit와 dispose 1241행. 코드 snapshot `e8cac06846dd`, commit 2026-09-12.

[^8]: Motion contributors. [packages/motion-dom/src/value/index.ts](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/motion-dom/src/value/index.ts#L447). MotionValue.getVelocity / start / stop. 코드 snapshot `372846e89d05`, commit 2026-09-11.

[^9]: Motion contributors. [packages/motion-dom/src/animation/interfaces/motion-value.ts](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/motion-dom/src/animation/interfaces/motion-value.ts#L23). animateMotionValue의 animation options와 velocity 전달. 코드 snapshot `372846e89d05`, commit 2026-09-11.

[^10]: Motion contributors. [packages/motion-dom/src/projection/node/create-projection-node.ts](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/motion-dom/src/projection/node/create-projection-node.ts#L1589). setAnimationOrigin; startAnimation 1716행, velocity 초기화 1743행. 코드 snapshot `372846e89d05`, commit 2026-09-11.

[^11]: Motion contributors. [packages/motion-dom/src/projection/shared/stack.ts](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/motion-dom/src/projection/shared/stack.ts#L45). NodeStack.promote: lead, resumeFrom, snapshot. 코드 snapshot `372846e89d05`, commit 2026-09-11.

[^12]: Motion contributors. [packages/framer-motion/src/components/AnimatePresence/index.tsx](https://github.com/motiondivision/motion/blob/372846e89d05cf7e12d1122bdf277c20afb11d5c/packages/framer-motion/src/components/AnimatePresence/index.tsx#L62). AnimatePresence: keyed children, exit 유지와 완료. 코드 snapshot `372846e89d05`, commit 2026-09-11.

[^13]: Flutter contributors. [packages/flutter/lib/src/widgets/heroes.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/widgets/heroes.dart#L741). _HeroFlight.divert; _flights 851행, 기존 flight lookup 1027행. 코드 snapshot `9584c6713b32`, commit 2026-09-10.

[^14]: Flutter contributors. [packages/flutter/lib/src/animation/animation_controller.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/animation/animation_controller.dart#L642). _animateToInternal; velocity 408행, animateWith 821행. 코드 snapshot `9584c6713b32`, commit 2026-09-10.

[^15]: Apple. [Explore SwiftUI animation](https://developer.apple.com/videos/play/wwdc2023/10156/). WWDC23, 2023. Animatable attribute와 model/presentation, CustomAnimation의 shouldMerge 및 velocity. 공개 설명 기준.

[^16]: SSGOI. [host-animation.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/animation/host-animation.ts:26). HostAnimation.attach. 코드 snapshot `f85c3d568ed4`.

[^17]: SSGOI. [presence.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/runtime/presence.ts:34), [create-ssgoi-transition-context.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/ssgoi-transition/create-ssgoi-transition-context.ts:261). Presence와 web transition의 view 수명 관리. 코드 snapshot `f85c3d568ed4`.

[^18]: SSGOI. [motion-state.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/runtime/motion-state.ts:1), [animation.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/runtime/animation.ts:3). Pose와 Animation의 인계 계약. 코드 snapshot `f85c3d568ed4`.

[^19]: SSGOI. [transition.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/transitions/blind/transition.ts:24). 가림판 생성과 두 phase의 composite. 코드 snapshot `f85c3d568ed4`.

[^20]: SSGOI. [index.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/types/index.ts:123), [multi-animation.ts](/Users/moon/work/오픈소스/ssgoi/packages/core/src/lib/animation/multi-animation.ts:31). TransitionConfig와 MultiAnimation. 코드 snapshot `f85c3d568ed4`.

[^21]: Apple. [Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/). WWDC23, 2023. Gesture 종료와 target 변경에서 현재 속도를 초기 조건으로 사용하는 spring의 연속성. Bezier와 경계 조건에 대한 일반적인 비교는 이 문서의 설명이다.

[^22]: flutter/flutter. [packages/flutter/lib/src/widgets/implicit_animations.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/widgets/implicit_animations.dart#L387). ImplicitlyAnimatedWidgetState.didUpdateWidget의 tween 시작값 갱신과 controller 재시작. 코드 snapshot `9584c6713b32`, commit 2026-09-10.

[^23]: flutter/flutter. [packages/flutter/lib/src/widgets/animated_switcher.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/widgets/animated_switcher.dart#L254). current/outgoing entry와 새로운 child의 등록. 코드 snapshot `9584c6713b32`, commit 2026-09-10.

[^24]: Flutter. [AnimatedSwitcher](https://api.flutter.dev/flutter/widgets/AnimatedSwitcher-class.html). 빠른 교체에서 여러 outgoing child 보존, outgoing child와 같은 key인 새 child의 관계. API 문서, 2026-09-12 확인.

[^25]: flutter/flutter. [packages/flutter/lib/src/widgets/routes.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/widgets/routes.dart#L422). secondaryAnimation 연결; delegatedTransition 1600행 이후, _buildFlexibleTransitions 1649행 이후. 코드 snapshot `9584c6713b32`, commit 2026-09-10.

[^26]: Flutter. [Flexible route transitions 공식 예제](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/examples/api/lib/widgets/routes/flexible_route_transitions.0.dart#L99), [ModalRoute.delegatedTransition](https://api.flutter.dev/flutter/widgets/ModalRoute/delegatedTransition.html). Material zoom, Cupertino slide, custom vertical 전환의 협조. 예제 snapshot `9584c6713b32`.

[^27]: Flutter. [TrainHoppingAnimation](https://api.flutter.dev/flutter/animation/TrainHoppingAnimation-class.html). 두 animation의 값이 교차할 때 구동원을 교체하는 계약. API 문서, 2026-09-12 확인.

[^28]: flutter/flutter. [packages/flutter/lib/src/cupertino/route.dart](https://github.com/flutter/flutter/blob/9584c6713b324636289d067944a46fd6b49df14b/packages/flutter/lib/src/cupertino/route.dart#L851). Cupertino back gesture의 dragEnd: release 방향 판단과 animateTo/animateBack. 코드 snapshot `9584c6713b32`, commit 2026-09-10.

[^29]: Apple. [Enhance your UI animations and transitions](https://developer.apple.com/videos/play/wwdc2024/10145/). WWDC24, 2024. 진행 중 조작 가능한 zoom, source 연결, push 중 pop 시 UIKit appearance lifecycle.

[^30]: Apple. [NavigationTransition.zoom(sourceID:in:)](https://developer.apple.com/documentation/SwiftUI/NavigationTransition/zoom%28sourceID%3Ain%3A%29). source ID와 namespace를 이용하는 내장 zoom. API 문서, 2026-09-12 확인.

[^31]: software-mansion/react-native-reanimated. [packages/react-native-reanimated/src/valueSetter.ts](https://github.com/software-mansion/react-native-reanimated/blob/5336bb7f4c41ae19d03b17c991b5675aa483d4bf/packages/react-native-reanimated/src/valueSetter.ts#L9). 이전 animation 취소와 새 onStart로 previousAnimation 전달. 코드 snapshot `5336bb7f4c41`, commit 2026-09-11.

[^32]: Software Mansion. [withSpring, 배포 tag 4.6.0의 소스](https://github.com/software-mansion/react-native-reanimated/blob/8651062064b518dac61bed9740110a645d65e757/packages/react-native-reanimated/src/animation/spring/spring.ts#L159). onStart에서 이전 velocity를 받은 뒤 새 목표와 반대 방향이면 0으로 만드는 조건은 189행 이후. [4.6.0 release](https://github.com/software-mansion/react-native-reanimated/releases/tag/4.6.0), 2026-08-21. 코드 snapshot `8651062064b5`.

[^33]: facebook/react-native. [packages/react-native/Libraries/Animated/animations/SpringAnimation.js](https://github.com/facebook/react-native/blob/e0224fd40b673ad2143c8c395c20d23a115e0801/packages/react-native/Libraries/Animated/animations/SpringAnimation.js#L202). SpringAnimation.start의 이전 spring 내부 상태 인계. 코드 snapshot `e0224fd40b67`, commit 2026-09-11.

[^34]: react-navigation/react-navigation. [packages/stack/src/views/Stack/Card.tsx](https://github.com/react-navigation/react-navigation/blob/6db6331ceda72a3e51aecbfa1f04371ecaf62907/packages/stack/src/views/Stack/Card.tsx#L190). gesture 값을 움직이는 animate, open/close spec, stale callback 및 closing 상태 처리. 코드 snapshot `6db6331ceda7`, commit 2026-09-12.

[^35]: react-navigation/react-navigation. [packages/stack/src/views/Stack/CardStack.tsx](https://github.com/react-navigation/react-navigation/blob/6db6331ceda72a3e51aecbfa1f04371ecaf62907/packages/stack/src/views/Stack/CardStack.tsx#L517). current/next/previous progress; route와 gesture 상태 연결. 코드 snapshot `6db6331ceda7`, commit 2026-09-12.

[^36]: React Navigation. [Native Stack Navigator](https://reactnavigation.org/docs/native-stack-navigator/). iOS UINavigationController / Android Fragment 사용과 native customization 제약. 공식 문서, 2026-09-12 확인.

[^37]: react-navigation/react-navigation. [packages/native-stack/src/views/NativeStackView.native.tsx](https://github.com/react-navigation/react-navigation/blob/6db6331ceda72a3e51aecbfa1f04371ecaf62907/packages/native-stack/src/views/NativeStackView.native.tsx#L397). ScreenStackItem으로 stackAnimation과 gesture 옵션 전달. 코드 snapshot `6db6331ceda7`, commit 2026-09-12.

[^38]: Software Mansion. [Reanimated Shared Element Transitions](https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview/). 4.x 문서. Tag 매칭, 별도 전환 view, iOS progress 기반 취소, experimental 상태와 custom animation 제약. 2026-09-12 확인.

[^39]: React Navigation. [Animating elements between screens](https://reactnavigation.org/docs/shared-element-transitions/). Native stack 중심의 지원 범위, Reanimated 4 feature flag 및 custom/property/modal 제약. 2026-09-12 확인.

[^40]: software-mansion/react-native-reanimated. [packages/react-native-reanimated/Common/cpp/reanimated/LayoutAnimations/SharedTransitions.cpp](https://github.com/software-mansion/react-native-reanimated/blob/5336bb7f4c41ae19d03b17c991b5675aa483d4bf/packages/react-native-reanimated/Common/cpp/reanimated/LayoutAnimations/SharedTransitions.cpp#L114). 실험적 shared transition의 snapshot/progress 처리 및 END/CANCELLED 정리. 코드 snapshot `5336bb7f4c41`, commit 2026-09-11.
