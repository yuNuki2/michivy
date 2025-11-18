import { forwardRef, useEffect, type CSSProperties } from "react";

interface SpotlightProps {
	className?: string;
	clickable?: boolean;
	padding?: number;
	style?: CSSProperties;
	target: string | Element | null;
}

const Spotlight = forwardRef<HTMLDivElement, SpotlightProps>((props, ref) => {
	props;
	ref;
	// const { className, clickable = false, padding = 8, style, target, ...rest } = props;

	// const baseStyle = useMemo<CSSProperties>(() => {
	// 	const element = resolveElement(target);
	// 	const rect = getClientRect(element);
	// 	const { height = 0, left = 0, width = 0 } = rect ?? {};
	// 	let top = rect?.top ?? 0;
	// 	const parent = scrollParent(element);
	// 	const hasScrollParent = !parent.isSameNode(
	// 		document.scrollingElement || document.documentElement,
	// 	);

	// 	// TODO: fixed の場合の処理？

	// 	if (parent instanceof HTMLElement) {
	// 		const parentTop = parent.scrollTop;
	// 		if (hasScrollParent) {
	// 			top += parentTop;
	// 		}
	// 	}

	// 	top = Math.floor(top - padding);

	// 	return {
	// 		background: "gray",
	// 		height: Math.round(height + padding * 2),
	// 		left: Math.round(left - padding),
	// 		// opacity: showSpotlight ? 1 : 0,
	// 		// pointerEvents: spotlightClicks ? "none" : "auto",
	// 		// position: isFixedTarget ? "fixed" : "absolute",
	// 		position: "absolute",
	// 		top,
	// 		borderRadius: 8,
	// 		transition: "opacity 0.25s, top 0.1s",
	// 		width: Math.round(width + padding * 2),
	// 	};
	// }, [padding, target]);

	useEffect(() => {
		const handleResize = () => {};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		// <div
		// 	ref={ref}
		// 	style={{ ...baseStyle, ...style }}
		// 	className={cn("michivy__spotlight", className)}
		// 	data-testid="spotlight"
		// 	{...rest}
		// />
		<svg width="100dvw" height="100dvh" xmlns="http://www.w3.org/2000/svg">
			<title>SpotLight</title>
			<defs></defs>
		</svg>
	);
});

export default Spotlight;
