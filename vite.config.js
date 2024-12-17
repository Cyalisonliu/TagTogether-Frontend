import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from `.env` file
dotenv.config();

// Access the environment variable directly using `process.env`
const backendUrl = process.env.VITE_BACKEND_URL;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
