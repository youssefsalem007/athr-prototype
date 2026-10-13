import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev proxy forwards /api to the Express server so the client can call
// relative /api paths in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
