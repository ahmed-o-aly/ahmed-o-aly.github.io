import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  base: "./",
  server: { port: 5186, strictPort: true, fs: { allow: [".."] } },
  preview: { port: 4186, strictPort: true },
  build: {
    outDir: "../assets/apps/circuits-lab",
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
    // the front page lists the two breadboard benches, each its own page:
    // Lab 7 at /circuits-lab/lab7-bench/ and Lab 8 at /circuits-lab/lab8/
    rollupOptions: { input: { main: `${root}index.html`, lab7bench: `${root}lab7-bench/index.html`, lab8: `${root}lab8/index.html` } },
  },
});
