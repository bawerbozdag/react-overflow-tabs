import { LANGS, messages } from "./messages";
import type { Lang } from "./messages";
import { pathForLang } from "./i18n";

const REPOSITORY = "https://github.com/bawerbozdag/react-overflow-tabs";
const NPM = "https://www.npmjs.com/package/react-overflow-tabs";
const IMAGE = "https://raw.githubusercontent.com/bawerbozdag/react-overflow-tabs/master/assets/demo.gif";

const escapeText = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const escapeAttribute = (value: string) => escapeText(value).replace(/"/g, "&quot;");

// "<" is escaped so the JSON can never close its own <script> tag
const jsonLd = (data: object) =>
    `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

// absolute URL of a language's page; needs the public origin, so it only exists when SITE_URL is configured
export const pageUrl = (siteUrl: string, lang: Lang) => `${siteUrl}${pathForLang(lang)}`;

// everything in <head> that depends on the language; rendered on the server for each request.
// canonical / hreflang / og:url are absolute URLs, so they are only emitted when the public origin is known
export const renderHead = (lang: Lang, siteUrl?: string) => {
    const { htmlLang, ogLocale, meta, faq } = messages[lang];
    const name = (key: string, value: string) => `<meta name="${key}" content="${escapeAttribute(value)}" />`;
    const property = (key: string, value: string) => `<meta property="${key}" content="${escapeAttribute(value)}" />`;

    const alternates = siteUrl
        ? [
              `<link rel="canonical" href="${escapeAttribute(pageUrl(siteUrl, lang))}" />`,
              ...LANGS.map(
                  (code) =>
                      `<link rel="alternate" hreflang="${messages[code].htmlLang}" href="${escapeAttribute(pageUrl(siteUrl, code))}" />`,
              ),
              `<link rel="alternate" hreflang="x-default" href="${escapeAttribute(pageUrl(siteUrl, "en"))}" />`,
              property("og:url", pageUrl(siteUrl, lang)),
          ]
        : [];

    return [
        `<title>${escapeText(meta.title)}</title>`,
        name("description", meta.description),
        name("keywords", meta.keywords),
        name("author", "Baver Bozdağ"),
        name("robots", "index, follow, max-image-preview:large, max-snippet:-1"),
        // the browser chrome follows the page theme
        `<meta name="theme-color" content="#f5f6fb" media="(prefers-color-scheme: light)" />`,
        `<meta name="theme-color" content="#0b0e15" media="(prefers-color-scheme: dark)" />`,
        ...alternates,
        property("og:type", "website"),
        property("og:site_name", "react-overflow-tabs"),
        property("og:locale", ogLocale),
        ...LANGS.filter((code) => code !== lang).map((code) =>
            property("og:locale:alternate", messages[code].ogLocale),
        ),
        property("og:title", meta.title),
        property("og:description", meta.description),
        property("og:image", IMAGE),
        property("og:image:alt", meta.imageAlt),
        name("twitter:card", "summary_large_image"),
        name("twitter:title", meta.title),
        name("twitter:description", meta.description),
        name("twitter:image", IMAGE),
        name("twitter:image:alt", meta.imageAlt),
        jsonLd({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            "name": "react-overflow-tabs",
            "description": meta.description,
            "inLanguage": htmlLang,
            "programmingLanguage": "TypeScript",
            "runtimePlatform": "React 18, React 19",
            "license": "https://opensource.org/licenses/MIT",
            "codeRepository": REPOSITORY,
            "url": NPM,
            "author": { "@type": "Person", "name": "Baver Bozdağ", "url": "https://github.com/bawerbozdag" },
            "keywords": meta.keywords,
        }),
        jsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": meta.title,
            "description": meta.description,
            "inLanguage": htmlLang,
            ...(siteUrl && { url: pageUrl(siteUrl, lang) }),
            "about": { "@type": "SoftwareSourceCode", "name": "react-overflow-tabs", "codeRepository": REPOSITORY },
        }),
        jsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": htmlLang,
            "mainEntity": faq.items.map(({ question, answer }) => ({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": { "@type": "Answer", "text": answer },
            })),
        }),
    ].join("\n        ");
};

// every language page with its alternates, so crawlers find all of them
export const renderSitemap = (siteUrl: string) => {
    const links = [
        ...LANGS.map(
            (code) =>
                `    <xhtml:link rel="alternate" hreflang="${messages[code].htmlLang}" href="${escapeAttribute(pageUrl(siteUrl, code))}" />`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeAttribute(pageUrl(siteUrl, "en"))}" />`,
    ].join("\n");

    const urls = LANGS.map(
        (code) => `  <url>\n    <loc>${escapeText(pageUrl(siteUrl, code))}</loc>\n${links}\n  </url>`,
    );

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
};

// llms.txt in the language of the page: what it is, where the docs are, and the FAQ answers an AI assistant can quote
export const renderLlms = (lang: Lang, siteUrl?: string) => {
    const { meta, header, faq } = messages[lang];

    return [
        "# react-overflow-tabs",
        "",
        `> ${meta.description}`,
        "",
        faq.items[0].answer,
        "",
        `## ${header.docs}`,
        `- [README](${REPOSITORY}#readme)`,
        `- [npm](${NPM})`,
        `- [GitHub](${REPOSITORY})`,
        ...(siteUrl ? [`- [${meta.title}](${pageUrl(siteUrl, lang)})`] : []),
        "",
        `## ${faq.title}`,
        ...faq.items.flatMap(({ question, answer }) => ["", `### ${question}`, answer]),
        "",
    ].join("\n");
};
