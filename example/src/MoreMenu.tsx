import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, ReactNode } from "react";

interface IMoreMenuProps {
    keys: string[];
    label: string;
    // accessible name of the trigger when its visible text says too little (a "+3" chip)
    triggerLabel?: string;
    isActive: (key: string) => boolean;
    onSelect: (key: string) => void;
    triggerClassName?: string;
    // chevron on the trigger (a "+N" chip has none)
    chevron?: boolean;
    // leading icon of a menu item
    icon?: (key: string) => ReactNode;
    // how a selected item is announced: the current one of a list, or a toggle that is on
    selectedAs?: "current" | "pressed";
    // language of the item labels when it differs from the page: one for all, or one per item
    itemLang?: string | ((key: string) => string | undefined);
    // the text of an item, when it is not the key itself (a language code shown as the language's name)
    itemLabel?: (key: string) => ReactNode;
    // language of the trigger's text when it differs from the page
    triggerLang?: string;
}

// The overflow list. It is a disclosure (a button that shows and hides a list of buttons), not an ARIA menu: the
// items are ordinary tab stops and nothing needs arrow-key handling. It lives outside the observed container so it
// is never clipped.
export default function MoreMenu({
    keys,
    label,
    triggerLabel,
    isActive,
    onSelect,
    triggerClassName = "tab",
    chevron = true,
    icon,
    selectedAs = "current",
    itemLang,
    itemLabel,
    triggerLang,
}: IMoreMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listId = useId();
    const [open, setOpen] = useState(false);

    // focus goes back to the trigger when the list closes from inside it
    const close = (restoreFocus: boolean) => {
        setOpen(false);

        if (restoreFocus) {
            triggerRef.current?.focus();
        }
    };

    // close the list on outside click / Escape, or when another card's slider is moved
    useEffect(() => {
        if (!open) {
            return;
        }

        const closeIfOutside = (event: Event) => {
            const target = event.target as Element;
            const card = menuRef.current?.closest(".frame-wrap");

            // the slider of this card (data-keep-menu-open) doesn't count as "outside"; other cards' sliders do
            const isOwnSlider = target.closest("[data-keep-menu-open]") && card?.contains(target);

            if (!menuRef.current?.contains(target) && !isOwnSlider) {
                setOpen(false);
            }
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                // only take the focus back when it is in here; otherwise leave it where the user put it
                setOpen(false);

                if (menuRef.current?.contains(document.activeElement)) {
                    triggerRef.current?.focus();
                }
            }
        };

        document.addEventListener("pointerdown", closeIfOutside);
        // sliders can also be changed with the keyboard, which never fires pointerdown
        document.addEventListener("input", closeIfOutside);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("pointerdown", closeIfOutside);
            document.removeEventListener("input", closeIfOutside);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    // tabbing past the last item moves on to the next control, so the list should not stay open behind it.
    // (focus leaving to "nowhere", e.g. a click on plain text, is the pointer handler's business)
    const onBlur = (event: FocusEvent<HTMLDivElement>) => {
        const next = event.relatedTarget as Node | null;

        if (next && !menuRef.current?.contains(next)) {
            setOpen(false);
        }
    };

    const selectedAttribute = (key: string) =>
        isActive(key)
            ? selectedAs === "pressed"
                ? { "aria-pressed": true }
                : { "aria-current": "true" as const }
            : {};

    return (
        <div ref={menuRef} className="more" onBlur={onBlur}>
            <button
                ref={triggerRef}
                className={`${triggerClassName} more-trigger${keys.some(isActive) ? " is-active" : ""}`}
                aria-expanded={open}
                aria-controls={open ? listId : undefined}
                aria-label={triggerLabel}
                lang={triggerLang}
                onClick={() => setOpen((value) => !value)}
            >
                {label}
                {chevron && <ChevronDown size={16} className={`chevron${open ? " is-open" : ""}`} />}
            </button>

            {open && (
                <ul id={listId} className="more-menu">
                    {keys.map((key) => (
                        <li key={key}>
                            <button
                                lang={typeof itemLang === "function" ? itemLang(key) : itemLang}
                                {...selectedAttribute(key)}
                                className={isActive(key) ? "is-active" : ""}
                                onClick={() => {
                                    onSelect(key);
                                    close(true);
                                }}
                            >
                                {icon?.(key)}
                                <span>{itemLabel ? itemLabel(key) : key}</span>
                                {isActive(key) && <Check size={16} className="check" />}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
