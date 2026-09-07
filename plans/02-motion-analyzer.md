# Plan 2 — Motion Analyzer (녹화 영상 → 타임라인 → ssgoi 물리값)

브랜치: `feat/motion-theme-and-video-analyzer` (latest `9774ea0`에서 분기).
구현 착수 시 `feat/motion-analyzer`로 분리 권장. Plan 1과 병행 가능하되, 최종 출력
형식(`spring()`, 테마 조각)은 Plan 1 §4.1 완료 후 붙인다.

## 0. 한 줄 요약

앱 트랜지션 녹화(.mov/.mp4)를 **브라우저 안에서** 프레임 단위로 디코드 → 나가는/들어오는
레이어를 각각 추적해 `progress(t)` 곡선을 뽑고 → ssgoi의 **실제 적분기**로 곡선을 피팅해
`PhysicsOptions` + `overlap`(두 페이지의 상대 타이밍)을 코드로 내보낸다. 그래프와 원본
프레임을 나란히 스크럽하며 눈으로 확인한다. 업로드 없음, 전부 로컬.

## 1. "브라우저로 영상 분석이 되나?" → 된다

| 요소 | 결론 | 근거 |
| --- | --- | --- |
| 프레임 정확 디코드 | WebCodecs `VideoDecoder` | Chrome 94+, Firefox 130+(데스크톱), Safari 16.4+(video), Safari 26 완전 지원 |
| 컨테이너 파싱 | `mediabunny` (순수 TS, tree-shakable) | MP4 / MOV(QuickTime) / WebM / MKV 읽기, `CanvasSink`가 타임스탬프 기반 프레임 반복자 + 모바일 녹화 회전 처리 |
| iPhone 녹화 코덱 | 기본 **HEVC** | Chrome(macOS) 107+ 하드웨어 HEVC 디코드 OK, Safari OK, **Firefox ✗** |
| 폴백 | `<video>` + `requestVideoFrameCallback` 프레임 스텝 | `mediaTime`으로 프레임 식별. Safari는 seek 정확도가 3~6프레임 단위로 떨어짐 → 정확도 경고 표시. 최후 폴백은 "H.264로 변환하세요" 안내 |
| 성능 | 문제 없음 | 트랜지션 구간(≈0.3~1s, 60fps ≈ 60프레임)만 디코드. 추적은 480px 폭 그레이스케일 Float32로 ms 단위 |

즉 Chrome 데스크톱을 1순위로 지원하면 iPhone/Android 녹화 모두 그대로 던져 넣을 수 있다.
별도 프로그램(ffmpeg 파이프라인)은 필요 없고, 분석 코어를 순수 TS로 만들어 두면 나중에
Node CLI로도 그대로 돌릴 수 있다(§5).

## 2. 피팅이 되나? → 60fps면 정확히, 30fps면 "곡선은 같지만 파라미터는 여럿"

ssgoi의 semi-implicit Euler 스텝(`spring-integrator.ts`와 동일 식)을 60fps로 돌려 만든
곡선에 노이즈(σ 0.01)를 얹고 30/60fps로 리샘플한 뒤, Nelder–Mead로 되찾은 결과
(`scratchpad/fit-check.mjs`):

| 정답 | 샘플 | 최적 모델 | 되찾은 값 | RMSE |
| --- | --- | --- | --- | ---: |
| spring 400/30 | 60fps (41점) | spring | **403 / 30.0** | 0.0104 |
| spring 400/30 | 30fps (18점) | double | 735 / 39.5 ×1.00 (동일 곡선) | 0.0095 |
| double 400/30 ×1.2 | 60fps (42점) | double | 461 / 30.3 ×0.93 | 0.0104 |
| double 400/30 ×1.2 | 30fps (20점) | double | 177 / 20 ×4.0 (동일 곡선) | 0.0093 |
| inertia 150/1.5 | 60fps (38점) | inertia | 144 / 1.21 | 0.0104 |
| inertia 150/1.5 | 30fps (16점) | inertia | **151 / 1.45** | 0.0095 |

