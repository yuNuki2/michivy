export function createInitialTourState() {
	return {
		value: {
			currentStep: null,
			isRunning: false,
			stepIndex: 0,
			steps: [],
			_id: crypto.randomUUID(),
		},
		listeners: new Set<VoidFunction>(),
	};
}
