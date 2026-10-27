import { BookOpen, CircleHelp, GitBranch, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Basic, Chips, CustomAttribute, Disabled, Dynamic, ElementContainer, Pills, Rtl, Vertical } from "./demos";
import { langFromPath, LangProvider, pathForLang } from "./i18n";
import InstallCommand from "./InstallCommand";
import LanguageMenu from "./LanguageMenu";
import { LANG_NAMES, messages } from "./messages";
import type { Lang } from "./messages";

interface IAppProps {
    // the language the server rendered; the client starts from the same one
    initialLang?: Lang;
}

export default function App({ initialLang = "en" }: IAppProps) {
    const [lang, setLang] = useState<Lang>(initialLang);
    // said to screen readers after the language was switched without a page load; empty until then
    const [announcement, setAnnouncement] = useState("");
    const m = messages[lang];

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
                        {/* the h1 below carries the name for assistive technology; this is the visual signature */}
                        <span className="logo" aria-hidden="true">
                            <img src="/favicon-128x128.png" width="36" height="36" alt="" />
                            <span className="logo-name" translate="no">
                                react-overflow-tabs
                            </span>
                        </span>
                        <LanguageMenu current={lang} onSelect={switchTo} />
                    </div>
                    {/* wide screens: the text on the left, the install box and the links on the right; narrow: stacked */}
                    <div className="row g-5 items-center hero-grid">
                        <div className="col-12 lg:col-7 hero-text">
                            <h1>react-overflow-tabs</h1>
                            <p className="lead">{m.header.description}</p>
                            {/* list-style: none drops the list semantics in some screen readers; the role puts them back */}
                            <ul className="badges" role="list">
                                <li>&lt; 1 kB</li>
                                <li>0 deps</li>
                                <li>TypeScript</li>
                                <li>SSR</li>
                                <li>React 18 · 19</li>
                            </ul>
                        </div>
                        <div className="col-12 lg:col-5">
                            <div className="install">
                                <InstallCommand />
                                <div className="install-links">
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
                                </div>
                            </div>
                        </div>
                    </div>
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
