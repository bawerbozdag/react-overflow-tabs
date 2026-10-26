import {
    ArrowLeftRight,
    Ban,
    Check,
    Code,
    File,
    LayoutPanelTop,
    ListFilter,
    ListPlus,
    PanelLeft,
    Pill,
    Plus,
    Shuffle,
    Tag,
    Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOverflowTabs } from "react-overflow-tabs";
import Demo from "./Demo";
import { MAILBOX_ICONS, TAB_ICONS } from "./icons";
import { rich, useMessages } from "./i18n";
import MoreMenu from "./MoreMenu";
import ResizableFrame from "./ResizableFrame";
import TabBar from "./TabBar";

// an icon for a label, by its position in the (translated) list the label comes from
const iconFor = (labels: string[], icons: LucideIcon[]) => (key: string) => {
    const Icon = icons[labels.indexOf(key)] ?? File;

    return <Icon size={16} />;
};

const ARABIC_TABS = ["نظرة عامة", "التحليلات", "التقارير", "العملاء", "المنتجات", "الطلبات", "الفواتير", "الإعدادات"];

const CHIPS = [
    "React",
    "TypeScript",
    "Next.js",
    "Remix",
    "Vite",
    "Tailwind",
    "Bootstrap",
    "MUI",
    "Chakra",
    "shadcn/ui",
];

export function Basic() {
    const m = useMessages();
    const tabIcon = iconFor(m.tabs, TAB_ICONS);
    const [active, setActive] = useState(m.tabs[0]);

    return (
        <Demo
            icon={LayoutPanelTop}
            title={m.demos.basic.title}
            description={rich(m.demos.basic.description)}
            code={`const containerRef = useRef<HTMLDivElement>(null);
const { overflowKeys, isOverflowing } = useOverflowTabs({ container: containerRef });

<div ref={containerRef} style={{ display: "flex", overflow: "hidden", minWidth: 0, flex: 1 }}>
    {TABS.map((tab) => (
        <button
            key={tab}
            data-overflow-key={tab}
            style={{ visibility: overflowKeys.includes(tab) ? "hidden" : "visible" }}
        >
            {tab}
        </button>
    ))}
</div>
{isOverflowing && <MoreMenu keys={overflowKeys} />}`}
        >
            <ResizableFrame>
                <TabBar tabs={m.tabs} active={active} onSelect={setActive} icon={tabIcon} />
            </ResizableFrame>
        </Demo>
    );
}

export function Pills() {
    const m = useMessages();
    const tabIcon = iconFor(m.tabs, TAB_ICONS);
    const [active, setActive] = useState(m.tabs[0]);

    return (
        <Demo
            icon={Pill}
            title={m.demos.pills.title}
            description={rich(m.demos.pills.description)}
            code={`<nav className="tabbar pills">
    {/* same markup and hook call as the basic example, only the CSS differs */}
</nav>`}
        >
            <ResizableFrame>
                <TabBar tabs={m.tabs} active={active} onSelect={setActive} variant="pills" icon={tabIcon} />
            </ResizableFrame>
        </Demo>
    );
}

export function Dynamic() {
    const m = useMessages();
    const tabIcon = iconFor(m.tabs, TAB_ICONS);
    const [tabs, setTabs] = useState(m.tabs.slice(0, 5));
    const [active, setActive] = useState(m.tabs[0]);
    const [counter, setCounter] = useState(1);

    const add = () => {
        setTabs((current) => [...current, m.ui.newTab(counter)]);
        setCounter((value) => value + 1);
    };
    const removeLast = () => {
        const next = tabs.slice(0, -1);

        setTabs(next);

        if (!next.includes(active)) {
            setActive(next[0] ?? "");
        }
    };
    const shuffle = () => setTabs((current) => [...current].sort(() => Math.random() - 0.5));

    return (
        <Demo
            icon={ListPlus}
            title={m.demos.dynamic.title}
            description={rich(m.demos.dynamic.description)}
            code={`// nothing special: change the tabs and the hook follows (MutationObserver)
setTabs((current) => [...current, "New tab"]);`}
        >
            <div className="actions">
                <button onClick={add}>
                    <Plus size={16} />
                    {m.ui.addTab}
                </button>
                <button onClick={removeLast} disabled={tabs.length === 0}>
                    <Trash2 size={16} />
                    {m.ui.removeLast}
                </button>
                <button onClick={shuffle}>
                    <Shuffle size={16} />
                    {m.ui.shuffle}
                </button>
            </div>
            <ResizableFrame>
                <TabBar tabs={tabs} active={active} onSelect={setActive} icon={tabIcon} />
            </ResizableFrame>
        </Demo>
    );
}

