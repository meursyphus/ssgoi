/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SggoiTransition } from "../types";
// import { prepareOutgoing } from "../utils/prepare-outgoing";

export const film = (): SggoiTransition => {
  return {
    out: async (element, context) => {
      // 나가는 화면 애니메이션
      // 1. prepareOutgoing()으로 position: fixed 설정
      // 2. 컨테이너 크기 계산 (element.getBoundingClientRect())
      // 3. 검은 배경 표현을 위한 준비

      return {
        prepare: () => {
          // prepareOutgoing(element)
          // element에 검은 테두리/배경 추가
          // z-index 설정으로 레이어 관리
        },
        tick: (progress) => {
          // progress를 3단계로 매핑
          // Stage 1 (0 ~ 0.4): 축소하면서 위로 이동
          //   - scale: 1 → 0.7
          //   - translateY: 0 → -20%
          //   - 프레임 테두리 효과 (box-shadow 또는 outline)
          // Stage 2 (0.4 ~ 0.6): 화면 밖으로 완전히 이동
          //   - translateY: -20% → -120%
          //   - opacity: 1 → 0 (선택적)
          // Stage 3 (0.6 ~ 1.0): 나간 상태 유지
        },
      };
    },

    in: async (element, context) => {
      // 들어오는 화면 애니메이션
      // 1. 컨테이너 크기 계산
      // 2. 초기 위치 설정 (화면 아래, 작은 크기)

      return {
        prepare: () => {
          // 초기 상태 설정
          // transform-origin: center 또는 top
          // z-index로 레이어 순서 관리
        },
        tick: (progress) => {
          // progress를 3단계로 매핑
          // Stage 1 (0 ~ 0.4): 대기 (아직 안 보임)
          //   - translateY: 120% (화면 아래)
          //   - scale: 0.7
          //   - opacity: 0
          // Stage 2 (0.4 ~ 0.6): 프레임 간격 통과
          //   - 여전히 화면 밖
          //   - opacity: 0 → 1 준비
          // Stage 3 (0.6 ~ 1.0): 아래에서 올라오며 확대
          //   - translateY: 120% → 0
          //   - scale: 0.7 → 1
          //   - opacity: 1
          //   - 프레임에서 스크린으로 확대되는 느낌
        },
      };
    },
  };
};
