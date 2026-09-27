import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    minify: true, // remove comments and gaps
    dts: {
        // tsup injects the deprecated `baseUrl` option, which TypeScript 6 rejects
        compilerOptions: { ignoreDeprecations: "6.0" },
    }, // generates types file
    clean: true,
    sourcemap: false,
    target: "es2019",
    external: ["react"], // peerDependency: react
});
