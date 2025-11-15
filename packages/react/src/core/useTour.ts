import { useCallback } from "react";
import { isFunction } from "../helpers";
import type { Steps, StepType } from "../types";
import { TourMetadataAtom } from "./_internals/tour-metadata";
import { useAtom } from "./_internals/useAtom";
import { useTourState } from "./_internals/useTourState";

export interface UseTourReturnValue {
	readonly currentStep: StepType | undefined;
	readonly currentTour: string | null;
	readonly isRunning: boolean | undefined;
	readonly stepIndex: number | undefined;
	readonly steps: Steps | undefined;
	go: (nextIndex: number) => void;
	next: () => void;
	prev: () => void;
	setSteps: (value: Steps | ((prev: Steps) => Steps)) => void;
	skip: () => void;
	start: () => void;
	stop: () => void;
}

export function useTour(tourKey?: string) {
	const [metadata, setTourMetadata] = useAtom(TourMetadataAtom);

	const key = tourKey || metadata.currentTourKey;

	const [tour, updateTour] = useTourState(key);

	const go = useCallback(
		(nextIndex: number): void => {
			updateTour({ stepIndex: nextIndex });
		},
		[updateTour],
	);

	const next = useCallback((): void => {
		updateTour((prev) => {
			const nextIndex = Math.min(prev.stepIndex + 1, prev.steps.length - 1);
			return { stepIndex: nextIndex };
		});
	}, [updateTour]);

	const prev = useCallback((): void => {
		updateTour((prev) => {
			const nextIndex = Math.max(prev.stepIndex - 1, 0);
			return { stepIndex: nextIndex };
		});
	}, [updateTour]);

	// const reset = useCallback(
	// 	(restart: boolean): void => {
	// 		updateTour({ isOpen: restart, stepIndex: 0 });
	// 	},
	// 	[updateTour],
	// );

	const setSteps = useCallback(
		(value: Steps | ((prev: Steps) => Steps)) => {
			updateTour((prev) => {
				const nextSteps = isFunction(value) ? value(prev.steps) : value;
				return { steps: nextSteps };
			});
		},
		[updateTour],
	);

	const skip = useCallback((): void => {
		updateTour({ isRunning: false, stepIndex: 0 });
		setTourMetadata({ currentTourKey: null });
	}, [setTourMetadata, updateTour]);

	const start = useCallback(() => {
		setTourMetadata({ currentTourKey: key });
		updateTour({ isRunning: true });
	}, [key, setTourMetadata, updateTour]);

	const stop = useCallback(() => {
		updateTour({ isRunning: false });
		setTourMetadata({ currentTourKey: null });
	}, [setTourMetadata, updateTour]);

	return {
		get currentStep() {
			return tour?.steps[tour?.stepIndex];
		},
		get currentTour() {
			return metadata.currentTourKey;
		},
		get isRunning() {
			return tour?.isRunning;
		},
		get stepIndex() {
			return tour?.stepIndex;
		},
		get steps() {
			return tour?.steps;
		},
		go,
		next,
		prev,
		setSteps,
		skip,
		start,
		stop,
	} satisfies UseTourReturnValue;
}
