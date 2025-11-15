import type { UseFloatingOptions } from "@floating-ui/react-dom";
import type { GenericFunction, Placement } from "../types";

export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isFunction(value: unknown): value is GenericFunction {
	return typeof value === "function";
}

export function noop() {}

export function resolvePlacement(
	options: UseFloatingOptions,
	placement: Placement | undefined,
) {
	if (!placement) return;
	switch (placement) {
		case "bottom":
		case "bottom-end":
		case "bottom-start":
		case "left":
		case "left-end":
		case "left-start":
		case "right":
		case "right-end":
		case "right-start":
		case "top":
		case "top-end":
		case "top-start":
			options.placement = placement;
			break;
		case "center":
			options.elements = {
				reference: {
					getBoundingClientRect() {
						const width = window.innerWidth;
						const height = window.innerHeight;
						return {
							x: width / 2,
							y: height / 2,
							top: height / 2,
							left: width / 2,
							right: width / 2,
							bottom: height / 2,
							width: 0,
							height: 0,
						};
					},
				},
			};
			break;
		case "auto":
			break;
		default: {
			const [x, y] = placement;
			options.elements = {
				reference: {
					getBoundingClientRect: () => {
						return {
							x,
							y,
							top: y,
							left: x,
							right: x,
							bottom: y,
							width: 0,
							height: 0,
						};
					},
				},
			};
		}
	}
}
