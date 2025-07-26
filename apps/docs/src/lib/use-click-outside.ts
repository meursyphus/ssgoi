import { useEffect, useRef, useCallback } from "react";

type OutsideClickCallback = () => void;

/**
 * 요소 외부 클릭을 감지하는 훅
 *
 * @returns 외부 클릭 감지 ref 생성 함수
 * @example
 * const onOutsideClick = useOutsideClick();
 *
 * <div ref={onOutsideClick(() => setIsOpen(false))}>
 *   메뉴 내용
 * </div>
 */
export const useOutsideClick = () => {
  // 현재 요소와 콜백을 저장
  const elementRef = useRef<HTMLElement | null>(null);
  const callbackRef = useRef<OutsideClickCallback>(() => {});

  // 전역 클릭 이벤트 핸들러 등록
  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const element = elementRef.current;
      if (!element) return;

      // 클릭된 요소가 등록된 요소 외부에 있는지 확인
      if (!element.contains(e.target as Node)) {
        callbackRef.current();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClick, { passive: true });
    document.addEventListener("touchstart", handleClick, { passive: true });

    // 클린업 함수
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  // stable한 ref 콜백
  const stableCallback = useCallback((element: HTMLElement | null) => {
    elementRef.current = element;

    if (!element) {
      return;
    }

    // 요소가 언마운트될 때 참조 제거
    return () => {
      elementRef.current = null;
    };
  }, []);

  // 콜백을 업데이트하고 stable ref를 반환하는 함수
  return (callback: OutsideClickCallback) => {
    callbackRef.current = callback;
    return stableCallback;
  };
};
