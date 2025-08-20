// defines the overflow direction ("start" or "end")
export type TOverflowDirection = "start" | "end";

export interface IOverflowTabsOptions<T extends HTMLElement = HTMLElement> {
    /**
     * Container element:
     * - React ref (current: T | null)
     * - or direct element (via query selector)
     */
    container: React.RefObject<T | null> | T; // container to measure overflow
    // CSS selector for items, each must have data-overflow-key
    tabSelector?: string; // default: '[data-overflow-key]'
    // which side overflow should occur (interpreted by LTR/RTL as start/end)
    overflowDirection?: TOverflowDirection; // default: "end"
    // keys that will never be hidden (pinned)
    pinnedKeys?: string[]; // default: []
    // minimum number of items that must stay visible
    minVisible?: number; // default: 0
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
