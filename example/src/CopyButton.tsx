import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useMessages } from "./i18n";

// The Clipboard API only exists in secure contexts (https, localhost); elsewhere a temporary textarea and
// execCommand("copy") do the same job. Resolves to whether the text really reached the clipboard.
const writeToClipboard = async (text: string) => {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);

            return true;
        } catch {
            // permission denied or not allowed here: try the older way
        }
    }

    const previous = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");

    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position: fixed; top: 0; opacity: 0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);

    try {
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        area.remove();
        // the textarea took the focus; give it back to the button
        previous?.focus();
    }
};

// when nothing could be copied, leave the text selected so Ctrl/Cmd+C does it
const selectContents = (element: HTMLElement | null) => {
    const selection = window.getSelection();

    if (element && selection) {
        const range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

interface ICopyButtonProps {
    text: string;
    // the element that shows the text, selected when copying is not possible
    target?: RefObject<HTMLElement | null>;
}

export default function CopyButton({ text, target }: ICopyButtonProps) {
    const m = useMessages();
    const [copied, setCopied] = useState(false);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const copy = async () => {
        if (!(await writeToClipboard(text))) {
            selectContents(target?.current ?? null);

            return;
        }

        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <button type="button" className={`copy-button${copied ? " is-copied" : ""}`} onClick={copy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {/* both labels take up room, so the button does not change width when the text does;
                    the hidden one is also hidden from assistive technology */}
                <span className="copy-label">
                    <span className={copied ? "is-off" : undefined}>{m.ui.copy}</span>
                    <span className={copied ? undefined : "is-off"}>{m.ui.copied}</span>
                </span>
            </button>
            <span className="sr-only" role="status">
                {copied ? m.ui.copied : ""}
            </span>
        </>
    );
}
