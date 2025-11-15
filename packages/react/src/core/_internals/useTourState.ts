import { useCallback, useSyncExternalStore } from "react";
import { isFunction } from "../../helpers";
import type { TourState } from "../../types";
import { useTours } from "./useTours";

type UpdateTourStateAction =
	| Partial<TourState>
	| ((prev: TourState) => Partial<TourState>);

type UpdateTourStore = (value: UpdateTourStateAction) => void;

export function useTourState(
	key: string | null,
): [TourState | undefined, UpdateTourStore] {
	const store = useTours();

	// const state = getAtomState(store, key);
	const state = key ? store.get(key) : null;

	const subscribe = useCallback(
		(callback: VoidFunction) => {
			state?.listeners.add(callback);
			return () => {
				state?.listeners.delete(callback);
			};
		},
		[state?.listeners],
	);

	const getSnapshot = useCallback(() => {
		return state?.value;
	}, [state?.value]);

	const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	const update = useCallback(
		(value: UpdateTourStateAction) => {
			if (!state) return;
			const nextValue = isFunction(value) ? value(state.value) : value;
			state.value = { ...state.value, ...nextValue };
			for (const listener of state.listeners) {
				listener();
			}
		},
		[state],
	);

	return [value, update];
}
