import { createContext } from "react";
import type { TourStore } from "../../types";

export const TourContext = createContext<TourStore>({
	metadata: { currentTourKey: null },
	tours: new Map(),
});
