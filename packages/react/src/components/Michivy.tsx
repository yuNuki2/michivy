import { autoUpdate } from "@floating-ui/dom";
import {
	Fragment,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	type ComponentType,
	type ReactNode,
} from "react";
import { createInitialTourState } from "../core/_internals/create-initial-tour-state";
import { arrow, flip, offset, shift } from "../core/_internals/use-floating/middleware";
import { useFloating } from "../core/_internals/use-floating/useFloating";
import { useElement } from "../core/_internals/useElement";
import { useSafeLayoutEffect } from "../core/_internals/useSafeLayoutEffect";
import { useTours } from "../core/_internals/useTours";
import { useTour } from "../core/useTour";
import { resolvePlacement } from "../helpers";
import { isHTMLElement } from "../helpers/dom";
import type { Placement, Steps } from "../types";
import type { UseFloatingOptions } from "../types/floating";
import DefaultBeacon, { type BeaconProps } from "./Beacon";
import Overlay from "./Overlay";
import Portal from "./Portal";
import Spotlight from "./Spotlight";
import DefaultTooltip, { type TooltipProps } from "./Tooltip";

interface FloatingOptions<P> {
	placement?: Placement;
	offset?: number;
	component?: ComponentType<P>;
	floatingOptions?: UseFloatingOptions;
}

type KeyboardParts = "ArrowRight" | "ArrowLeft" | "Escape";

export interface MichivyProps<K extends string> {
	name: K;
	steps: Steps | ((prev: Steps) => Steps);
	stepIndex?: number;
	isRunning?: boolean;
	container?: string | Element | null;
	tooltip?: false | FloatingOptions<TooltipProps>;
	beacon?: false | FloatingOptions<BeaconProps>;
	// target: Element | null;

	onAfterStart?: (target: Element | null) => void;
	onBeforeEnd?: (target: Element | null) => void;

	onClose?: () => void;

	disableKeyboardNavigation?: boolean | KeyboardParts[];

	children?: ReactNode;
}

export type Michivy<DefaultKey extends string = string> = <K extends string = DefaultKey>(
	props: MichivyProps<K>,
) => ReactNode;

