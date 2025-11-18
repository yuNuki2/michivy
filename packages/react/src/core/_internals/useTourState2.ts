import { useCallback, useRef, useSyncExternalStore } from "react";
import type { TourState } from "../../types";
import { createGlobalStore } from "../store";
import { useTours } from "./useTours";

type UpdateTourStateAction =
	| Partial<TourState>
	| ((prev: TourState) => Partial<TourState>);

type UpdateTourStore = (value: UpdateTourStateAction) => TourState;

export function useTourState(key: string): [TourState | undefined, UpdateTourStore] {
	const tours = useTours();

	const store = useRef(createGlobalStore(tours));
	store.current = createGlobalStore(tours);

	// const genTourState = useCallback(
	// 	(key: string) => {
	// 		return store.get(key);
	// 	},
	// 	[store],
	// );

	const subscribe = useCallback(
		(callback: VoidFunction) => {
			return store.current.subscribe(key, callback);
		},
		[key],
	);

	const getSnapshot = useCallback(() => {
		return store.current.get(key);
	}, [key]);

	const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	const update = useCallback(
		(value: UpdateTourStateAction) => {
			// const state = genTourState(key);
			// if (!state) {
			// 	throw new Error(`Tour with key ${key} does not exist.`);
			// }
			// const nextValue = isFunction(value) ? value(state.value) : value;
			// state.value = { ...state.value, ...nextValue };
			// for (const listener of state.listeners) {
			// 	listener();
			// }
			// console.info("updated: ", state);
			// return state.value;
			return store.current.set(key, value);
		},
		[key],
	);

	return [value, update];
}
