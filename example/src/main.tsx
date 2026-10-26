import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { langFromPath } from "./i18n";
import "./styles.css";

const root = document.getElementById("root")!;
const app = (
    <StrictMode>
        <App initialLang={langFromPath(window.location.pathname)} />
    </StrictMode>
);

// the SSR server marks the markup it rendered; otherwise mount from scratch
if (root.hasAttribute("data-ssr")) {
    hydrateRoot(root, app);
}
//
else {
    createRoot(root).render(app);
}
