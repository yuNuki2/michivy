import { useState } from "react";
import { resolveElement } from "../../helpers/dom";
import { useSafeLayoutEffect } from "./useSafeLayoutEffect";

export function useElement(target: () => string | Element | null): Element | null {
	const [element, setElement] = useState<Element | null>(null);

	useSafeLayoutEffect(() => {
		const element = resolveElement(target());
		setElement(element);
	}, [target]);

	return element;
}
