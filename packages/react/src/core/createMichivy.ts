import { Michivy } from "../components/Michivy";
import { MichivyProvider } from "../components/MichivyProvider";
import type { Steps, StepType } from "../types";
import { useTour, type UseTourReturnValue } from "./useTour";

interface UseTourReturnValueRequired extends UseTourReturnValue {
	currentStep: StepType;
	isRunning: boolean;
	stepIndex: number;
	steps: Steps;
	metadata: any;
}

type UseTour<K extends string> = (key: K) => UseTourReturnValueRequired;

export function createMichivy<K extends string>() {
	return {
		Michivy: Michivy as Michivy<K>,
		MichivyProvider: MichivyProvider as MichivyProvider<K>,
		useTour: useTour as UseTour<K>,
	};
}
