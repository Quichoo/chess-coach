import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/eve": {
        target: "http://localhost:2000",
        changeOrigin: true,
      },
    },
  },
});
