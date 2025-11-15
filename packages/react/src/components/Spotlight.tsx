import { forwardRef, useMemo, type CSSProperties } from "react";
import { cn } from "../helpers/cn";
import { getClientRect, resolveElement } from "../helpers/dom";

interface SpotlightProps {
	className?: string;
	clickable?: boolean;
	padding?: number;
	style?: CSSProperties;
	target: string | Element | null;
}

const Spotlight = forwardRef<HTMLDivElement, SpotlightProps>((props, ref) => {
	const { className, clickable = false, padding = 8, style, target, ...rest } = props;

	console.log({ clickable });

	const baseStyle = useMemo<CSSProperties>(() => {
		const element = resolveElement(target);
		const rect = getClientRect(element);
		const { height = 0, left = 0, width = 0 } = rect ?? {};
		const top: number = 0;

		return {
			height: Math.round(height + padding * 2),
			left: Math.round(left - padding),
			// opacity: showSpotlight ? 1 : 0,
			// pointerEvents: spotlightClicks ? "none" : "auto",
			// position: isFixedTarget ? "fixed" : "absolute",
			top,
			transition: "opacity 0.25s",
			width: Math.round(width + padding * 2),
		};
	}, [padding, target]);

	return (
		<div
			// ref={(el) => {
			// 				el = target;
			// 			}}
			style={{ ...baseStyle, ...style }}
			className={cn("michivy__spotlight", className)}
			data-testid="spotlight"
			{...rest}
		/>
	);
});

export default Spotlight;
