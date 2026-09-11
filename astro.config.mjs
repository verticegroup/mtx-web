// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: dominio definitivo (se usa en canonical, Open Graph y JSON-LD)
  site: 'https://www.mtxbikes.com',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  // /productos/ no tiene diseño propio: lleva al carrusel del Home
  redirects: { '/productos': '/#productos' },
  devToolbar: { enabled: false },
});
