import { useEffect, useState } from "react";
import type { IOverflowState, IOverflowTabsOptions } from "./types";
import resolveContainerElement from "./utils/resolveContainerElement";
import normalizeTabSelector from "./utils/normalizeTabSelector";

const useOverflowTabs = <T extends HTMLElement = HTMLElement>(options: IOverflowTabsOptions<T>): IOverflowState => {
    //
    const [visibleKeys, setVisibleKeys] = useState<string[]>([]);
    const [overflowKeys, setOverflowKeys] = useState<string[]>([]);

    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

    useEffect(() => {
        // resolve container element once per render
        const containerEl = resolveContainerElement(options.container);

        if (!containerEl) {
            return;
        }

        // keeps eventKeys of tabs that are NOT fully visible
        const overflowingKeys = new Set<string>();

        const tabSelector = normalizeTabSelector(options.tabSelector);

        // observer to track each tab’s visibility inside the nav
        const observer = new IntersectionObserver(
            (entries) => {
                // flag to avoid unnecessary state updates
                let changed = false;

                for (const entry of entries) {
                    const eventKey = entry.target.getAttribute(tabSelector);

                    if (!eventKey) {
                        continue;
                    }

                    // track previous size to detect mutations
                    const prevSize = overflowingKeys.size;

                    // if not 100% visible, mark as hidden; else unmark
                    if (entry.intersectionRatio < 1) {
                        overflowingKeys.add(eventKey);
                    }
                    //
                    else {
                        overflowingKeys.delete(eventKey);
                    }

                    // toggle changed when set size differs
                    if (overflowingKeys.size != prevSize) {
                        changed = true;
                    }
                }

                // update overflow list once per IO tick
                if (changed) {
                    setOverflowKeys(Array.from(overflowingKeys).reverse());
                }
            },
            {
                root: containerEl, // measure visibility relative to the nav container
                threshold: 1, // require full visibility (100%)
            },
        );

        // observe all tabs marked by data-event-key
        const tabElements = Array.from(containerEl.querySelectorAll<HTMLElement>(`[${tabSelector}]`));

        tabElements.forEach((element) => observer.observe(element));

        // cleanup
        return () => {
            observer.disconnect();
        };
        //
    }, []);

    return {
        visibleKeys,
        overflowKeys,
        isOverflowing,
    };
};

export default useOverflowTabs;
