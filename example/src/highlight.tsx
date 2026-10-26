import type { ReactNode } from "react";

// a small TSX tokenizer; colors follow VS Code's Dark+ / Light+ themes (see styles.css).
// it is synchronous and pure, so server and client render identical markup (no hydration mismatch)
const TOKEN =
    // 1 comment | 2 string | 3 template | 4 tag open | 5 tag close | 6 arrow | 7 attribute | 8 identifier | 9 number | 10 brace
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*)|(\/?>)|(=>)|([A-Za-z_][\w-]*(?==[{"']))|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)|([{}])/g;

const CONTROL = new Set(["import", "export", "from", "return", "if", "else", "default", "await"]);
const STORAGE = new Set(["const", "let", "var", "function", "interface", "type", "new", "typeof", "async"]);
const CONSTANT = new Set(["true", "false", "null", "undefined"]);

const span = (key: string, className: string, text: string) => (
    <span key={key} className={className}>
        {text}
    </span>
);

const classifyIdentifier = (name: string, rest: string) => {
    if (CONTROL.has(name)) {
        return "tok-control";
    }

    if (STORAGE.has(name) || CONSTANT.has(name)) {
        return "tok-storage";
    }

    // call, including a generic call such as useState<string>(...)
    if (/^(?:<[^>\n]*>)?\(/.test(rest)) {
        return "tok-function";
    }

    if (/^[A-Z][A-Z0-9_]+$/.test(name)) {
        return "tok-constant";
    }

    return /^[A-Z]/.test(name) ? "tok-type" : "tok-variable";
};

// keyPrefix keeps keys unique when a template's ${…} is highlighted recursively into the same list
export default function highlight(code: string, keyPrefix = ""): ReactNode[] {
    const nodes: ReactNode[] = [];
    const regex = new RegExp(TOKEN);
    let cursor = 0;
    let inTag = false;
    let isClosingTag = false;
    // between `>` and the next `<` or `{`, JSX children are plain text, not code
    let inJsxText = false;
    const braces: boolean[] = [];
    let match: RegExpExecArray | null;

    const push = (className: string | null, text: string) =>
        nodes.push(className ? span(`${keyPrefix}${nodes.length}`, className, text) : text);

    while ((match = regex.exec(code))) {
        const [text, comment, string, template, tagOpen, tagClose, arrow, attribute, identifier, number, brace] = match;
        const index = match.index;

        // `<` right after a word (e.g. useRef<HTMLDivElement>) is a generic, not a JSX tag
        if (tagOpen && /[\w$)\]]/.test(code[index - 1] ?? "")) {
            regex.lastIndex = index + 1;
            continue;
        }

        if (index > cursor) {
            push(null, code.slice(cursor, index));
        }

        cursor = index + text.length;

        if (comment) {
            push("tok-comment", text);
        } else if (string) {
            push("tok-string", text);
        } else if (template) {
            // text is a string; ${…} are highlighted as code
            for (const part of text.split(/(\$\{[^}]*\})/)) {
                if (part.startsWith("${")) {
                    push("tok-storage", "${");
                    nodes.push(...highlight(part.slice(2, -1), `${keyPrefix}${nodes.length}.`));
                    push("tok-storage", "}");
                } else if (part) {
                    push("tok-string", part);
                }
            }
        } else if (tagOpen) {
            const name = tagOpen.replace(/^<\/?/, "");

            inTag = true;
            inJsxText = false;
            isClosingTag = tagOpen.startsWith("</");
            push("tok-punctuation", tagOpen.slice(0, tagOpen.length - name.length));
            push(/^[A-Z]/.test(name) ? "tok-type" : "tok-tag", name);
        } else if (tagClose) {
            push(inTag ? "tok-punctuation" : null, text);
            // after an opening tag (not `/>` or a closing tag) come the children
            inJsxText = inTag && text === ">" && !isClosingTag;
            inTag = false;
        } else if (arrow) {
            push(null, text);
        } else if (attribute && inTag) {
            push("tok-attribute", text);
        } else if (brace) {
            if (text === "{") {
                braces.push(inJsxText);
                inJsxText = false;
            } else {
                inJsxText = braces.pop() ?? false;
            }

            push(null, text);
        } else if (inJsxText) {
            push(null, text);
        } else if (identifier || attribute) {
            push(classifyIdentifier(text, code.slice(cursor)), text);
        } else if (number) {
            push("tok-number", text);
        }
    }

    if (cursor < code.length) {
        push(null, code.slice(cursor));
    }

    return nodes;
}
