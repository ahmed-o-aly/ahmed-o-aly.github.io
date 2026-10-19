import { defineConfig } from "vite";
import { copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  base: "./",
  // The WebXR and environment addons pull their own copy of three unless they are
  // prebundled with it; two copies break instanceof checks inside three.
  optimizeDeps: {
    include: [
      "three",
      "three/addons/geometries/RoundedBoxGeometry.js",
      "three/addons/controls/OrbitControls.js",
      "three/addons/environments/RoomEnvironment.js",
      "three/addons/webxr/XRControllerModelFactory.js",
    ],
  },
  server: { port: 5186, strictPort: true, fs: { allow: [".."] } },
  preview: { port: 4186, strictPort: true },
  build: { outDir: "../assets/apps/circuits-lab", emptyOutDir: true, chunkSizeWarningLimit: 900 },
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
