import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3001
  },

  build: {
    lib: {
      entry: "./src/index.ts",
      name: "XpellUI",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => `xpell-ui.${format}.js`
    },

    target: "modules",
    minify: true,
    outDir: "dist",

    rollupOptions: {
      external: ["xpell-core", "animate.css"], // externalized dependencies
      output: {
        globals: {
          "xpell-core": "XpellCore",
          "animate.css": "animateCSS"
        },
        exports: "named"
      }
    }
  },

  resolve: {
    alias: {
      // Internal dev import convenience
      "xpell-ui": resolve(__dirname, "src")
    }
  },

  plugins: [
    dts({
      outputDir: "types",
      insertTypesEntry: true,
      rollupTypes: false,        // ⬅️ turn OFF rollup / api-extractor integration
      staticImport: true,
      skipDiagnostics: false,
      logDiagnostics: true,
      exclude: ["public"]
    })
  ]
});
