import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase"
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  optimizeDeps: {
    include: ["@avalon/shared-ui"]
  },
  server: {
    watch: {
      usePolling: true
    }
  }
});
