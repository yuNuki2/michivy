export function isElement(value: unknown): value is Element {
	return value instanceof Element;
}

export function isHTMLElement(value: unknown): value is HTMLElement {
	return value instanceof HTMLElement;
}

function getElementByXPath(expression: string): Node | null {
	const result = document.evaluate(
		expression,
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null,
	);
	return result.singleNodeValue;
}

export function getElement(query: string): Element | null {
	let result: Node | Element | null;
	try {
		result = getElementByXPath(query);
	} catch {
		try {
			result = document.querySelector(query);
		} catch {
			console.error();
			result = null;
		}
	}

	if (!isHTMLElement(result)) {
		return null;
	}

	return result;
}

export async function waitFor(query: string, timeout = 5000): Promise<Element | null> {
	return new Promise<Element | null>((resolve) => {
		const el = getElement(query);
		if (el) {
			return resolve(el);
		}

		const observer = new MutationObserver(() => {
			const el = getElement(query);
			if (el) {
				observer.disconnect();
				resolve(el);
			}
		});

		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
		});

		setTimeout(() => {
			observer.disconnect();
			resolve(null);
		}, timeout);
	});
}

export function resolveElement(target: string | Element | null): Element | null {
	if (target == null || isElement(target)) {
		return target;
	}
	return getElement(target);
}

export function getDocumentHeight(): number {
	return document.documentElement.scrollHeight;
}

export function getClientRect(element: Element | null): DOMRect | null {
	if (!element) {
		// return {
		// 	bottom: 0,
		// 	height: 0,
		// 	left: 0,
		// 	right: 0,
		// 	toJSON: () => {},
		// 	top: 0,
		// 	width: 0,
		// 	x: 0,
		// 	y: 0,
		// };
		return null;
	}
	return element.getBoundingClientRect();
}

export function scrollParent(element: Element | null): Element {
	while (element && element !== document.body) {
		const style = getComputedStyle(element);
		if (/(auto|scroll)/.test(style.overflowY)) return element;
		element = element.parentElement;
	}
	return document.scrollingElement || document.documentElement;
}

window.scrollTo();
