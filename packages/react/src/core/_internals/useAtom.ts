import { useCallback, useSyncExternalStore } from "react";
import type { Atom, AtomState } from "../../types";

// biome-ignore lint/suspicious/noExplicitAny: allow any
const store = new WeakMap<Atom<any>, AtomState<any>>();

export function atom<T>(value: T): Atom<T> {
	return { init: value };
}

function getAtomState<T>(atom: Atom<T>) {
	let state = store.get(atom) as AtomState<T> | undefined;

	if (!state) {
		state = { value: atom.init, listeners: new Set() };
		store.set(atom, state);
	}

	return state;
}

export function useAtom<T>(atom: Atom<T>): [T, (value: T) => void] {
	const state = getAtomState(atom);

	const subscribe = useCallback(
		(callback: () => void) => {
			state.listeners.add(callback);
			return () => {
				state.listeners.delete(callback);
			};
		},
		[state.listeners],
	);

	const getSnaphost = useCallback(() => {
		return state.value;
	}, [state.value]);

	const value = useSyncExternalStore(subscribe, getSnaphost, getSnaphost);

	const setState = useCallback(
		(value: T) => {
			state.value = value;
			for (const listener of state.listeners) {
				listener();
			}
		},
		[state],
	);

	return [value, setState];
}
