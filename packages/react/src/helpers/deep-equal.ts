import { isFunction, isPlainObject } from ".";

export function deepEqual(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) {
		return true;
	}

	if (!isPlainObject(a) || !isPlainObject(b)) {
		return false;
	}

	const [keysA, keysB] = [Object.keys(a), Object.keys(b)];

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (const key of keysA) {
		if (!keysB.includes(key)) return false;

		const valueA = a[key];
		const valueB = b[key];

		if (isFunction(valueA) && isFunction(valueB)) {
			if (valueA !== valueB) return false;
			continue;
		}

		if (deepEqual(valueA, valueB)) {
			return false;
		}
	}

	return true;
}
