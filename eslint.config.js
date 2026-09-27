import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    { ignores: ["dist"] },
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["**/*.{js,ts,cjs,mjs}"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn", // disallow usage of the any type
            "@typescript-eslint/consistent-type-imports": "warn", // enforce consistent use of type imports
        },
    },
]);
