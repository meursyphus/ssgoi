import { ReactNode } from "react";
import { Messages } from "../messages/types";

// 중첩된 키를 점으로 연결하여 추출하는 유틸리티 타입
export type NestedKeyOf<TObj extends object> = {
  [Key in keyof TObj & (string | number)]: TObj[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<TObj[Key]>}`
    : `${Key}`;
}[keyof TObj & (string | number)];

// 중첩된 키 경로로 값의 타입을 추출하는 유틸리티 타입
export type NestedValueOf<
  TObj extends object,
  TPath extends string
> = TPath extends `${infer Key}.${infer Rest}`
  ? Key extends keyof TObj
    ? TObj[Key] extends object
      ? NestedValueOf<TObj[Key], Rest>
      : never
    : never
  : TPath extends keyof TObj
  ? TObj[TPath]
  : never;

// 주어진 키 경로로 객체에서 값을 가져오는 함수
export function getNestedValue(obj: any, path: string): any {
  const keys = path.split(".");
  let value = obj;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return undefined;
  }
  
  return value;
}

// ReactNode인지 확인하는 타입 가드
export function isReactNode(value: any): value is ReactNode {
  return (
    value !== null &&
    value !== undefined &&
    (typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      (typeof value === "object" && value.$$typeof))
  );
}