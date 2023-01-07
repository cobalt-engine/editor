import eslintPlugin from "@nabla/vite-plugin-eslint";
import autoprefixer from "autoprefixer";
import dns from "dns";
import postcssLogical from "postcss-logical";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { swcReactRefresh } from "vite-plugin-swc-react-refresh";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  server: {
    host: "localhost",
    port: 3000,
  },
  plugins: [swcReactRefresh(), svgr(), eslintPlugin()],
  esbuild: { jsx: "automatic" },
  css: {
    postcss: {
      plugins: [autoprefixer, postcssLogical],
    },
  },
});
