import {
	arrow,
	flip,
	offset,
	shift,
	useFloating,
	type UseFloatingOptions,
} from "@floating-ui/react-dom";
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	type ComponentType,
	type ReactNode,
} from "react";
import { INITIAL_TOUR_STATE } from "../constants/tour";
import { useTours } from "../core/_internals/useTours";
import { useTour } from "../core/useTour";
import { resolvePlacement } from "../helpers";
import { resolveElement } from "../helpers/dom";
import type { Placement, Steps } from "../types";
import DefaultBeacon from "./Beacon";
import Overlay from "./Overlay";
import Portal from "./Portal";
import Spotlight from "./Spotlight";
import DefaultTooltip, { type TooltipProps } from "./Tooltip";

interface FloatingOptions {
	placement?: Placement;
	offset?: number;
	component?: ComponentType<TooltipProps>;
	floatingOptions?: UseFloatingOptions;
}

interface MichivyProps {
	name: string;
	steps: Steps;
	container?: string | Element | null;
	// placement?: Placement;
	// offset?: number;

	tooltip?: FloatingOptions;
	beacon?: FloatingOptions;
	// target: Element | null;

	children?: ReactNode;
}

export default function Michivy(props: MichivyProps) {
	const { name, steps, container = document.body, children } = props;

	const { currentStep: step } = useTour(props.name);

	const tours = useTours();

	useEffect(() => {
		if (tours.has(name)) return;
		tours.set(name, INITIAL_TOUR_STATE);

		return () => {
			tours.delete(name);
		};
	}, [name, tours]);

	const tour = useTour(name);

	useEffect(() => {
		tour.setSteps(steps);
	}, [steps, tour.setSteps]);

	const _target = useMemo<HTMLDivElement | null>(() => {
		if (!step) return null;
		const el = resolveElement(step.target);
		return el instanceof HTMLDivElement ? el : null;
	}, [step]);

	const _container = useMemo<Element | null>(() => {
		return resolveElement(container);
	}, [container]);

	const beaconOptions = useMemo<UseFloatingOptions>(() => {
		const options: UseFloatingOptions = {
			middleware: [offset(props.beacon?.offset ?? 8), flip(), shift()],
		};

		resolvePlacement(options, props.beacon?.placement);

		return { ...options, ...props.beacon?.floatingOptions };
	}, [props.beacon]);

	const tooltipOptions = useMemo<UseFloatingOptions>(() => {
		const options: UseFloatingOptions = {
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

	const handleClickPrimary = useCallback(async () => {
		if (step?.next) {
			const next = step.next({ next: tour.next });
			if (next instanceof Promise) {
				await next;
			}
		} else {
			tour.next();
		}
	}, [step, tour.next]);

	const handleClickBack = useCallback(async () => {
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

	const handleClickOverlay = useCallback(() => {
		tour.stop();
	}, [tour.stop]);

	const arrowRef = useRef<HTMLSpanElement>(null);

	const beacon = useFloating(beaconOptions);

	const tooltip = useFloating(tooltipOptions);

	useEffect(() => {
		if (!_target) return;
		beacon.refs.setReference(_target);
		tooltip.refs.setReference(_target);
	}, [beacon.refs.setReference, tooltip.refs.setReference, _target]);

	const Beacon = props.beacon?.component ?? DefaultBeacon;
	const Tooltip = props.tooltip?.component ?? DefaultTooltip;

	if (tour.isRunning) {
		return null;
	}

	return (
		<Fragment>
			<Portal container={_container}>
				<div className="michivy" style={{ display: "contents" }}>
					<Overlay onClick={handleClickOverlay}>
						<Spotlight target={_target} />
					</Overlay>
					<Beacon ref={beacon.refs.setFloating} style={beacon.floatingStyles} />
					<Tooltip
						ref={tooltip.refs.setFloating}
						style={tooltip.floatingStyles}
						primaryProps={{ onClick: handleClickPrimary }}
						backProps={{ onClick: handleClickBack }}
						skipProps={{ onClick: handleClickSkip }}
					/>
				</div>
			</Portal>
			{children}
		</Fragment>
	);
}
