import { createContext, createElement, useContext } from "react";
import type { ReactNode } from "react";
import { LANGS, messages } from "./messages";
import type { Lang } from "./messages";

const LangContext = createContext<Lang>("en");

export const LangProvider = LangContext.Provider;

export const useLang = () => useContext(LangContext);

export const useMessages = () => messages[useLang()];

// "/" is English, "/tr" is Turkish
export const langFromPath = (pathname: string): Lang =>
    LANGS.find((lang) => lang !== "en" && (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`))) ?? "en";

export const pathForLang = (lang: Lang) => (lang === "en" ? "/" : `/${lang}`);

// renders the few inline tags used in message strings: <b>…</b> and <code>…</code>
export const rich = (text: string): ReactNode[] =>
    text
        .split(/(<b>.*?<\/b>|<code>.*?<\/code>)/)
        .filter(Boolean)
        .map((part, index) => {
            const tag = /^<(b|code)>(.*)<\/\1>$/.exec(part);

            return tag ? createElement(tag[1], { key: index }, tag[2]) : part;
        });
