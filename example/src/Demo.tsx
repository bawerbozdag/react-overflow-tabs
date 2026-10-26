import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createContext, useContext, useId } from "react";
import type { ReactNode } from "react";
import highlight from "./highlight";
import { useMessages } from "./i18n";

// the id of the demo's heading: tab bars, lists and chip rows use it as their accessible name
const DemoTitleContext = createContext<string | undefined>(undefined);

export const useDemoTitleId = () => useContext(DemoTitleContext);

interface IDemoProps {
    icon: LucideIcon;
    title: string;
    description: ReactNode;
    code: string;
    // a function receives the id of the heading, for markup that is not a component of its own
    children: ReactNode | ((titleId: string) => ReactNode);
}

export default function Demo({ icon: Icon, title, description, code, children }: IDemoProps) {
    const m = useMessages();
    const titleId = useId();

    return (
        // one column on phones, two from the lg breakpoint (tw-bootstrap-grid)
        <div className="col-12 lg:col-6">
            <section className="card demo" aria-labelledby={titleId}>
                <h2 id={titleId}>
                    <span className="demo-icon">
                        <Icon size={18} />
                    </span>
                    {title}
                </h2>
                <p>{description}</p>
                <DemoTitleContext.Provider value={titleId}>
                    {typeof children === "function" ? children(titleId) : children}
                </DemoTitleContext.Provider>
                <details className="code">
                    <summary>
                        <ChevronRight size={16} className="summary-chevron" />
                        {m.ui.showCode}
                    </summary>
                    {/* a scrollable block must be reachable by keyboard; code is never machine translated */}
                    <pre tabIndex={0} role="region" aria-label={`${m.ui.codeExample}: ${title}`} translate="no">
                        <code>{highlight(code)}</code>
                    </pre>
                </details>
            </section>
        </div>
    );
}
