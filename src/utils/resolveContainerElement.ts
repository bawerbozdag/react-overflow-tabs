import type { IOverflowTabsOptions } from "../types";
import type { RefObject } from "react";

/**
 * Resolve container element from ref or element
 * Accepts either a React RefObject or a direct HTMLElement
 *
 * @param container A React ref or HTMLElement to resolve
 * @returns The actual HTMLElement instance, or null if not available
 */
const resolveContainerElement = <T extends HTMLElement = HTMLElement>(
    container: IOverflowTabsOptions<T>["container"],
): T | null => {
    // no container provided
    if (!container) {
        return null;
    }

    // if it's a React ref (has 'current'), return the current element
    if (typeof container === "object" && "current" in container) {
        return (container as RefObject<T>).current;
    }

    // otherwise, it's already an element
    return container as T;
};

export default resolveContainerElement;
