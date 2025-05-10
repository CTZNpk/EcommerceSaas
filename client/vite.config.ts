import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true, // Ensure the same port is used
    allowedHosts: ["b868-119-155-0-208.ngrok-free.app"], // Add your ngrok host here
  },
});