export function CustomAttribute() {
    const m = useMessages();
    const [active, setActive] = useState(m.tabs[0]);

    return (
        <Demo
            icon={Tag}
            title={m.demos.customAttribute.title}
            description={rich(m.demos.customAttribute.description)}
            code={`const { overflowKeys } = useOverflowTabs({
    container: containerRef,
    tabSelector: "[data-tab]", // or "data-tab"
});

<button data-tab="settings">Settings</button>`}
        >
            <ResizableFrame>
                <TabBar tabs={m.tabs} active={active} onSelect={setActive} tabSelector="[data-tab]" />
            </ResizableFrame>
        </Demo>
    );
}

export function ElementContainer() {
    const m = useMessages();
    const tabIcon = iconFor(m.tabs, TAB_ICONS);
    const [active, setActive] = useState(m.tabs[0]);

    return (
        <Demo
            icon={Code}
            title={m.demos.elementContainer.title}
            description={rich(m.demos.elementContainer.description)}
            code={`const [element, setElement] = useState<HTMLDivElement | null>(null);

const { overflowKeys } = useOverflowTabs({ container: element ?? fallbackRef });

<div ref={setElement}>…</div>`}
        >
            <ResizableFrame>
                {/* the hook gets the container element itself (from a callback ref inside TabBar) */}
                <TabBar tabs={m.tabs} active={active} onSelect={setActive} icon={tabIcon} container="element" />
            </ResizableFrame>
        </Demo>
    );
}

export function Vertical() {
    const m = useMessages();
    const mailboxIcon = iconFor(m.mailboxes, MAILBOX_ICONS);
    const containerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(m.mailboxes[0]);
    const { overflowKeys, isOverflowing } = useOverflowTabs({ container: containerRef });

    return (
        <Demo
            icon={PanelLeft}
            title={m.demos.vertical.title}
            description={rich(m.demos.vertical.description)}
            code={`const { overflowKeys, isOverflowing } = useOverflowTabs({ container: containerRef });

<aside style={{ display: "flex", flexDirection: "column", height: 220 }}>
    <div
        ref={containerRef}
        style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}
    >
        {ITEMS.map((item) => (
            <button
                key={item}
                data-overflow-key={item}
                style={{ visibility: overflowKeys.includes(item) ? "hidden" : "visible" }}
            >
                {item}
            </button>
        ))}
    </div>
    {isOverflowing && <MoreMenu keys={overflowKeys} />}
</aside>`}
        >
            {(titleId) => (
                <ResizableFrame axis="height">
                    <nav className="vbar" aria-labelledby={titleId}>
                        {/* flex: 1 + min-height: 0 let the list shrink; overflow: hidden clips what doesn't fit */}
                        <div ref={containerRef} className="vbar-list">
                            {m.mailboxes.map((item) => (
                                <button
                                    key={item}
                                    data-overflow-key={item}
                                    aria-current={item === active ? "true" : undefined}
                                    className={`vitem${item === active ? " is-active" : ""}`}
                                    style={{ visibility: overflowKeys.includes(item) ? "hidden" : "visible" }}
                                    tabIndex={overflowKeys.includes(item) ? -1 : 0}
                                    onClick={() => setActive(item)}
                                >
                                    {mailboxIcon(item)}
                                    {item}
                                </button>
                            ))}
                        </div>
                        {isOverflowing && (
                            <MoreMenu
                                keys={overflowKeys}
                                label={m.ui.more(overflowKeys.length)}
                                isActive={(key) => key === active}
                                onSelect={setActive}
                                triggerClassName="vitem"
                                icon={mailboxIcon}
                            />
                        )}
                    </nav>
                </ResizableFrame>
            )}
        </Demo>
    );
}

