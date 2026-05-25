import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

const localDefaultIndex = path.resolve(__dirname, "../default-templates/src/index.js");
const localPremiumIndex = path.resolve(__dirname, "../premium-templates/src/index.js");
const localRendererIndex = path.resolve(__dirname, "../template-renderer/src/index.jsx");

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("/three/") ||
              id.includes("/postprocessing/") ||
              id.includes("/ogl/") ||
              id.includes("/gsap/") ||
              id.includes("/framer-motion/") ||
              id.includes("/motion/")
            ) {
              return "vendor-graphics";
            }
            if (id.includes("/face-api.js/")) {
              return "vendor-face";
            }
            if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/react-router-dom/")) {
              return "vendor-react";
            }
            if (id.includes("/lucide-react/")) {
              return "vendor-icons";
            }
          }

          if (
            id.includes("/template-renderer/") ||
            id.includes("/default-templates/") ||
            id.includes("/premium-templates/")
          ) {
            return "templates-engine";
          }
        },
      },
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime.js"),
      "lucide-react": path.resolve(__dirname, "./node_modules/lucide-react"),
      "react-router-dom": path.resolve(__dirname, "./node_modules/react-router-dom"),
      gsap: path.resolve(__dirname, "./node_modules/gsap/index.js"),
      "framer-motion": path.resolve(__dirname, "./node_modules/framer-motion/dist/es/index.mjs"),
      "motion/react": path.resolve(__dirname, "./node_modules/motion/dist/es/react.mjs"),
      ogl: path.resolve(__dirname, "./node_modules/ogl/src/index.js"),
      postprocessing: path.resolve(__dirname, "./node_modules/postprocessing/build/index.js"),
      three: path.resolve(__dirname, "./node_modules/three/build/three.module.js"),
      "face-api.js": path.resolve(__dirname, "./node_modules/face-api.js/build/es6/index.js"),
      "portfolio-studio-default": localDefaultIndex,
      "portfolio-studio-premium": localPremiumIndex,
      "portfolio-template-renderer": localRendererIndex,
    },
  },
})
