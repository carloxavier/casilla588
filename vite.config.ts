/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH is set by the GitHub Pages workflow to "/casilla588/" so that
// asset URLs resolve correctly under the repo path. Local dev and the
// eventual custom-domain build leave it unset → resolves to "/".
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    css: false,
  },
});
