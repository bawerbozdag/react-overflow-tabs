// the document around the server-rendered app: shared by the Node server (server.js) and the static export (prerender.js)
export const fillTemplate = (template, { htmlLang, head, html }, styles = "") => {
    if (!template.includes("<!--app-head-->")) {
        throw new Error("The template has no <!--app-head--> marker; was it already rendered?");
    }

    return (
        template
            // the head is rendered per language; the static <title> is only the fallback for plain SPA mode
            .replace(/<title>[\s\S]*?<\/title>/, "")
            .replace("<!--app-head-->", () => head + styles)
            .replace(/<html lang="[^"]*"/, `<html lang="${htmlLang}"`)
            // swap the static crawler fallback for the server-rendered app
            .replace(/<div id="root">[\s\S]*?<\/div>/, () => `<div id="root" data-ssr>${html}</div>`)
    );
};
