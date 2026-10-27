import { Terminal } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import CopyButton from "./CopyButton";
import { useMessages } from "./i18n";

const PACKAGE = "react-overflow-tabs";

// the package has no install scripts and no dependencies, and installs the same way everywhere (checked with each)
const MANAGERS = [
    { name: "npm", command: `npm install ${PACKAGE}` },
    { name: "pnpm", command: `pnpm add ${PACKAGE}` },
    { name: "yarn", command: `yarn add ${PACKAGE}` },
    { name: "bun", command: `bun add ${PACKAGE}` },
];

const STORAGE_KEY = `${PACKAGE}:package-manager`;

// the longest command sets the width, so the box does not change size when another manager is picked
const COMMAND_WIDTH = `${Math.max(...MANAGERS.map((manager) => manager.command.length))}ch`;

export default function InstallCommand() {
    const m = useMessages();
    const uid = useId();
    const commandRef = useRef<HTMLElement>(null);
    // the server renders npm; a remembered choice is applied after hydration, so the markup always matches
    const [selected, setSelected] = useState(MANAGERS[0].name);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);

            if (MANAGERS.some((manager) => manager.name === saved)) {
                setSelected(saved as string);
            }
        } catch {
            // storage can be blocked (private mode, site settings): the choice just isn't remembered
        }
    }, []);

    const select = (name: string) => {
        setSelected(name);

        try {
            window.localStorage.setItem(STORAGE_KEY, name);
        } catch {
            // see above
        }
    };

    // arrows, Home and End move between the managers and select the one they land on
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const tabs = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')];
        const index = tabs.findIndex((tab) => tab === document.activeElement);
        const targets: Record<string, number> = {
            ArrowRight: (index + 1) % tabs.length,
            ArrowLeft: (index - 1 + tabs.length) % tabs.length,
            Home: 0,
            End: tabs.length - 1,
        };

        if (index === -1 || !(event.key in targets)) {
            return;
        }

        event.preventDefault();
        tabs[targets[event.key]].focus();
        select(MANAGERS[targets[event.key]].name);
    };

    const current = MANAGERS.find((manager) => manager.name === selected) ?? MANAGERS[0];

    return (
        <div className="command">
            <div className="command-tabs" role="tablist" aria-label={m.ui.packageManager} onKeyDown={onKeyDown}>
                {MANAGERS.map(({ name }) => (
                    <button
                        key={name}
                        id={`${uid}-tab-${name}`}
                        type="button"
                        role="tab"
                        className="command-tab"
                        aria-selected={name === selected}
                        aria-controls={`${uid}-panel`}
                        tabIndex={name === selected ? 0 : -1}
                        translate="no"
                        onClick={() => select(name)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div
                className="command-body"
                role="tabpanel"
                id={`${uid}-panel`}
                aria-labelledby={`${uid}-tab-${current.name}`}
            >
                <code ref={commandRef} translate="no">
                    <Terminal size={16} />
                    {/* the key restarts the fade-in whenever another manager is picked */}
                    <span key={current.name} className="command-text" style={{ minWidth: COMMAND_WIDTH }}>
                        {current.command}
                    </span>
                </code>
                <CopyButton text={current.command} target={commandRef} />
            </div>
        </div>
    );
}
