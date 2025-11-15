import { forwardRef, type CSSProperties } from "react";
import { cn } from "../helpers/cn";

export interface BeaconProps {
	className?: string;
	style?: CSSProperties;
}

const Beacon = forwardRef<HTMLDivElement, BeaconProps>((props, ref) => {
	const { className, ...rest } = props;

	return (
		<div
			ref={ref}
			className={cn("michivy__beacon", className)}
			data-testid="beacon"
			{...rest}
		/>
	);
});

export default Beacon;
