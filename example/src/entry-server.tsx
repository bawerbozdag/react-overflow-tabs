import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { renderHead } from "./head";
import { langFromPath } from "./i18n";
import { LANGS, messages } from "./messages";

export { renderLlms, renderSitemap } from "./head";
export const langs: string[] = LANGS;

// the language comes from the URL (/ => en, /tr => tr); head holds the language specific <title>, meta and JSON-LD
export const render = (url: string, siteUrl?: string) => {
    const lang = langFromPath(new URL(url, "http://localhost").pathname);

    return {
        // the language of the page (zh-CN, pt-BR…), not the URL code
        htmlLang: messages[lang].htmlLang,
        head: renderHead(lang, siteUrl),
        html: renderToString(
            <StrictMode>
                <App initialLang={lang} />
            </StrictMode>,
        ),
    };
};
