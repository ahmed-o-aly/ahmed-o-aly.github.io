import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  server: { fs: { allow: [".."] } },
  build: {
    outDir: "../assets/apps/bloch-lab",
    emptyOutDir: true,
    target: "es2022",
  },
});
