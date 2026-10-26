import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useOverflowTabs } from "react-overflow-tabs";
import { useDemoTitleId } from "./Demo";
import { useMessages } from "./i18n";
import MoreMenu from "./MoreMenu";

interface ITabBarProps {
    tabs: string[];
    active: string;
    onSelect: (tab: string) => void;
    disabled?: boolean;
    variant?: "line" | "pills";
    dir?: "ltr" | "rtl";
    // attribute that marks a tab; the key is its value
    tabSelector?: string;
    // leading icon of a tab, in the bar and in the "More" menu
    icon?: (tab: string) => ReactNode;
    // language of the tab labels when it differs from the page
    tabLang?: string;
    // hand the hook the container as a ref (default) or as the element itself
    container?: "ref" | "element";
}

// A tab list with the keyboard behaviour of the ARIA tabs pattern: one tab stop, arrows / Home / End move between the
// tabs that are shown. The tabs that overflowed are not reachable here, they live in the "More" list.
export default function TabBar({
    tabs,
    active,
    onSelect,
    disabled,
    variant = "line",
    dir,
    tabSelector = "data-overflow-key",
    icon,
    tabLang,
    container = "ref",
}: ITabBarProps) {
    const m = useMessages();
    const titleId = useDemoTitleId();
    const uid = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const fallbackRef = useRef<HTMLDivElement>(null);
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const byElement = container === "element";

    const { overflowKeys, isOverflowing } = useOverflowTabs({
        container: byElement ? (element ?? fallbackRef) : containerRef,
        disabled,
        tabSelector,
    });

    // the attribute name comes from tabSelector (brackets stripped)
    const attribute = tabSelector.replace(/^\[|\]$/g, "");
    const tabId = (index: number) => `${uid}-tab-${index}`;
    const panelId = `${uid}-panel`;

    // roving tabindex: the active tab is the tab stop, or the first shown one when the active tab overflowed
    const activeIndex = tabs.indexOf(active);
    const shown = tabs.filter((tab) => !overflowKeys.includes(tab));
    const stop = shown.includes(active) ? active : shown[0];

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const buttons = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')].filter(
            (button) => button.style.visibility !== "hidden",
        );
        const index = buttons.findIndex((button) => button === document.activeElement);
        // left / right swap in a right-to-left bar
        const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
        const backward = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
        const targets: Record<string, number> = {
            [forward]: (index + 1) % buttons.length,
            [backward]: (index - 1 + buttons.length) % buttons.length,
            Home: 0,
            End: buttons.length - 1,
        };

        if (index === -1 || !(event.key in targets)) {
            return;
        }

        const target = targets[event.key];

        event.preventDefault();
        buttons[target].focus();
        onSelect(buttons[target].getAttribute(attribute) ?? "");
    };

    return (
        <>
            <div className={`tabbar ${variant}`} dir={dir}>
                {/* the observed container: tabs that don't fully fit here are reported as overflowing */}
                <div
                    ref={byElement ? setElement : containerRef}
                    className="tabbar-tabs"
                    role="tablist"
                    aria-labelledby={titleId}
                    onKeyDown={onKeyDown}
                >
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            id={tabId(index)}
                            role="tab"
                            aria-selected={tab === active}
                            aria-controls={panelId}
                            {...{ [attribute]: tab }}
                            lang={tabLang}
                            // visibility (not display) keeps the tab in the layout, so the hook can tell when it fits again
                            className={`tab${tab === active ? " is-active" : ""}`}
                            style={{ visibility: overflowKeys.includes(tab) ? "hidden" : "visible" }}
                            tabIndex={tab === stop ? 0 : -1}
                            onClick={() => onSelect(tab)}
                        >
                            {icon?.(tab)}
                            {tab}
                        </button>
                    ))}
                </div>

                {isOverflowing && (
                    <MoreMenu
                        keys={overflowKeys}
                        label={m.ui.more(overflowKeys.length)}
                        isActive={(key) => key === active}
                        onSelect={onSelect}
                        icon={icon}
                        itemLang={tabLang}
                    />
                )}
            </div>

            {active && (
                <div
                    id={panelId}
                    role="tabpanel"
                    aria-labelledby={activeIndex >= 0 ? tabId(activeIndex) : undefined}
                    tabIndex={0}
                    className="panel"
                >
                    {m.ui.activeTab}{" "}
                    <b lang={tabLang} dir={dir}>
                        {active}
                    </b>
                </div>
            )}
        </>
    );
}