해석과 설계 반영:

1. RMSE가 노이즈 바닥(0.01)까지 내려가므로 **곡선 재현은 항상 된다**. 목적이 "저 앱처럼
   보이게"라면 30fps로도 충분하다.
2. 30fps에서는 spring/double/t0 조합이 서로 구분되지 않는다(식별성 문제). 따라서
   - 모델 선택은 RMSE만이 아니라 **간결성 우선**(파라미터 수 적은 모델이 RMSE 5~10% 이내면 채택).
   - `doubleSpring` 비율은 [0.5, 2]로 제한, `t0`는 [−1프레임, +3프레임]로 제한.
   - 한 레이어의 모든 속성(translate·opacity·scale)은 ssgoi에서 **하나의 `t`**로 구동되므로
     **속성 공동 피팅**으로 샘플 수를 늘린다.
   - **duration/bounce 제약 피팅** 모드: Plan 1 `spring()`의 2-파라미터 공간에서만 피팅.
     식별성이 좋고 출력이 바로 리프 적분기가 된다.
   - UI에 "동등한 대안 모델" 배지와 잔차 그래프를 항상 표시.
3. 60fps 녹화 권장을 문서에 명시 (최근 iPhone 화면 녹화는 60fps).

## 2.5 무엇이 식별되고, 무엇이 안 되나 (레이어 분해)

질문: 화면이 넘어갈 때 요소들이 제각각 움직이는데 그걸 다 식별할 수 있나?

**전부 자동으로는 안 된다. 하지만 전부 식별할 필요가 없다.** 분석기의 목표는 "화면에서
움직인 모든 것"이 아니라 **ssgoi가 표현할 수 있는 어휘**로 분해하는 것이다. 그 어휘는
Plan 1의 트랙과 같다: `page/out`, `page/in`, `shared`, `overlay` — 각각 2D 강체 레이어이고
translate · scale · opacity(· blur)만 변한다. 이 4개 레이어 밖에서 따로 움직이는 요소
(헤더 파랄랙스, 리스트 아이템 스태거, 내비바 타이틀 크로스페이드)는 ssgoi 프리셋으로
재현이 안 되므로, 분석기의 역할은 **피팅이 아니라 검출·보고**다. 그래서 문제가 "일반
레이어 분할"(어려움)에서 "고정된 모델에 프레임을 맞추기"(가능)로 바뀐다.

### 자동 1차 분해 (클릭 없이)

1. **정적 크롬 마스크**: 시작·끝 프레임에서 같고 구간 내내 분산이 낮은 픽셀 → 상태바,
   탭바, 고정 헤더. 제외.
2. **특징점**: 시작 프레임과 끝 프레임 각각에서 코너 검출(Shi–Tomasi식 그레이디언트).
   두 집합을 따로 유지한다.
3. **추적**: 시작 프레임 특징점은 앞으로, 끝 프레임 특징점은 뒤로 NCC 추적. 상관 피크가
   임계 아래로 떨어지면 "사라짐"으로 기록.
4. **in/out 판정 = 존재 시점**: 시작에 있다가 사라지는 특징점 → `out` 후보. 끝에 있고
   늦게 나타나는 특징점 → `in` 후보. 처음부터 끝까지 같은 모습으로 살아 있는 특징점 →
   정적(안 움직임) 또는 `shared`(움직임). 이 규칙이 in과 out을 가르는 1차 근거다.
5. **궤적 군집화**: 각 특징점 궤적을 정규화(변위/총변위)하고 출현·소멸 시점과 함께
   군집. 가장 큰 `out` 군집 = out 페이지, 가장 큰 `in` 군집 = in 페이지. 군집에 안 들어가는
   궤적 = "독립 요소" 목록.
