// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function isFunction(value: unknown): value is Function {
	return typeof value === 'function';
}

export default isFunction;
