import { useContext } from "react";
import { TourContext } from "./context";
import { globalStore } from "./store";

export function useTours() {
	const context = useContext(TourContext);

	if (!context) {
		return globalStore;
	}

	return context.tours;
}
