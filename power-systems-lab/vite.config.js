import { defineConfig } from "vite";
import { existsSync, createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";

// Only the local development server can read these two explicitly allowed files.
// Neither the public source directory nor the build output contains this mesh.
const privateRoot = fileURLToPath(new URL("../../asset-inspection/substation/preview/transformador/", import.meta.url));
const privateFiles = {
  "/__private__/transformer/manifest.json": ["manifest.json", "application/json"],
  "/__private__/transformer/transformador.glb": ["transformador.glb", "model/gltf-binary"],
};
export default defineConfig(({ command }) => ({
  base: "./",
  define: {
    __TRANSFORMER_AVAILABLE__: JSON.stringify(command === "serve" && existsSync(`${privateRoot}transformador.glb`)),
  },
  server: { host: "127.0.0.1", port: 5196, strictPort: true },
  preview: { host: "127.0.0.1", port: 4196, strictPort: true },
  build: { outDir: "../assets/apps/power-systems-lab", emptyOutDir: true, chunkSizeWarningLimit: 1100 },
  plugins: [
    {
      name: "local-transformer-only",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const pathname = new URL(request.url, "http://localhost").pathname;
          if (!pathname.startsWith("/__private__/")) return next();
          const allowed = privateFiles[pathname];
          if (!allowed || !existsSync(`${privateRoot}${allowed[0]}`)) {
            response.statusCode = 404;
            response.end("Local model unavailable");
            return;
          }
          response.setHeader("Content-Type", allowed[1]);
          response.setHeader("Cache-Control", "no-store");
          createReadStream(`${privateRoot}${allowed[0]}`).pipe(response);
        });
      },
    },
  ],
}));
