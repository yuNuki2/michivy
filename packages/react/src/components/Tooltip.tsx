import {
	forwardRef,
	type ComponentPropsWithRef,
	type CSSProperties,
	type ReactNode,
} from "react";
import type { UseTourReturnValue } from "../core/useTour";
import { cn } from "../helpers/cn";
import Button from "./Button";

export interface TooltipProps {
	className?: string;
	style?: CSSProperties;
	content: ReactNode;
	tour: UseTourReturnValue;
	closeProps?: ComponentPropsWithRef<"button">;
	nextProps?: ComponentPropsWithRef<"button">;
	prevProps?: ComponentPropsWithRef<"button">;
	skipProps?: ComponentPropsWithRef<"button">;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
	const {
		className,
		style,
		content,
		tour,
		closeProps,
		nextProps,
		prevProps,
		skipProps,
		...rest
	} = props;

	const isNotFirstIndex = tour.stepIndex != null && tour.stepIndex > 0;

	const isLastIndex =
		tour.stepIndex != null && !!tour.steps && tour.stepIndex > tour.steps.length - 1;

	const baseStyle: CSSProperties = {
		background: "#fff",
		padding: "8px 12px",
		borderRadius: 12,
		boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
		zIndex: 12345,
	};

	return (
		<div
			role="tooltip"
			ref={ref}
			style={{ ...baseStyle, ...style }}
			className={cn("michivy__tooltip", className)}
			data-testid="tooltip"
			{...rest}
		>
			<h2>aaaa</h2>
			{content && <div>{content}</div>}
			<div>
				{isLastIndex && <Button {...skipProps}>skip</Button>}
				{isNotFirstIndex && <Button {...prevProps}>back</Button>}
				<Button {...nextProps}>next</Button>
			</div>
			<Button {...closeProps}>
				<img src="./close.svg" alt="close" width={24} height={24} decoding="async" />
			</Button>
		</div>
	);
});

export default Tooltip;
