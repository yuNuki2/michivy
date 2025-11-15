import {
	forwardRef,
	type CSSProperties,
	type MouseEventHandler,
	type ReactNode,
} from "react";
import { cn } from "../helpers/cn";
import { getDocumentHeight } from "../helpers/dom";

interface OverlayProps {
	className?: string;
	disabled?: boolean;
	mouseOverSpotlight?: boolean;
	spotlightPadding?: number;
	style?: CSSProperties;
	onClick: MouseEventHandler<HTMLDivElement>;
	children: ReactNode;
}

const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) => {
	const {
		className,
		disabled = false,
		mouseOverSpotlight = false,
		style,
		onClick,
		children,
		...rest
	} = props;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: for overlay
		<div
			role="presentation"
			ref={ref}
			style={{
				position: "fixed",
				inset: 0,
				height: getDocumentHeight(),
				cursor: disabled ? "default" : "pointer",
				pointerEvents: mouseOverSpotlight ? "none" : "auto",
				...style,
			}}
			className={cn("michivy__overlay", className)}
			data-testid="overlay"
			onClick={onClick}
			{...rest}
		>
			{children}
		</div>
	);
});

export default Overlay;
