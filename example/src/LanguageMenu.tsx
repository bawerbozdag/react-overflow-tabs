import { Check, ChevronDown, Languages } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import { pathForLang, useMessages } from "./i18n";
import { LANG_NAMES, LANGS, messages } from "./messages";
import type { Lang } from "./messages";

interface ILanguageMenuProps {
    current: Lang;
    onSelect: (lang: Lang) => void;
}

// The language control: a button that shows the current language and opens the list of all of them.
// The list is a disclosure, not an ARIA menu, and its items are real links, present in the HTML even while the list
// is closed (hidden): crawlers follow them, and Ctrl/Cmd/middle click opens a language in a new tab.
export default function LanguageMenu({ current, onSelect }: ILanguageMenuProps) {
    const m = useMessages();
    const rootRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listId = useId();
    const [open, setOpen] = useState(false);

    // close on an outside click, or on Escape (the focus goes back to the button when it was inside)
    useEffect(() => {
        if (!open) {
            return;
        }

        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);

                if (rootRef.current?.contains(document.activeElement)) {
                    triggerRef.current?.focus();
                }
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    // tabbing past the last language moves on to the page, so the list should not stay open behind it
    const onBlur = (event: FocusEvent<HTMLElement>) => {
        const next = event.relatedTarget as Node | null;

        if (next && !rootRef.current?.contains(next)) {
            setOpen(false);
        }
    };

    const choose = (event: MouseEvent<HTMLAnchorElement>, lang: Lang) => {
        // a modified click is the browser's: new tab, new window, download
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();
        onSelect(lang);
        setOpen(false);
        triggerRef.current?.focus();
    };

    return (
        <nav ref={rootRef} className="lang-switch" aria-label={m.language} onBlur={onBlur}>
            <button
                ref={triggerRef}
                type="button"
                className="lang-trigger"
                aria-expanded={open}
                aria-controls={listId}
                // the name contains the visible text, and says what the button is
                aria-label={`${m.language}: ${LANG_NAMES[current]}`}
                onClick={() => setOpen((value) => !value)}
            >
                <Languages size={16} className="lang-icon" />
                <span lang={messages[current].htmlLang}>{LANG_NAMES[current]}</span>
                <ChevronDown size={16} className={`chevron${open ? " is-open" : ""}`} />
            </button>

            <ul id={listId} className="more-menu" hidden={!open}>
                {LANGS.map((code) => (
                    <li key={code}>
                        <a
                            href={pathForLang(code)}
                            hrefLang={messages[code].htmlLang}
                            lang={messages[code].htmlLang}
                            aria-current={code === current ? "true" : undefined}
                            className={code === current ? "is-active" : undefined}
                            onClick={(event) => choose(event, code)}
                        >
                            <span>{LANG_NAMES[code]}</span>
                            {code === current && <Check size={16} className="check" />}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
