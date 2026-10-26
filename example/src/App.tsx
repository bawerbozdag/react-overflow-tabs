import { BookOpen, CircleHelp, GitBranch, Languages, Package, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOverflowTabs } from "react-overflow-tabs";
import CopyButton from "./CopyButton";
import { Basic, Chips, CustomAttribute, Disabled, Dynamic, ElementContainer, Pills, Rtl, Vertical } from "./demos";
import { langFromPath, LangProvider, pathForLang } from "./i18n";
import MoreMenu from "./MoreMenu";
import { LANG_NAMES, LANGS, messages } from "./messages";
import type { Lang } from "./messages";

const INSTALL_COMMAND = "npm install react-overflow-tabs";

interface IAppProps {
    // the language the server rendered; the client starts from the same one
    initialLang?: Lang;
}

export default function App({ initialLang = "en" }: IAppProps) {
    const [lang, setLang] = useState<Lang>(initialLang);
    // said to screen readers after the language was switched without a page load; empty until then
    const [announcement, setAnnouncement] = useState("");
    const m = messages[lang];
    const languagesRef = useRef<HTMLDivElement>(null);
    // the language list is a tab bar like the demos: languages that do not fit move into a "More" menu
    const { overflowKeys: hiddenLanguages, isOverflowing: hasHiddenLanguages } = useOverflowTabs({
        container: languagesRef,
    });
    const commandRef = useRef<HTMLElement>(null);

    // back / forward between /, /tr
    useEffect(() => {
        const onPopState = () => {
            const next = langFromPath(window.location.pathname);

            setLang(next);
            setAnnouncement(`${messages[next].language}: ${LANG_NAMES[next]}`);
        };

        window.addEventListener("popstate", onPopState);

        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    // the server already rendered these for the first language; keep them in sync after switching
    useEffect(() => {
        document.documentElement.lang = m.htmlLang;
        document.title = m.meta.title;
        document.querySelector('meta[name="description"]')?.setAttribute("content", m.meta.description);
    }, [m]);

    const switchTo = (next: Lang) => {
        if (next !== lang) {
            window.history.pushState(null, "", pathForLang(next));
            setLang(next);
            setAnnouncement(`${messages[next].language}: ${LANG_NAMES[next]}`);
        }
    };

    return (
        <LangProvider value={lang}>
            <div className="container page">
                <a className="skip-link" href="#content">
                    {m.ui.skipToContent}
                </a>

                <header className="hero">
                    <div className="topbar">
                        <span className="logo" aria-hidden="true">
                            <img src="/favicon-128x128.png" width="36" height="36" alt="" />
                        </span>
                        <nav className="lang-switch" aria-label={m.language}>
                            <Languages size={16} className="lang-icon" />
                            {/* every language stays a real link (crawlers follow them); those that do not fit are
                                hidden here and offered in the menu */}
                            <div ref={languagesRef} className="lang-list">
                                {LANGS.map((code) => (
                                    <a
                                        key={code}
                                        href={pathForLang(code)}
                                        hrefLang={messages[code].htmlLang}
                                        lang={messages[code].htmlLang}
                                        data-overflow-key={code}
                                        aria-current={code === lang ? "true" : undefined}
                                        style={{ visibility: hiddenLanguages.includes(code) ? "hidden" : "visible" }}
                                        tabIndex={hiddenLanguages.includes(code) ? -1 : undefined}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            switchTo(code);
                                        }}
                                    >
                                        {LANG_NAMES[code]}
                                    </a>
                                ))}
                            </div>
                            {hasHiddenLanguages && (
                                <MoreMenu
                                    keys={hiddenLanguages}
                                    // when the current language is in the menu, the trigger names it
                                    label={
                                        hiddenLanguages.includes(lang)
                                            ? LANG_NAMES[lang]
                                            : m.ui.more(hiddenLanguages.length)
                                    }
                                    triggerLabel={
                                        hiddenLanguages.includes(lang)
                                            ? `${m.language}: ${LANG_NAMES[lang]}`
                                            : undefined
                                    }
                                    triggerLang={hiddenLanguages.includes(lang) ? messages[lang].htmlLang : undefined}
                                    triggerClassName="lang-more"
                                    isActive={(code) => code === lang}
                                    onSelect={(code) => switchTo(code as Lang)}
                                    itemLabel={(code) => LANG_NAMES[code as Lang]}
                                    itemLang={(code) => messages[code as Lang].htmlLang}
                                />
                            )}
                        </nav>
                    </div>
                    <h1>react-overflow-tabs</h1>
                    {/* list-style: none drops the list semantics in some screen readers; the role puts them back */}
                    <ul className="badges" role="list">
                        <li>&lt; 1 kB</li>
                        <li>0 deps</li>
                        <li>TypeScript</li>
                        <li>SSR</li>
                        <li>React 18 · 19</li>
                    </ul>
                    <p className="lead">{m.header.description}</p>
                    <p className="install">
                        <span className="command">
                            <code ref={commandRef} translate="no">
                                <Terminal size={16} />
                                {INSTALL_COMMAND}
                            </code>
                            <CopyButton text={INSTALL_COMMAND} target={commandRef} />
                        </span>
                        <a href="https://github.com/bawerbozdag/react-overflow-tabs#readme">
                            <BookOpen size={16} />
                            {m.header.docs}
                        </a>
                        <a href="https://www.npmjs.com/package/react-overflow-tabs">
                            <Package size={16} />
                            npm
                        </a>
                        <a href="https://github.com/bawerbozdag/react-overflow-tabs">
                            <GitBranch size={16} />
                            GitHub
                        </a>
                    </p>
                </header>

                {/* remount on language change: demo state (active tab, tab labels) is language specific.
                    The header stays mounted, so the focus remains on the language link that was used */}
                <main id="content" tabIndex={-1} key={lang}>
                    <div className="row g-5 items-start demos">
                        <Basic />
                        <Pills />
                        <Dynamic />
                        <CustomAttribute />
                        <ElementContainer />
                        <Rtl />
                        <Vertical />
                        <Chips />
                        <Disabled />
                        <div className="col-12">
                            <section className="card faq" aria-labelledby="faq-title">
                                <h2 id="faq-title">
                                    <span className="demo-icon">
                                        <CircleHelp size={18} />
                                    </span>
                                    {m.faq.title}
                                </h2>
                                {m.faq.items.map(({ question, answer }) => (
                                    <article key={question} className="faq-item">
                                        <h3>{question}</h3>
                                        <p>{answer}</p>
                                    </article>
                                ))}
                            </section>
                        </div>
                    </div>
                </main>

                <footer className="footer">
                    MIT © <a href="https://github.com/bawerbozdag">Baver Bozdağ</a>
                </footer>

                <p className="sr-only" role="status">
                    {announcement}
                </p>
            </div>
        </LangProvider>
    );
}