export const Michivy: Michivy = memo(
	(props) => {
		const {
			name,
			steps,
			stepIndex,
			disableKeyboardNavigation = false,
			// onAfterStart,
			// onBeforeEnd,
			onClose,
			children,
		} = props;

		const [, render] = useReducer((prev) => prev + 1, 0);

		const tours = useTours();

		useSafeLayoutEffect(() => {
			const state = createInitialTourState();
			tours.set(name, state);
			console.info("created: ", state);

			return () => {
				tours.delete(name);
			};
		}, [name, tours]);

		const tour = useTour(name);

		const step = tour.currentStep;

		const content = step?.content;

		useEffect(() => {
			tour.setSteps(steps);
		}, [steps, tour.setSteps]);

		useEffect(() => {
			if (stepIndex == null) return;
			tour.go(stepIndex);
		}, [stepIndex, tour.go]);

		const target = useElement(() => step?.target || null);
		const container = useElement(() => props.container || document.body);

		const arrowRef = useRef<HTMLSpanElement>(null);

		const beaconOptions = useMemo<UseFloatingOptions>(() => {
			if (props.beacon === false) return {};
			const options: UseFloatingOptions = {
				whileElementsMounted: autoUpdate,
				middleware: [offset(props.beacon?.offset ?? 8), flip(), shift()],
			};

			resolvePlacement(options, props.beacon?.placement);

			return { ...options, ...props.beacon?.floatingOptions };
		}, [props.beacon]);

		const tooltipOptions = useMemo<UseFloatingOptions>(() => {
			if (props.tooltip === false) return {};
			const options: UseFloatingOptions = {
				whileElementsMounted: autoUpdate,
				middleware: [
					offset(props.tooltip?.offset ?? 8),
					flip(),
					shift(),
					arrow({ element: arrowRef }),
				],
			};

			resolvePlacement(options, props.tooltip?.placement);

			return { ...options, ...props.tooltip?.floatingOptions };
		}, [props.tooltip]);

		const handleClickNext = useCallback(async () => {
			if (step?.next) {
				const next = step.next({ next: tour.next });
				if (next instanceof Promise) {
					await next;
				}
			} else {
				tour.next();
			}
			if (stepIndex === steps.length - 1) {
				tour.skip();
			}
		}, [step?.next, stepIndex, steps, tour.next, tour.skip]);

		const handleClickPrev = useCallback(async () => {
			if (step?.prev) {
				const prev = step.prev({ prev: tour.prev });
				if (prev instanceof Promise) {
					await prev;
				}
			} else {
				tour.prev();
			}
		}, [step, tour.prev]);

		const handleClickSkip = useCallback(() => {
			tour.skip();
		}, [tour.skip]);

		const handleClickClose = useCallback(() => {
			tour.stop();
			onClose?.();
		}, [onClose, tour.stop]);

		const handleClickOverlay = useCallback(() => {
			tour.stop();
			onClose?.();
		}, [onClose, tour.stop]);

		const beacon = useFloating(beaconOptions);
		const tooltip = useFloating(tooltipOptions);

		useEffect(() => {
			if (!target) return;
			beacon.refs.setReference(target);
			tooltip.refs.setReference(target);
		}, [beacon.refs.setReference, tooltip.refs.setReference, target]);

		// focus
		useEffect(() => {
			if (!tour.isRunning || !isHTMLElement(target)) return;

			target.focus();
		}, [tour.isRunning, target]);

		// keyboard event
		useEffect(() => {
			if (!tour.isRunning || disableKeyboardNavigation === true) return;

			const handlers = {
				ArrowLeft: tour.prev,
				ArrowRight: tour.next,
				Escape: tour.stop,
			} satisfies Record<KeyboardParts, () => void>;

			const handleKeyDown = (e: KeyboardEvent) => {
				const key = e.key as KeyboardParts;
				if (!disableKeyboardNavigation || disableKeyboardNavigation.includes(key)) {
					handlers[key]();
				}
				render();
			};

			document.addEventListener("keydown", handleKeyDown);

			return () => {
				document.removeEventListener("keydown", handleKeyDown);
			};
		}, [disableKeyboardNavigation, tour.isRunning, tour.prev, tour.next, tour.stop]);

		const Beacon =
			props.beacon !== false ? (props.beacon?.component ?? DefaultBeacon) : null;
		const Tooltip =
			props.tooltip !== false ? (props.tooltip?.component ?? DefaultTooltip) : null;

		if (!tour.isRunning) {
			return children;
		}

		return (
			<Fragment>
				<Portal container={container}>
					<div className="michivy" style={{ display: "contents" }}>
						<Overlay onClick={handleClickOverlay}>
							<Spotlight target={target} />
						</Overlay>
						{Beacon && (
							<Beacon ref={beacon.refs.setFloating} style={beacon.floatingStyles} />
						)}
						{Tooltip && (
							<Tooltip
								ref={tooltip.refs.setFloating}
								style={tooltip.floatingStyles}
								content={content}
								tour={tour}
								nextProps={{
									className: "michivy__next-button",
									onClick: handleClickNext,
								}}
								prevProps={{
									className: "michivy__prev-button",
									onClick: handleClickPrev,
								}}
								skipProps={{
									className: "michivy__skip-button",
									onClick: handleClickSkip,
								}}
								closeProps={{
									className: "michivy__close-button",
									onClick: handleClickClose,
								}}
							/>
						)}
						<span ref={arrowRef} />
					</div>
				</Portal>
				{children}
			</Fragment>
		);
	},
	// TODO: 最適化する
	// (a, b) => JSON.stringify(a.steps) === JSON.stringify(b.steps),
);
