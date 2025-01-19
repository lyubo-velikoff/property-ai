import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "shared-ui",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`
    },
    rollupOptions: {
      external: ["react", "react-dom", "@heroicons/react/24/outline"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@heroicons/react/24/outline": "HeroIcons"
        }
      }
    },
    watch: {
      include: ["src/**"]
    },
    cssCodeSplit: true
  },
  css: {
    modules: {
      localsConvention: "camelCase"
    }
  }
});
