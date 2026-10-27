// Static export for hosts that cannot run server.js (Vercel and other static hosts): after `npm run build`, copies
// dist/client to dist/static and adds every language page and the generated SEO files. The HTML is the same the Node
// server sends; dist/client stays untouched, because server.js uses its index.html as the template.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fillTemplate } from "./page.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const clientDir = join(root, "dist/client");
const staticDir = join(root, "dist/static");
const { render, renderLlms, renderSitemap, langs } = await import(
    pathToFileURL(join(root, "dist/server/entry-server.js")).href
);

// the public origin: SITE_URL, else the production domain Vercel provides at build time (a bare host)
const origin =
    process.env.SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
const siteUrl = origin.replace(/\/+$/, "") || undefined;

if (siteUrl && !/^https?:\/\/[^/\s]+$/.test(siteUrl)) {
    throw new Error(`SITE_URL must be an origin such as https://example.com, got "${siteUrl}"`);
}

const write = async (path, body) => {
    const file = join(staticDir, path);

    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, body);
};

await rm(staticDir, { recursive: true, force: true });
await cp(clientDir, staticDir, { recursive: true });

const template = await readFile(join(clientDir, "index.html"), "utf-8");

for (const lang of langs) {
    // / is English, /<code> the other languages; each page is <dir>/index.html
    const dir = lang === "en" ? "" : lang;
    const page = render(`/${dir}`, siteUrl);

    await write(join(dir, "index.html"), fillTemplate(template, page));
    await write(join(dir, "llms.txt"), renderLlms(lang, siteUrl));
}

if (siteUrl) {
    const rules = await readFile(join(root, "public/robots.txt"), "utf-8");

    await write("robots.txt", `${rules.trimEnd()}\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
    await write("sitemap.xml", renderSitemap(siteUrl));
}

console.log(
    `Prerendered ${langs.length} pages${siteUrl ? ` for ${siteUrl}` : " (no SITE_URL: no canonical, hreflang or sitemap)"}`,
);
