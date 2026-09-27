import type { RefObject } from "react";

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
     * Attribute name that marks tabs, with or without square brackets.
     * Each tab must have this attribute with a unique value, which is reported as its key.
     * Default: "data-overflow-key"
     */
    tabSelector?: string;
    /**
     * Temporarily disable overflow tracking; all tabs are reported as visible.
     * Default: false
     */
    disabled?: boolean;
}

export interface IOverflowState {
    // keys of currently visible items
    visibleKeys: string[];
    // keys of items pushed into overflow
    overflowKeys: string[];
    // indicates whether overflow is happening
    isOverflowing: boolean;
}