6. **리드 레이어**: 공간 이동이 가장 큰 레이어. 나타나는 중이면 `in` 노드, 사라지는 중이면
   `out` 노드가 리드 (Plan 1 §3.2 표의 방향별 리드와 같은 정의). 방향 태그와 합쳐 drill의
   forward=in 리드, backward=out 리드 같은 규칙을 검증하는 데도 쓴다.
7. **opacity**: 레이어 영역에서 시작·끝 프레임을 두 끝점으로 하는 최소제곱 alpha.
8. 결과를 프레임 위에 색깔별 궤적으로 겹쳐 보여 주고, 사용자는 군집을 재배정하거나
   ("이건 헤더, 무시") ROI를 직접 그려 보정한다. 목표는 보정 2클릭 이내.

### 자동으로 어려운 경우와 대응

| 상황 | 왜 어려운가 | 대응 |
| --- | --- | --- |
| 흰 배경끼리의 탭 전환(Kakao류) | 특징점이 텍스트 블록뿐, 페이지 경계가 안 보임 | 텍스트 블록 군집으로 충분. 부족하면 행/열 투영(1D)으로 배경색 경계 추적 |
| 두 레이어가 같은 자리에서 동시에 이동+크로스페이드 | 위치와 alpha가 결합되어 애매 | 위치 먼저 고정 후 alpha 추정, opacity 가중치 하향, 경고 표시 |
| 요소별 스태거·파랄랙스 | 페이지와 다른 곡선 | 독립 트랙으로 보고, "프리셋 X로 재현 불가 / 요소 Y는 `hero()` 후보" 판정 |
| 8px 같은 미세 이동 | 480px 분석 폭에서 3px | 미세 이동 감지 시 원본 해상도로 재추적. 이동량 자체도 출력(기하 제안: 8px vs 30px) |
| 스크롤 중이거나 재생 중인 콘텐츠 | 비강체 | NCC 신뢰도 하락 → 해당 영역 제외 권고 |
| blur / backdrop | 픽셀 모델 없음 | Laplacian 분산비로 근사, v2 |
| 3D·원근·회전 | 모델 밖 | 미지원 명시 |

### 검증 기준

iOS 푸시, Material shared-axis, Kakao 탭 녹화 3종에서 자동 1차 분해가 추적 특징점의
90% 이상을 올바른 레이어에 배정하고, 사람 보정이 2클릭 이내면 합격. 이 수치는 M2 완료
기준에 포함한다.

## 3. 파이프라인

```
파일 → [1 디코드] → [2 구간 검출] → [3 레이어/ROI 지정] → [4 추적] → [5 정규화 곡선]
     → [6 피팅·모델선택] → [7 시각화·비교] → [8 내보내기]
```

### 3.1 디코드 (`ingest/`)

- `mediabunny`: `new Input({ source: new BlobSource(file) })` → video track →
  `new CanvasSink(track, { width: 480, rotation, poolSize: 4 })`.
- 첫 패스: 전체를 8fps 정도로 성기게 훑어 썸네일 필름스트립 + 모션 에너지(§3.2) 생성.
- 둘째 패스: 사용자가 고른 `[start−200ms, end+200ms]` 구간만 `canvases(start, end)`로 전 프레임
  디코드. 각 프레임을 `{ tMs, gray: Float32Array, rgba?: ImageData }`로 보관, VideoFrame은 즉시 close.
- 타임스탬프는 **항상 실제 `timestamp`** 사용(VFR 녹화 대비). 프레임 인덱스로 시간을 만들지 않는다.
- 폴백 경로(`<video>` + rVFC 스텝)는 같은 프레임 인터페이스를 구현.

### 3.2 구간 검출 (`segment/`)

- 모션 에너지 `E(i) = mean(|gray_i − gray_{i−1}|)` 타임라인을 필름스트립 아래에 그림.
- 임계값 넘는 연속 구간을 자동 제안, 사용자가 ←/→ 프레임 스텝으로 시작(움직임 직전 프레임)과
  끝(정지 첫 프레임)을 확정.

