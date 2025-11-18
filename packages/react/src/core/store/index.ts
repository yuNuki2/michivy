import { isFunction } from "../../helpers";

interface Store<K, V> {
	get: (key: K) => V | undefined;
	set: (key: K, action: Partial<V> | ((prev: V) => Partial<V>)) => V;
	// update: (key: K, fn: (prev: V) => V) => V;
	subscribe: (key: K, callback: (value: V) => void) => () => void;
}

interface State<V> {
	value: V;
	listeners: Set<(value: V) => void>;
}

export function createGlobalStore<K, V>(store: {
	get: (key: K) => State<V> | undefined;
}): Store<K, V> {
	// const store = {} as Map<K, State<V>>;

	function _getState(key: K): State<V> | undefined {
		return store.get(key);
	}

	function get(key: K): V | undefined {
		return _getState(key)?.value;
	}

	function set(key: K, action: Partial<V> | ((prev: V) => Partial<V>)): V {
		const state = _getState(key);
		if (!state) {
			throw new Error();
		}
		const value = isFunction(action) ? action(state.value) : action;
		state.value = { ...state.value, ...value };
		for (const listener of state.listeners) {
			listener(state.value);
		}
		return state.value;
	}

	function subscribe(key: K, callback: (value: V) => void): () => void {
		const state = _getState(key);
		state?.listeners.add(callback);

		return () => {
			state?.listeners.delete(callback);
		};
	}

	return { get, set, subscribe };
}
