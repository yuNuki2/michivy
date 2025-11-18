import type { ReactNode } from "react";

export type Placement =
	| "top"
	| "right"
	| "bottom"
	| "left"
	| "top-start"
	| "top-end"
	| "right-start"
	| "right-end"
	| "bottom-start"
	| "bottom-end"
	| "left-start"
	| "left-end"
	| "center"
	| "auto"
	| readonly [number, number];

type Hook = () => boolean | Promise<boolean>;

export interface StepType {
	target: string | Element | null;
	content: ReactNode;
	next?: ((ctx: { next: () => void }) => void | Promise<void>) | undefined;
	prev?: ((ctx: { prev: () => void }) => void | Promise<void>) | undefined;
	onAfterNext?: Hook | undefined;
	onAfterPrev?: Hook | undefined;
	onBeforeNext?: Hook | undefined;
	onBeforePrev?: Hook | undefined;
	placement?: Placement | undefined;
	title?: string | undefined;
}

export interface TourState {
	currentStep: StepType | null;
	isRunning: boolean;
	stepIndex: number;
	steps: Steps;
	metadata?: any;

	// internal
	_id: string;
}

export type Tours = Map<string, AtomState<TourState>>;

export interface TourMetadata {
	currentTourKey: string | null;
}

export interface TourStore {
	metadata: TourMetadata;
	tours: Tours;
}

export interface Locale {
	back?: ReactNode | undefined;
	close?: ReactNode | undefined;
	last?: ReactNode | undefined;
	next?: ReactNode | undefined;
	nextLabelWithProgress?: ReactNode | undefined;
	open?: ReactNode | undefined;
	skip?: ReactNode | undefined;
}

export type Atom<T> = { init: T };

export interface AtomState<T> {
	value: T;
	listeners: Set<VoidFunction>;
}

export type Steps = Array<StepType>;

export type GenericFunction = (...args: any[]) => any;

export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
