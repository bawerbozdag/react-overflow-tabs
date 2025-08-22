import { RefObject } from "react";

// defines the overflow direction ("start" or "end")
export type TOverflowDirection = "start" | "end";

export interface IOverflowTabsOptions<T extends HTMLElement = HTMLElement> {
    /**
     * Container element:
     * - React ref (current: T | null)
     * - or direct element (via query selector)
     */
    container: RefObject<T | null> | T; // container to measure overflow
    /**
     * Attribute name for tabs.
     * Each tab must have this attribute with a unique value.
     * Default: "data-overflow-key" or "[data-overflow-key]"
     */
    tabSelector?: string;
    // temporarily disable overflow behavior
    disabled?: boolean; // default: false
}

export interface IOverflowState {
    // keys of currently visible items
    visibleKeys: string[];
    // keys of items pushed into overflow
    overflowKeys: string[];
    // indicates whether overflow is happening
    isOverflowing: boolean;
}