### 3.3 레이어와 ROI (`roi/`)

- §2.5의 자동 1차 분해가 먼저 돌고, 그 결과(레이어별 특징점 군집)가 기본 ROI가 된다.
- 사용자는 군집 재배정 또는 수동 ROI로 보정한다. 수동 ROI 규칙: **in 레이어는 끝 프레임에서,
  out 레이어는 시작 프레임에서** 지정. 레이어당 1~3개.
- 레이어 라벨은 Plan 1의 노드 어휘를 그대로 쓴다: `in`, `out`, `shared`(+팔로워 `overlay`).
  녹화 하나는 한 방향이므로 사용자가 `forward`/`backward`를 태그하고, 왕복을 녹화했으면
  구간 검출이 두 구간으로 나눠 각각 태그한다. 출력이 곧 `motion` 트리가 되도록.

### 3.4 추적 (`track/`)

- 위치: 그레이스케일 피라미드(1/4 → 1/2 → 1/1)에서 **NCC(정규화 상호상관)** 로 이전 위치
  주변 ±R px 탐색, 상관 피크에 포물선 보간으로 서브픽셀 정밀도. 출력 `x(t), y(t)`, 신뢰도(피크값).
- 스케일: 한 레이어에 ROI ≥ 2개면 ROI 간 거리비로 `scale(t)`; 3개면 similarity 변환 최소제곱.
- 불투명도: ROI 내부에서 `F = (1−a)·BG + a·FG`를 최소제곱으로 풀어 `a(t)` (닫힌 해).
  `FG` = 해당 레이어의 기준 프레임 내용, `BG` = 반대 레이어의 같은 위치 내용.
  이동+페이드가 섞인 경우 위치를 먼저 추적한 뒤 그 위치에서 `a`를 추정.
- 이동이 없는 페이드 전용 레이어는 추적을 건너뛰고 `a(t)`만 계산.
- 블러(sheet blur 류)는 v2: Laplacian 분산비.

### 3.5 정규화 (`curve/`)

- 각 속성을 시작값→끝값 기준 `p(t) ∈ [0,1]`로 정규화, 오버슈트는 1 초과 허용.
- 레이어별 속성들을 하나의 `t(t)`로 병합(공동 피팅 입력).
- 이 단계 결과가 사용자가 말한 "타임라인별 진행률" 표/그래프.

### 3.6 피팅·모델 선택 (`fit/`)

- 후보: `spring(k, c)`, `doubleSpring(k, c, ratio)`, `inertia(a, r)`. 각 모델을 ssgoi 적분기
  스텝으로 60fps 시뮬레이션(`WebAnimation.simulate`와 동일) 후 샘플 시각에 선형 보간.
- 최적화: Nelder–Mead(`fmin` 패키지 또는 ~60 LOC 자체 구현), 파라미터는 log-space,
  3회 멀티스타트, 손실 = 레이어 공동 RMSE, 추가 자유변수 `t0`(레이어 시작 오프셋).
- 선택: §2의 간결성 규칙. 결과마다 `describeSpring()`으로 duration/bounce, settle ms 표기.
- 합성 타이밍: `Δ = t0(in) − t0(out)`. out 피팅 곡선에서 `Δ` 시각의 진행률을 읽으면 그게
  Plan 1의 `startAt`이다(진행률 기준이라 적분기와 독립). in이 out 정착 후 시작하면 `1`.
  film처럼 스테이지가 셋이면 경계마다 구해 `{ shared, in }`으로 낸다. 함께 Plan 1
  `schedule()`이 낸 각 `feel`/`type` 기본 간트와 비교해 가장 가까운 프리셋도 표시한다.
- 필요 core 변경: `@ssgoi/core/internal`에서 `SpringIntegrator`, `DoubleSpringIntegrator`,
  `InertiaIntegrator`, `IntegratorProvider`, `simulate()` export (현재 internal은 Animation
  클래스만 내보냄).

