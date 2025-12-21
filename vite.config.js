// xpell-ui/vite.config.ts
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const DEV_ALIAS = process.env.XPELL_DEV_ALIAS === "1";

  return {
    server: {
      port: 3001,
    },

    build: {
      lib: {
        entry: "./src/index.ts",
        name: "XpellUI",
        formats: ["es", "cjs", "umd"],
        fileName: (format) => `xpell-ui.${format}.js`,
      },

      target: "modules",
      minify: true,
      outDir: "dist",

      rollupOptions: {
        external: ["xpell-core", "animate.css"],
        output: {
          globals: {
            "xpell-core": "XpellCore",
            "animate.css": "animateCSS",
          },
          exports: "named",
        },
      },
    },

    resolve: {
      alias: DEV_ALIAS
        ? {
          // Dev-only convenience (avoid in published builds; can confuse TS/IDE)
          "xpell-ui": resolve(__dirname, "src"),
        }
        : {},
    },

    plugins: [
      dts({
        outputDir: "dist",
        insertTypesEntry: true,
        rollupTypes: false,
        staticImport: true,
        skipDiagnostics: false,
        logDiagnostics: true,
        exclude: ["public", "examples", "example", "**/dist", "**/types"],
      }),
    ],
  };
});
