import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    target: "es2015",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          echarts: ["echarts"],
          "vue-vendor": ["vue", "vue-router"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["three", "echarts", "gsap"],
  },
});
