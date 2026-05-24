import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
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
      "portfolio-studio-default/src": path.resolve(__dirname, "../default-templates/src/index.js"),
      "portfolio-studio-premium/src": path.resolve(__dirname, "../premium-templates/src/index.js"),
    },
  },
})
