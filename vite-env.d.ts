/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />

declare module "*.glb" {
  const src: string;
  export default src;
}
