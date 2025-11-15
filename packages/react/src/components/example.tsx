import { useRef } from "react";
import { createUseTour } from "../core/createTourProxy";
import { useTour } from "../core/useTour";
import Michivy from "./Michivy";
import MichivyProvider from "./MichivyProvider";

function A() {
	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<Michivy
			name="tour1"
			steps={[
				// NOTE: query is available.
				{ target: "#sample1", content: "tour1" },
				// NOTE: Also xpath is available.
				{ target: '//*[@id="sample2"]', content: "tour2" },
				// NOTE: React ref is available.
				{ target: buttonRef.current, content: "tour3" },
			]}
		>
			<button type="button" ref={buttonRef}>
				sample3
			</button>
		</Michivy>
	);
}

function B() {
	const { currentTour, stepIndex, skip } = useTour();

	return (
		<div>
			<p>current tour is {currentTour}</p>
			<p>current step is {stepIndex}</p>
			<button type="button" onClick={skip}>
				Skip
			</button>
		</div>
	);
}

function C() {
	return (
		<MichivyProvider
			initialTours={{
				tour1: [
					{ target: ".sample1", content: "content1" },
					{ target: ".sample2", content: "content2" },
				],
				tour2: [
					{ target: ".sample3", content: "content3" },
					{ target: ".sample4", content: "content4" },
				],
			}}
		>
			...
		</MichivyProvider>
	);
}

const useMyTour = createUseTour<"tour1" | "tour2">();
