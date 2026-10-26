import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        // use the hook straight from source, so edits in ../src show up without a build
        alias: { "react-overflow-tabs": fileURLToPath(new URL("../src/index.ts", import.meta.url)) },
        // ../src would otherwise resolve its own copy of react from the root node_modules
        dedupe: ["react", "react-dom"],
    },
});
