import { useRef, type ReactNode } from "react";
import { TourContext } from "../core/_internals/context";
import { createInitialTourState } from "../core/_internals/create-initial-tour-state";
import { TourMetadataAtom } from "../core/_internals/tour-metadata";
import { useAtom } from "../core/_internals/useAtom";
import type { AtomState, Steps, Tours, TourState } from "../types";

export interface MichivyProviderProps<K extends string> {
	initialTours?: Partial<Record<K, Steps>>;
	children: ReactNode;
}

export type MichivyProvider<DefaultKey extends string = string> = <
	K extends string = DefaultKey,
>(
	props: MichivyProviderProps<K>,
) => JSX.Element;

export const MichivyProvider: MichivyProvider = (props) => {
	const { initialTours = {}, children } = props;

	const [metadata] = useAtom(TourMetadataAtom);

	const toursRef = useRef<Tours>();

	if (!toursRef.current) {
		const initialToursEntries: [string, AtomState<TourState>][] = [];
		for (const [key, steps] of Object.entries(initialTours)) {
			const initialTourState = createInitialTourState();
			const value = { ...initialTourState.value, steps: steps as Steps };
			initialToursEntries.push([key, { value, listeners: new Set() }]);
		}
		toursRef.current = new Map(initialToursEntries);
	}

	return (
		<TourContext.Provider value={{ metadata, tours: toursRef.current }}>
			{children}
		</TourContext.Provider>
	);
};