export function Rtl() {
    const m = useMessages();
    const [active, setActive] = useState(ARABIC_TABS[0]);

    return (
        <Demo
            icon={ArrowLeftRight}
            title={m.demos.rtl.title}
            description={rich(m.demos.rtl.description)}
            code={`<nav dir="rtl">…</nav>`}
        >
            <ResizableFrame dir="rtl">
                <TabBar tabs={ARABIC_TABS} active={active} onSelect={setActive} dir="rtl" tabLang="ar" />
            </ResizableFrame>
        </Demo>
    );
}

export function Chips() {
    const m = useMessages();
    const containerRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<string[]>(["React", "Vite"]);
    const { overflowKeys, isOverflowing } = useOverflowTabs({ container: containerRef });

    const toggle = (chip: string) =>
        setSelected((current) =>
            current.includes(chip) ? current.filter((item) => item !== chip) : [...current, chip],
        );

    return (
        <Demo
            icon={ListFilter}
            title={m.demos.chips.title}
            description={rich(m.demos.chips.description)}
            code={`const { overflowKeys } = useOverflowTabs({ container: containerRef });

<div ref={containerRef}>
    {CHIPS.map((chip) => <button key={chip} data-overflow-key={chip}>{chip}</button>)}
</div>
{isOverflowing && <MoreMenu keys={overflowKeys} label={\`+\${overflowKeys.length}\`} />}`}
        >
            {(titleId) => (
                <ResizableFrame>
                    <div role="group" aria-labelledby={titleId} className="chips">
                        <div ref={containerRef} className="chips-list">
                            {CHIPS.map((chip) => (
                                <button
                                    key={chip}
                                    data-overflow-key={chip}
                                    aria-pressed={selected.includes(chip)}
                                    className={`chip${selected.includes(chip) ? " is-active" : ""}`}
                                    style={{ visibility: overflowKeys.includes(chip) ? "hidden" : "visible" }}
                                    tabIndex={overflowKeys.includes(chip) ? -1 : 0}
                                    onClick={() => toggle(chip)}
                                >
                                    {selected.includes(chip) && <Check size={14} />}
                                    {chip}
                                </button>
                            ))}
                        </div>
                        {isOverflowing && (
                            <MoreMenu
                                keys={overflowKeys}
                                label={`+${overflowKeys.length}`}
                                triggerLabel={`+${overflowKeys.length}, ${m.ui.more(overflowKeys.length)}`}
                                selectedAs="pressed"
                                isActive={(key) => selected.includes(key)}
                                onSelect={toggle}
                                triggerClassName="chip"
                                chevron={false}
                            />
                        )}
                    </div>
                    <div className="panel" role="status">
                        {m.ui.selected} {selected.length ? selected.join(", ") : m.ui.none}
                    </div>
                </ResizableFrame>
            )}
        </Demo>
    );
}

export function Disabled() {
    const m = useMessages();
    const [active, setActive] = useState(m.tabs[0]);
    const [disabled, setDisabled] = useState(false);

    // while disabled, nothing is tracked, so the row just clips
    useEffect(() => {
        if (disabled) {
            setActive(m.tabs[0]);
        }
    }, [disabled, m]);

    return (
        <Demo
            icon={Ban}
            title={m.demos.disabled.title}
            description={rich(m.demos.disabled.description)}
            code={`const isMobile = useMediaQuery("(max-width: 640px)");

useOverflowTabs({ container: containerRef, disabled: isMobile });`}
        >
            <label className="check">
                <input
                    type="checkbox"
                    name="disabled"
                    checked={disabled}
                    onChange={(event) => setDisabled(event.target.checked)}
                />
                {m.ui.disabled}
            </label>
            <ResizableFrame>
                <TabBar tabs={m.tabs} active={active} onSelect={setActive} disabled={disabled} />
            </ResizableFrame>
        </Demo>
    );
}
