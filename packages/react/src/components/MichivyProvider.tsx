import { useRef, type ReactNode } from "react";
import { INITIAL_TOUR_STATE } from "../constants/tour";
import { TourContext } from "../core/_internals/context";
import { TourMetadataAtom } from "../core/_internals/tour-metadata";
import { useAtom } from "../core/_internals/useAtom";
import type { AtomState, Steps, Tours, TourState } from "../types";

interface MichivyProviderProps {
	initialTours?: Record<string, Steps>;
	children: ReactNode;
}

export default function MichivyProvider(props: MichivyProviderProps) {
	const { initialTours = {}, children } = props;

	const [metadata] = useAtom(TourMetadataAtom);

	const toursRef = useRef<Tours>();

	if (!toursRef.current) {
		const init: [string, AtomState<TourState>][] = [];
		for (const [key, steps] of Object.entries(initialTours)) {
			const value = { ...INITIAL_TOUR_STATE.value, steps };
			init.push([key, { value, listeners: new Set() }]);
		}
		toursRef.current = new Map(init);
	}

	return (
		<TourContext.Provider value={{ metadata, tours: toursRef.current }}>
			{children}
		</TourContext.Provider>
	);
}
