import { useRef, type MutableRefObject } from "react";
import { useSafeLayoutEffect } from "../useSafeLayoutEffect";

export function useLatestRef<T>(value: T): MutableRefObject<T> {
	const ref = useRef<T>(value);

	useSafeLayoutEffect(() => {
		ref.current = value;
	});

	return ref;
}
