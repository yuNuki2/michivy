import { forwardRef, type ComponentProps } from "react";
import { cn } from "../helpers/cn";

interface ButtonProps extends ComponentProps<"button"> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const { className, style, children, ...rest } = props;

	return (
		<button
			ref={ref}
			style={{ cursor: "pointer", ...style }}
			className={cn("michivy__button", className)}
			data-testid="button"
			type="button"
			{...rest}
		>
			{children}
		</button>
	);
});

export default Button;
