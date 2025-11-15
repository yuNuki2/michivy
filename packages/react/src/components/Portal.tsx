import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
	container: Element | null;
	children: ReactNode;
}

export default function Portal(props: PortalProps) {
	const { container, children } = props;

	if (!container) {
		return null;
	}

	return createPortal(children, container);
}
