import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [vue()],
  server: {
    // Frontend will run on port 4002
    port: Number(process.env.PORT) || 4002,
  },
});