### 3.7 시각화·비교 (`ui/`)

- 상단: 필름스트립 + 스크러버(프레임 스텝, 배속).
- 중단: 레이어별 진행률 차트 — 샘플 점, 피팅 곡선, 잔차, 대안 모델 점선. out/in을 같은
  시간축에 겹쳐 상대 타이밍이 한눈에 보이게.
- 하단 좌: 원본 프레임 / 우: 같은 `t`의 합성 미리보기(두 사각형 패널을 피팅 물리로 움직이는
  간단한 목업). 스크럽 동기.
- 선택: 실제 ssgoi 트랜지션을 iframe으로 띄워 비교. docs에 이미 있는 showcase postMessage
  브리지(`use-showcase-frame-bridge.ts`: navigate/play/pause/rate)를 재사용해 0.25배속으로 재생.

### 3.8 내보내기 (`export/`)

- 코드 스니펫(복사 버튼) — Plan 1의 프리셋 `override` 옵션, 녹화한 방향 키로:
  ```ts
  axis({ type: "y" }, { override: {
    forward: (anim) => {
      anim.set("in", { integrator: spring({ duration: 0.31, bounce: 0.25 }) });
      anim.set("out", { integrator: easeIn({ duration: 0.12 }) });
      anim.startAt = [0, 0.3];
    },
  }})
  ```
  왕복을 분석했으면 `backward`도 채우고, 두 방향이 오차 안에서 같으면 함수 하나로 낸다.
- **가장 가까운 시맨틱 프리셋**: 피팅 곡선을 `smooth/snappy/bouncy/gentle/swift/accelerate` 곡선과
  RMSE로 비교해 "in ≈ `snappy` (오차 3%), out ≈ `accelerate` (오차 6%)"를 먼저 보여 준다.
  오차가 작으면 스니펫도 `anim.set("in", { integrator: snappy })`처럼 프리셋 이름으로 낸다. 이 비교 결과가
  Plan 1 §3.3 프리셋 표를 실측으로 보정하는 근거가 된다.
- 테마 조각: `{ "axis/y/non-directional": (anim) => { … } }` (Plan 1 §3.4 key 형식) — 분석한
  프리셋 key 아래로 내보내 `themes.ios` 표에 그대로 붙이거나, 라이브러리에 넣을 값이면 provider의
  feel 기본값으로 쓴다. 리드 레이어가 나타나면 `in`, 사라지면 `out`, 타일류는 `shared`.
- 프로젝트 파일(.json): ROI, 구간, 곡선, 피팅 결과. 다시 열어 이어서 작업.
- 원시 곡선 CSV.

## 4. 코드 배치

```
packages/motion-lab/            # private: true, 미배포. 순수 TS, DOM 비의존
  src/track/   ncc.ts pyramid.ts alpha.ts similarity.ts
  src/fit/     models.ts nelder-mead.ts select.ts describe.ts
  src/curve/   normalize.ts resample.ts
  src/segment/ energy.ts
  test/        synthetic.test.ts   # ImageData를 직접 생성해 추적·피팅 검증

apps/docs/src/app/tools/motion-analyzer/page.tsx   # 'use client', next/dynamic ssr:false
apps/docs/src/page/tools/motion-analyzer/           # ingest(mediabunny lazy import), ui
```

- 분석 코어를 별도 패키지로 두는 이유: (a) vitest로 합성 데이터 테스트, (b) 나중에 Node CLI
  (`ffmpeg -i rec.mov frames/%04d.png` → 같은 코어)로 그대로 재사용 = 사용자가 말한
  "안 되면 프로그램으로" 폴백을 공짜로 확보, (c) docs 번들에서 lazy load.
- docs 라우트는 `/tools/motion-analyzer`. nav에 "Tools" 그룹 신설(또는 Reference 하위).
  cacheComponents 환경이므로 페이지는 Suspense 아래 클라이언트 전용으로.
- 의존성 추가: `mediabunny`(docs), `fmin`(motion-lab, 선택).

