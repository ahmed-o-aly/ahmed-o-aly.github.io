import { defineConfig } from "vite";
import { copyFileSync, mkdirSync } from "node:fs";
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
    // Lab 7 is its own room-scale page at /circuits-lab/lab7/; its breadboard-bench
    // alternative sits beside it at /circuits-lab/lab7-bench/ for instructors to compare
    rollupOptions: { input: { main: `${root}index.html`, lab7: `${root}lab7/index.html`, lab7bench: `${root}lab7-bench/index.html` } },
  },
  plugins: [
    {
      name: "include-instructor-designs",
      closeBundle() {
        const output = `${root}../assets/apps/circuits-lab/docs`;
        mkdirSync(output, { recursive: true });
        copyFileSync(`${root}docs/module-designs.md`, `${output}/module-designs.md`);
      },
    },
  ],
});
