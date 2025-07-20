declare const global: any
const getGlobalContext = (): any => (typeof global !== undefined ? global : window);
const INSTANCE_SYMBOL = Symbol.for('__SSGOI_CONTEXT_INSTANCE__');

interface VSyncCallback {
	id: number;
	callback: () => void;
}

export class VSync {
	private isRunning = false;
	private callbacks: VSyncCallback[] = [];
	private reservedCallbacks: VSyncCallback[] = [];
	private requestAnimationFrameId: number | null = null;
	public referenceCount = 0;

	constructor() {
		this.isRunning = false;
		this.callbacks = [];
		this.reservedCallbacks = []; // callbacks that are waiting to be executed after the current frame
		this.requestAnimationFrameId = null;
	}

	static getInstance() {
		const globalContext = getGlobalContext();

		if (globalContext[INSTANCE_SYMBOL] === undefined) {
			globalContext[INSTANCE_SYMBOL] = new VSync();
		}

		globalContext[INSTANCE_SYMBOL].referenceCount++;

		return globalContext[INSTANCE_SYMBOL];
	}

	private destroy() {
		const globalContext = getGlobalContext();

		if (globalContext[INSTANCE_SYMBOL] !== undefined) {
			globalContext[INSTANCE_SYMBOL].referenceCount--;

			if (globalContext[INSTANCE_SYMBOL].referenceCount === 0) {
				globalContext[INSTANCE_SYMBOL] = undefined;
			}
		}
	}

	public request(callback: () => void) {
		if (!this.isRunning) {
			this.callbacks.push({ id: Date.now(), callback });
			this.run();
		} else {
			this.reservedCallbacks.push({ id: Date.now(), callback });
		}

		return this.referenceCount;
	}

	public cancel(id: number) {
		if (!this.isRunning) {
			this.callbacks = [...this.callbacks.filter((cb) => cb.id !== id)];
			if (this.callbacks.length === 0 && this.requestAnimationFrameId !== null) {
				cancelAnimationFrame(this.requestAnimationFrameId);
				this.requestAnimationFrameId = null;
				this.isRunning = false;
			}
		} else {
			this.reservedCallbacks = [...this.reservedCallbacks.filter((cb) => cb.id !== id)];
		}
	}

	public static requestAnimationFrame(callback: () => void): number {
		const id = VSync.getInstance().request(callback);
		return id;
	}

	public static cancelAnimationFrame(id: number): void {
		VSync.getInstance().cancel(id);
	}

	private run() {	
		if (this.requestAnimationFrameId === null && !this.isRunning && this.callbacks.length > 0) { 
			this.requestAnimationFrameId = requestAnimationFrame(() => {
				this.isRunning = true;
	
				// callbacks에 있는 모든 콜백을 실행
				for (const callback of this.callbacks) {
					callback.callback();
				}
	
				// run이 실행되는 중안에 요청된 reservedCallbacks를 callbacks로 이동
				// 얕은 복사가 발생하더라도 큰 문제가 없을 듯
				this.callbacks = this.reservedCallbacks;
				this.reservedCallbacks = [];
	
				this.isRunning = false;
				this.requestAnimationFrameId = null;
	
				// callbacks가 비어있지 않다면 다음 requestAnimationFrame에서 실행되도록 다시 실행
				if (this.callbacks.length > 0) {
					this.run();
				} else {
					// 모든 callbacks이 실행되어 더 이상 실행될 내용이 없다면 메모리 해제
					this.destroy();
				}
			});
		}
	}
}