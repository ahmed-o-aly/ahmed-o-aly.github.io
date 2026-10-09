import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  define: { __TRANSFORMER_AVAILABLE__: "true" },
  server: { host: "127.0.0.1", port: 5196, strictPort: true, fs: { allow: [".."] } },
  preview: { host: "127.0.0.1", port: 4196, strictPort: true },
  build: { outDir: "../assets/apps/power-systems-lab", emptyOutDir: true, chunkSizeWarningLimit: 1100 },
});
