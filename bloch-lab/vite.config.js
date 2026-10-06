import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  build: {
    outDir: "../assets/apps/bloch-lab",
    emptyOutDir: true,
    target: "es2022",
  },
});
