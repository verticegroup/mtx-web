import type { ImageMetadata } from 'astro';

/** Todas las imágenes de src/assets, indexadas por ruta relativa ("models/rush-150/hero.webp"). */
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{webp,png,jpg,jpeg}', { eager: true });

export function asset(path: string): ImageMetadata {
  const m = files[`/src/assets/${path}`];
  if (!m) throw new Error(`Imagen no encontrada: src/assets/${path}`);
  return m.default;
}

export const hasAsset = (path: string) => Boolean(files[`/src/assets/${path}`]);

/** Imágenes bajo un prefijo, ordenadas por nombre ("models/rush-150/galeria/"). */
export function assetsIn(prefix: string): ImageMetadata[] {
  return Object.keys(files)
    .filter((k) => k.startsWith(`/src/assets/${prefix}`))
    .sort()
    .map((k) => files[k].default);
}
