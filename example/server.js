import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const clientDir = join(root, "dist/client");
// the port to try first; when it is taken the next free one is used (see listen below)
const preferredPort = Number(process.env.PORT) || 5173;
const MAX_PORT_ATTEMPTS = 20;
const isProduction = process.env.NODE_ENV === "production";

// public origin, e.g. SITE_URL=https://my-site.vercel.app; canonical / hreflang / sitemap need absolute URLs,
// so they are only emitted when it is set
const siteUrl = process.env.SITE_URL?.trim().replace(/\/+$/, "");

if (siteUrl && !/^https?:\/\/[^/\s]+$/.test(siteUrl)) {
    throw new Error(`SITE_URL must be an origin such as https://example.com, got "${siteUrl}"`);
}

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".webmanifest": "application/manifest+json",
    ".map": "application/json",
};

// dev: vite serves assets / HMR and transforms the template; prod: pre-built client and server bundles
let vite;
let productionTemplate;
let productionEntry;

// created first: vite's HMR WebSocket shares this server (and its port) instead of opening a port of its own,
// which collides with any other vite dev server on the machine
const server = createHttpServer((req, res) => {
    const pathname = new URL(req.url ?? "/", "http://localhost").pathname;

    // vite handles its own assets (/src/*, /@vite/*, public files); the generated SEO files and pages are ours
    if (vite && !/(?:^|\/)(?:robots\.txt|sitemap\.xml|llms\.txt)$/.test(pathname)) {
        vite.middlewares(req, res, () => handle(req, res));
    } else {
        handle(req, res);
    }
});

if (isProduction) {
    productionTemplate = await readFile(join(clientDir, "index.html"), "utf-8");
    productionEntry = await import(pathToFileURL(join(root, "dist/server/entry-server.js")).href);
} else {
    const { createServer: createViteServer } = await import("vite");

    vite = await createViteServer({ root, appType: "custom", server: { middlewareMode: true, hmr: { server } } });
}

const loadEntry = async () => productionEntry ?? vite.ssrLoadModule("/src/entry-server.tsx");

// serve a file from dist/client; resolves to false when there is none
const serveStatic = async (url, res) => {
    const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
    const file = join(clientDir, normalize(pathname));

    // stay inside dist/client, and leave "/" to the renderer
    if (!file.startsWith(clientDir) || pathname === "/" || extname(file) === ".html") {
        return false;
    }

    try {
        const body = await readFile(file);

        res.writeHead(200, {
            "Content-Type": MIME_TYPES[extname(file)] ?? "application/octet-stream",
            // hashed build output never changes
            "Cache-Control": pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
        }).end(body);

        return true;
    } catch {
        return false;
    }
};

const sendText = (res, type, body) =>
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "public, max-age=3600" }).end(body);

// robots.txt, sitemap.xml and llms.txt are generated, so they always match the languages and the public origin
const serveSeoFile = async (url, res) => {
    const pathname = new URL(url, "http://localhost").pathname;
    const entry = await loadEntry();

    if (pathname === "/robots.txt") {
        const rules = await readFile(join(root, "public/robots.txt"), "utf-8");

        sendText(res, MIME_TYPES[".txt"], siteUrl ? `${rules.trimEnd()}\n\nSitemap: ${siteUrl}/sitemap.xml\n` : rules);

        return true;
    }

    if (pathname === "/sitemap.xml" && siteUrl) {
        sendText(res, "application/xml; charset=utf-8", entry.renderSitemap(siteUrl));

        return true;
    }

    // /llms.txt is English, /<lang>/llms.txt the other languages
    const llms = /^(?:\/([a-z]{2}))?\/llms\.txt$/.exec(pathname);

    if (llms) {
        const lang = entry.langs.includes(llms[1] ?? "en") ? (llms[1] ?? "en") : null;

        if (lang) {
            sendText(res, MIME_TYPES[".txt"], entry.renderLlms(lang, siteUrl));

            return true;
        }
    }

    return false;
};

// in dev the stylesheet is imported by main.tsx, so it would only arrive with the script and the page would flash unstyled.
// Inline it into the HTML instead; vite's client finds this tag by its data-vite-dev-id and updates it in place (HMR keeps working).
// In production the built stylesheet is a render-blocking <link> in index.html already.
const devStyles = async () => {
    const id = join(root, "src/styles.css");
    const result = await vite.transformRequest("/src/styles.css?direct");

    return result ? `\n        <style type="text/css" data-vite-dev-id="${id}">${result.code}</style>` : "";
};

const renderPage = async (url) => {
    const template = isProduction
        ? productionTemplate
        : await vite.transformIndexHtml(url, await readFile(join(root, "index.html"), "utf-8"));
    const { render } = await loadEntry();
    const { htmlLang, head, html } = render(url, siteUrl);
    const styles = vite ? await devStyles() : "";

    return {
        htmlLang,
        page: template
            // the head is rendered per language; the static <title> is only the fallback for plain SPA mode
            .replace(/<title>[\s\S]*?<\/title>/, "")
            .replace("<!--app-head-->", () => head + styles)
            .replace(/<html lang="[^"]*"/, `<html lang="${htmlLang}"`)
            // swap the static crawler fallback for the server-rendered app
            .replace(/<div id="root">[\s\S]*?<\/div>/, () => `<div id="root" data-ssr>${html}</div>`),
    };
};

const handle = async (req, res) => {
    try {
        const url = req.url ?? "/";

        if (await serveSeoFile(url, res)) {
            return;
        }

        if (isProduction && (await serveStatic(url, res))) {
            return;
        }

        // anything that looks like a file but was not found is a 404, not the app
        if (extname(new URL(url, "http://localhost").pathname)) {
            res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");

            return;
        }

        const { htmlLang, page } = await renderPage(url);

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Content-Language": htmlLang }).end(page);
    } catch (error) {
        vite?.ssrFixStacktrace(error);
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain" }).end("Internal Server Error");
    }
};

// start on the preferred port, or the next free one: a dev server of this or another project on 5173 should not stop us
let port = preferredPort;
let attempt = 1;

const onError = (error) => {
    if (error.code !== "EADDRINUSE") {
        throw error;
    }

    if (attempt >= MAX_PORT_ATTEMPTS) {
        console.error(`No free port between ${preferredPort} and ${port}; set PORT to one that is free`);
        process.exit(1);
    }

    console.log(`Port ${port} is in use, trying ${port + 1}`);
    port += 1;
    attempt += 1;
    server.listen(port);
};

server.on("error", onError);
// bound once, and the port is read from the server: a callback per attempt would report every port that was tried
server.once("listening", () => {
    server.off("error", onError);
    console.log(
        `SSR example (${isProduction ? "production" : "development"}): http://localhost:${server.address().port}`,
    );

    if (siteUrl) {
        console.log(`SITE_URL: ${siteUrl}`);
    }
});
server.listen(port);
