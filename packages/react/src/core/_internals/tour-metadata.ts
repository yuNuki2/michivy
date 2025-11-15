import type { TourMetadata } from "../../types";
import { atom } from "./useAtom";

export const TourMetadataAtom = atom<TourMetadata>({
	currentTourKey: null,
});
