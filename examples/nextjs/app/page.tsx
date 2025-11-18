"use client";

import Michivy, { useTour } from "@michivy/react";
import { useReducer, useState } from "react";

export default function Home() {
	const tour = useTour("tour1");

	const [steps] = useState([{ target: "#sample1", content: "content1" }]);

	// const clipId = useMemo(() => "spotlight-" + Math.random().toString(36), []);

	const [, render] = useReducer((prev) => prev + 1, 0);

	return (
		// <Michivy name="tour1" steps={[{ target: "#sample1", content: "content1" }]}>
		<Michivy name="tour1" steps={steps}>
			<div className="grid h-dvh place-items-center">
				<button id="sample1" type="button">
					sample1
				</button>
				<button type="button" onClick={tour.start}>
					start
				</button>
				{String(tour.isRunning)}
				<button type="button" onClick={render}>
					render
				</button>
			</div>
			{/* <div
				className="w-dvh fixed inset-0 z-9999"
				style={{ background: "black", opacity: 0.7 }}
			> */}
			{/* <svg
				width="100dvw"
				height="100dvh"
				xmlns="http://www.w3.org/2000/svg"
				// className="bg-transparent"
			>
				<title>SpotLight</title>
				<defs>
					<mask id={clipId}>
						<rect width="100%" height="100%" fill="white" />
						<rect x={200} y={200} width={200} height={200} rx={8} ry={8} fill="black" />
					</mask>
				</defs>
				<rect width="100%" height="100%" fill="currentColor" mask={`url(#${clipId})`} />
				<rect
					x={200}
					y={200}
					width={200}
					height={200}
					rx={8}
					ry={8}
					fill="transparent"
					// display="none"
				/>
			</svg> */}
			{/* </div> */}
		</Michivy>
	);
}
