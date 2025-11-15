import { forwardRef, type CSSProperties, type MouseEventHandler } from "react";
import { cn } from "../helpers/cn";

export interface TooltipProps {
	className?: string;
	style?: CSSProperties;
	primaryProps?: {
		onClick: MouseEventHandler<HTMLButtonElement>;
	};
	backProps?: {
		onClick: MouseEventHandler<HTMLButtonElement>;
	};
	skipProps?: {
		onClick: MouseEventHandler<HTMLButtonElement>;
	};
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
	const { className, style, ...rest } = props;

	const baseStyle: CSSProperties = {
		background: "#fff",
		padding: "8px 12px",
		borderRadius: 12,
		boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
	};

	return (
		<div
			role="tooltip"
			ref={ref}
			style={{ ...baseStyle, ...style }}
			className={cn("michivy-tooltip", className)}
			data-testid="tooltip"
			{...rest}
		>
			<h2>aaaa</h2>
			<div>bbbb</div>
			<div>cccc</div>
		</div>
	);
});

export default Tooltip;
