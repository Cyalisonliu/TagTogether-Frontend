import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL, // 後端服務的實際地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 去掉 `/api` 前綴 後端不用care
      },
    },
  },
  plugins: [react()],
});
