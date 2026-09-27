import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useOverflowTabs } from "../src";

// minimal IntersectionObserver stand-in: tests decide each tab's intersection ratio
class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    readonly observed = new Set<Element>();

    constructor(
        private readonly callback: IntersectionObserverCallback,
        readonly options: IntersectionObserverInit = {},
    ) {
        MockIntersectionObserver.instances.push(this);
    }

    observe(target: Element) {
        this.observed.add(target);
    }

    unobserve(target: Element) {
        this.observed.delete(target);
    }

    disconnect() {
        this.observed.clear();
    }

    trigger(ratios: Record<string, number>, attribute = "data-overflow-key") {
        const entries = [...this.observed]
            .filter((target) => (target.getAttribute(attribute) ?? "") in ratios)
            .map((target) => {
                const intersectionRatio = ratios[target.getAttribute(attribute)!];

                return { target, intersectionRatio, isIntersecting: intersectionRatio > 0 };
            });

        act(() => this.callback(entries as unknown as IntersectionObserverEntry[], this as never));
    }
}

const latestObserver = () => MockIntersectionObserver.instances[MockIntersectionObserver.instances.length - 1];

const createContainer = (keys: string[], attribute = "data-overflow-key") => {
    const container = document.createElement("div");

    for (const key of keys) {
        container.appendChild(createTab(key, attribute));
    }

    document.body.appendChild(container);

    return container;
};

const createTab = (key: string, attribute = "data-overflow-key") => {
    const tab = document.createElement("button");
    tab.setAttribute(attribute, key);

    return tab;
};

beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
});

describe("useOverflowTabs", () => {
    it("reports every tab as visible before measurement", async () => {
        const container = createContainer(["a", "b", "c"]);
        const { result } = renderHook(() => useOverflowTabs({ container }));

        await waitFor(() => expect(result.current.visibleKeys).toEqual(["a", "b", "c"]));
        expect(result.current.overflowKeys).toEqual([]);
        expect(result.current.isOverflowing).toBe(false);
    });

    it("reports overflow keys in DOM order regardless of history", async () => {
        const container = createContainer(["a", "b", "c", "d"]);
        const { result } = renderHook(() => useOverflowTabs({ container }));
        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        latestObserver().trigger({ a: 1, b: 1, c: 0, d: 0 });
        expect(result.current.overflowKeys).toEqual(["c", "d"]);

        // container grows, then shrinks again
        latestObserver().trigger({ c: 1 });
        latestObserver().trigger({ b: 0.4, c: 0 });

        expect(result.current.visibleKeys).toEqual(["a"]);
        expect(result.current.overflowKeys).toEqual(["b", "c", "d"]);
        expect(result.current.isOverflowing).toBe(true);
    });

    it("treats sub-pixel rounding as fully visible", async () => {
        const container = createContainer(["a", "b"]);
        const { result } = renderHook(() => useOverflowTabs({ container }));
        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        latestObserver().trigger({ a: 0.9995, b: 0.5 });

        expect(result.current.visibleKeys).toEqual(["a"]);
        expect(result.current.overflowKeys).toEqual(["b"]);
    });

    it("observes tabs added after mount", async () => {
        const container = createContainer(["a"]);
        const { result } = renderHook(() => useOverflowTabs({ container }));
        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        container.appendChild(createTab("b"));

        await waitFor(() => expect(result.current.visibleKeys).toEqual(["a", "b"]));
        expect([...latestObserver().observed]).toHaveLength(2);

        latestObserver().trigger({ b: 0 });
        expect(result.current.overflowKeys).toEqual(["b"]);
    });

    it("forgets tabs removed after mount", async () => {
        const container = createContainer(["a", "b", "c"]);
        const { result } = renderHook(() => useOverflowTabs({ container }));
        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        latestObserver().trigger({ a: 1, b: 0, c: 0 });
        expect(result.current.overflowKeys).toEqual(["b", "c"]);

        container.querySelector('[data-overflow-key="c"]')!.remove();

        await waitFor(() => expect(result.current.overflowKeys).toEqual(["b"]));
        expect(result.current.visibleKeys).toEqual(["a"]);
        expect([...latestObserver().observed]).toHaveLength(2);
    });

    it("picks up key changes", async () => {
        const container = createContainer(["a", "b"]);
        const { result } = renderHook(() => useOverflowTabs({ container }));
        await waitFor(() => expect(result.current.visibleKeys).toEqual(["a", "b"]));

        container.querySelector('[data-overflow-key="b"]')!.setAttribute("data-overflow-key", "z");

        await waitFor(() => expect(result.current.visibleKeys).toEqual(["a", "z"]));
    });

    it("resolves a ref attached after the first render", async () => {
        const ref: { current: HTMLDivElement | null } = { current: null };
        const { result, rerender } = renderHook(() => useOverflowTabs({ container: ref }));

        expect(result.current.visibleKeys).toEqual([]);

        ref.current = createContainer(["a", "b"]);
        rerender();

        await waitFor(() => expect(result.current.visibleKeys).toEqual(["a", "b"]));
    });

    it("supports a custom attribute, with or without brackets", async () => {
        const container = createContainer(["x", "y"], "data-tab");

        for (const tabSelector of ["data-tab", "[data-tab]"]) {
            const { result, unmount } = renderHook(() => useOverflowTabs({ container, tabSelector }));
            await waitFor(() => expect(result.current.visibleKeys).toEqual(["x", "y"]));

            latestObserver().trigger({ y: 0 }, "data-tab");
            expect(result.current.overflowKeys).toEqual(["y"]);

            unmount();
        }
    });

    it("rejects selectors that are not attribute names", () => {
        const container = createContainer([]);

        expect(() => renderHook(() => useOverflowTabs({ container, tabSelector: ".tab" }))).toThrow(
            /invalid tabSelector/,
        );
        expect(() => renderHook(() => useOverflowTabs({ container, tabSelector: '[data-x="1"]' }))).toThrow(
            /invalid tabSelector/,
        );
    });

    it("reports all tabs as visible while disabled", async () => {
        const container = createContainer(["a", "b"]);
        const { result, rerender } = renderHook(({ disabled }) => useOverflowTabs({ container, disabled }), {
            initialProps: { disabled: false },
        });
        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        latestObserver().trigger({ b: 0 });
        expect(result.current.overflowKeys).toEqual(["b"]);

        rerender({ disabled: true });

        await waitFor(() => expect(result.current.overflowKeys).toEqual([]));
        expect(result.current.visibleKeys).toEqual(["a", "b"]);
        expect(result.current.isOverflowing).toBe(false);
    });

    it("does not crash without IntersectionObserver", async () => {
        vi.stubGlobal("IntersectionObserver", undefined);

        const container = createContainer(["a", "b"]);
        const { result } = renderHook(() => useOverflowTabs({ container }));

        await waitFor(() => expect(result.current.visibleKeys).toEqual(["a", "b"]));
    });

    it("keeps the same state object when nothing changed", async () => {
        const container = createContainer(["a", "b"]);
        const { result } = renderHook(() => useOverflowTabs({ container }));
        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        latestObserver().trigger({ b: 0 });
        const before = result.current;

        latestObserver().trigger({ a: 1, b: 0.2 });
        expect(result.current).toBe(before);
    });

    it("disconnects the observer on unmount", async () => {
        const container = createContainer(["a"]);
        const { unmount } = renderHook(() => useOverflowTabs({ container }));
        await waitFor(() => expect(MockIntersectionObserver.instances).toHaveLength(1));

        unmount();

        expect(latestObserver().observed.size).toBe(0);
    });
});
