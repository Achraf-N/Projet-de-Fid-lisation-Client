import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  /*
  server: {
    host: "0.0.0.0", // Allows access from local network
    port: 3000, // Optional: specify the port
  },
  */
  plugins: [react(), eslint()],
  optimizeDeps: {
    include: ["jwt-decode"], // Add this line to ensure Vite optimizes jwt-decode
  },
});
