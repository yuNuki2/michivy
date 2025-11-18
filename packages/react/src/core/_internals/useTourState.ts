import { useCallback, useSyncExternalStore } from "react";
import { isFunction } from "../../helpers";
import type { TourState } from "../../types";
import { useTours } from "./useTours";

type UpdateTourStateAction =
	| Partial<TourState>
	| ((prev: TourState) => Partial<TourState>);

type UpdateTourStore = (value: UpdateTourStateAction) => TourState;

export function useTourState(key: string): [TourState | undefined, UpdateTourStore] {
	const store = useTours();

	const genTourState = useCallback(
		(key: string) => {
			return store.get(key);
		},
		[store],
	);

	const subscribe = useCallback(
		(callback: VoidFunction) => {
			const state = genTourState(key);
			console.info("subscribe: ", state);
			state?.listeners.add(callback);
			return () => {
				state?.listeners.delete(callback);
			};
		},
		[key, genTourState],
	);

	const getSnapshot = useCallback(() => {
		const state = genTourState(key);
		return state?.value;
	}, [key, genTourState]);

	const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	const update = useCallback(
		(value: UpdateTourStateAction) => {
			const state = genTourState(key);
			if (!state) {
				throw new Error(`Tour with key ${key} does not exist.`);
			}
			const nextValue = isFunction(value) ? value(state.value) : value;
			state.value = { ...state.value, ...nextValue };
			for (const listener of state.listeners) {
				listener();
			}
			console.info("updated: ", state);
			return state.value;
		},
		[key, genTourState],
	);

	return [value, update];
}
