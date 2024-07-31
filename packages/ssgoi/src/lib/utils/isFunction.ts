// eslint-disable-next-line @typescript-eslint/ban-types
function isFunction(value: unknown): value is Function {
	return typeof value === 'function';
}

export default isFunction;
