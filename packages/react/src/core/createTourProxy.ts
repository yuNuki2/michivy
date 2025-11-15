import type { Steps, StepType } from "../types";
import { useTour, type UseTourReturnValue } from "./useTour";

interface UseTourReturnValueRequired extends UseTourReturnValue {
	currentStep: StepType;
	isRunning: boolean;
	stepIndex: number;
	steps: Steps;
}

type UseTour<K extends string> = (key: K) => UseTourReturnValueRequired;

export function createUseTour<K extends string>(): UseTour<K> {
	return useTour as UseTour<K>;
}