## 5. 테스트 전략

1. **합성 단위 테스트**: 두 패널(out/in)을 알려진 ssgoi 물리로 움직인 ImageData 시퀀스를
   30/60fps로 생성 → 추적 → 피팅 → 허용 오차 내 복원 검증. 모션 블러·노이즈·JPEG 아티팩트를
   섞은 케이스 포함.
2. **폐루프 골든**: transition-lab을 `getDisplayMedia`/`MediaRecorder`로 녹화한 파일을
   분석기에 넣어 설정한 물리값이 다시 나오는지 확인. 분석기의 신뢰도를 사용자에게 증명하는
   데모이기도 하다.
3. 실제 앱 녹화 3종(iOS 푸시, Material shared-axis, KakaoTalk 탭)을 fixture로 두고 결과가
   Plan 1 스킴 초기값과 얼마나 다른지 기록 → 스킴 보정.

## 6. 마일스톤

| 단계 | 산출물 | 완료 기준 |
| --- | --- | --- |
| M0 | core internal export + `packages/motion-lab` 스캐폴드 + 합성 피팅 테스트 | §2 표를 vitest로 재현 |
| M1 | 디코드 + 필름스트립 + 모션 에너지 + 구간 지정 | iPhone HEVC .mov를 Chrome에서 열어 프레임 스텝 |
| M2 | 자동 레이어 분해(§2.5) + ROI 보정 + NCC 추적 + alpha 추정 + 진행률 차트 | 합성 테스트 통과, 3종 녹화에서 90% 배정·2클릭 보정 |
| M3 | 피팅·모델 선택·overlap 산출 + 잔차/대안 표시 | 폐루프 골든 통과 (오차 < 5%) |
| M4 | 나란히 비교(목업 + iframe 슬로모) + 내보내기(스니펫/스킴/json) | 스니펫을 transition-lab에 붙여 원본과 비교 가능 |
| M5 | 폴백(rVFC), 문서(`/docs/motion`에서 링크), 테마 보정 PR | Firefox 경고 경로 동작, `motion.ios` 실측값 반영 |

## 7. 리스크

- **HEVC on Firefox**: 폴백 안내로 처리. Chrome 권장 배너.
- **VFR/드롭 프레임**: 실제 타임스탬프 사용, 결측은 피팅에서 자연히 흡수.
- **ROI 품질**: 저대비·반복 패턴이면 NCC 피크가 흐릿 → 신뢰도 표시 + 다른 ROI 권유.
- **두 레이어가 겹치며 동시에 이동+페이드**: alpha 추정 오차 증가 → 이동 먼저, 페이드 나중.
  경고와 함께 opacity 곡선 가중치 하향.
- **식별성(§2)**: 간결성 규칙 + 테마 제약 피팅 + 60fps 권장.
- **디바이스 픽셀 스케일**: 곡선은 정규화되므로 px 단위와 무관. 단 `translate` 거리 자체
  (8px vs 30px 같은 기하)는 별도로 읽어 프리셋 옵션 제안에만 사용.

## 8. 출처

- WebCodecs 지원: https://caniuse.com/webcodecs , https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API
- mediabunny: https://mediabunny.dev/guide/introduction , sinks: https://mediabunny.dev/guide/media-sinks
- requestVideoFrameCallback: https://web.dev/articles/requestvideoframecallback-rvfc , Safari seek 정확도 이슈: https://github.com/video-dev/hls.js/issues/7583
- Chrome HEVC 디코드: https://github.com/StaZhu/enable-chromium-hevc-hardware-decoding , https://webcodecsfundamentals.org/codecs/hevc.html
- iPhone 녹화 HEVC 기본: https://support.apple.com/en-us/116944
- Nelder–Mead JS: https://github.com/benfred/fmin
- 감쇠 진동 피팅 일반론(LM): https://en.wikipedia.org/wiki/Levenberg%E2%80%93Marquardt_algorithm
