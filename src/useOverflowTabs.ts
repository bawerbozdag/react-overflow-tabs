import type { IOverflowState, IOverflowTabsOptions } from "./types";
import { useEffect, useState } from "react";
import resolveContainerElement from "./utils/resolveContainerElement";
import normalizeTabSelector from "./utils/normalizeTabSelector";

// a tab counts as visible once this much of it is inside the container
// (slightly below 1 to tolerate sub-pixel rounding)
const VISIBILITY_THRESHOLD = 0.999;

// state is shared between renders (and the initial one between hook instances), so it is frozen
const INITIAL_STATE: IOverflowState = Object.freeze({
    visibleKeys: Object.freeze([]) as unknown as string[],
    overflowKeys: Object.freeze([]) as unknown as string[],
    isOverflowing: false,
});

const isSameKeys = (a: string[], b: string[]) => a.length === b.length && a.every((key, index) => key === b[index]);

const isSameState = (a: IOverflowState, b: IOverflowState) =>
    isSameKeys(a.visibleKeys, b.visibleKeys) && isSameKeys(a.overflowKeys, b.overflowKeys);

const useOverflowTabs = <T extends HTMLElement = HTMLElement>({
    container,
    tabSelector,
    disabled = false,
}: IOverflowTabsOptions<T>): IOverflowState => {
    const [state, setState] = useState<IOverflowState>(INITIAL_STATE);
    const [containerEl, setContainerEl] = useState<T | null>(null);

    const attribute = normalizeTabSelector(tabSelector);

    // refs can be attached after the first render (e.g. conditional rendering),
    // so re-resolve the container after every commit; same element => no re-render
    useEffect(() => {
        setContainerEl(resolveContainerElement(container));
    });

    useEffect(() => {
        // only update state when keys actually changed
        const commit = (next: IOverflowState) => setState((prev) => (isSameState(prev, next) ? prev : next));

        if (!containerEl) {
            commit(INITIAL_STATE);

            return;
        }

        // tabs in DOM order
        let tabs: HTMLElement[] = [];

        // tabs that are NOT fully visible
        const overflowingTabs = new Set<Element>();

        const publish = () => {
            const visibleKeys: string[] = [];
            const overflowKeys: string[] = [];

            for (const tab of tabs) {
                const key = tab.getAttribute(attribute);

                if (key) {
                    (overflowingTabs.has(tab) ? overflowKeys : visibleKeys).push(key);
                }
            }

            commit(
                Object.freeze({
                    visibleKeys: Object.freeze(visibleKeys) as string[],
                    overflowKeys: Object.freeze(overflowKeys) as string[],
                    isOverflowing: overflowKeys.length > 0,
                }),
            );
        };

        // no IntersectionObserver (disabled, SSR, test envs) => every tab is reported as visible
        const intersectionObserver =
            disabled || typeof IntersectionObserver === "undefined"
                ? null
                : new IntersectionObserver(
                      (entries) => {
                          for (const entry of entries) {
                              if (entry.intersectionRatio < VISIBILITY_THRESHOLD) {
                                  overflowingTabs.add(entry.target);
                              }
                              //
                              else {
                                  overflowingTabs.delete(entry.target);
                              }
                          }

                          publish();
                      },
                      {
                          root: containerEl, // measure visibility relative to the container
                          threshold: VISIBILITY_THRESHOLD,
                      },
                  );

        // (re)collect tabs and keep the observed set in sync with the DOM
        const syncTabs = () => {
            const nextTabs = Array.from(containerEl.querySelectorAll<HTMLElement>(`[${attribute}]`));
            const nextTabSet = new Set(nextTabs);
            const prevTabSet = new Set(tabs);

            for (const tab of tabs) {
                if (!nextTabSet.has(tab)) {
                    intersectionObserver?.unobserve(tab);
                    overflowingTabs.delete(tab);
                }
            }

            for (const tab of nextTabs) {
                if (!prevTabSet.has(tab)) {
                    intersectionObserver?.observe(tab);
                }
            }

            tabs = nextTabs;

            publish();
        };

        syncTabs();

        // pick up tabs that are added, removed, reordered or re-keyed after mount
        const mutationObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver(syncTabs);

        mutationObserver?.observe(containerEl, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [attribute],
        });

        // cleanup
        return () => {
            intersectionObserver?.disconnect();
            mutationObserver?.disconnect();
        };
    }, [containerEl, attribute, disabled]);

    return state;
};

export default useOverflowTabs;
