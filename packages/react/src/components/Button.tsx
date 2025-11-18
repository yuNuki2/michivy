import { forwardRef, type ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const { style, children, ...rest } = props;

	return (
		<button ref={ref} style={{ cursor: "pointer", ...style }} type="button" {...rest}>
			{children}
		</button>
	);
});

export default Button;
