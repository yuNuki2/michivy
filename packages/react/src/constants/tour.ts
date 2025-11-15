export const INITIAL_TOUR_STATE = {
	value: {
		currentStep: null,
		isRunning: true,
		stepIndex: 0,
		steps: [],
		_id: crypto.randomUUID(),
	},
	listeners: new Set<VoidFunction>(),
};
