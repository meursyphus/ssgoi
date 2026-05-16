/**
 * 사용자에게 노출해도 되는 에러.
 * server action 안에서 이 클래스로 throw 한 메시지만 클라이언트에 그대로 전달된다.
 * 그 외 throw는 Next.js가 마스킹하여 일반 메시지로 대체된다.
 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}
