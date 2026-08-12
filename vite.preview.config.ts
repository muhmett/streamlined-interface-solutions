// Temporary config for building a single-file preview (published as an Artifact).
// Not part of the app's normal build — safe to delete.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  define: { "import.meta.env.VITE_HASH_ROUTER": JSON.stringify("1") },
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: "dist-preview",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
