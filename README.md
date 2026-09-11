# MTX — sitio web (Astro)

Sitio de la marca MTX construido a partir de `MTX_Website design_Final 280926.pdf`.
El escritorio está maquetado sobre el artboard de **1920 px** del diseño y escala de forma
proporcional (unidad `--u = 100cqw / 1920`). Por debajo de **1024 px** cambia a un layout
fluido pensado para móvil y tablet.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/ (HTML estático + imágenes optimizadas)
npm run preview
```

Requiere Node 18.20.8+ (recomendado Node 20 o 22).

## Páginas

| Ruta | Archivo | Diseño |
|---|---|---|
| `/` | `src/pages/index.astro` | Home (página 1 del PDF) |
| `/productos/<modelo>/` | `src/pages/productos/[slug].astro` | Producto (páginas 2 y 4) — se genera una por modelo |
| `/garantia/` | `src/pages/garantia.astro` | Garantía (página 3) |
| `/productos/` | redirección a `/#productos` | — |

Modelos: `aspen-150`, `aspen-200`, `metro-150`, `rush-150`, `way-150`.

## Dónde se editan los contenidos

- **Modelos** (nombres, estadísticas, ficha técnica, especiales, textos de galería, colores, precio): `src/data/models.ts`
- **Puntos de venta**: `src/data/dealers.ts`
- **Menú, dominio y endpoints de formularios**: `src/data/site.ts` (y `site` en `astro.config.mjs`)
- **Imágenes**: `src/assets/` (Astro las optimiza en el build; srcset + WebP)
  - `models/<slug>/hero.webp` foto del hero · `side-right-<color>.webp` / `side-left-<color>.webp` laterales del carrusel
  - `models/<slug>/360/<color>/NN.webp` fotos del visor 360° · `especiales.webp` foto con puntos
  - `models/<slug>/puntos/NN.webp` detalle de cada punto · `galeria/NN.webp` galería
- **Gráficos vectoriales** (logo, líneas, patrón de triángulos, mapa): `public/svg/`

## Tipografías (importante)

El diseño usa: **Good Times** (Bold Italic y Heavy Italic), **Ethnocentric**, **Satoshi**
(Light/Regular/Medium), **Tabular** (Light, con itálica) y **Roboto Mono**.

Mientras no estén los archivos definitivos, el sitio usa **subconjuntos extraídos del PDF**
(`public/fonts/_temp/`), que solo contienen los caracteres usados en el diseño. Para producción
copia estos archivos en `public/fonts/` con exactamente estos nombres (se cargan primero):

| Archivo | Fuente |
|---|---|
| `GoodTimes-BoldItalic.woff2` | Good Times Bold Italic (Typodermic — requiere licencia web) |
| `GoodTimes-HeavyItalic.woff2` | Good Times Heavy Italic (Typodermic — licencia web) |
| `Ethnocentric-Regular.woff2` | Ethnocentric (Typodermic — licencia web) |
| `Satoshi-Light.woff2`, `Satoshi-Regular.woff2`, `Satoshi-Medium.woff2` | Satoshi (gratis en fontshare.com) |
| `Tabular-Light.woff2`, `Tabular-LightItalic.woff2` | Tabular (gratis en fontshare.com) |
| `RobotoMono-Regular.woff2` | Roboto Mono (Google Fonts) |

Las métricas verticales están fijadas en `@font-face` (`ascent/descent-override`), así que
cambiar de archivo no mueve el layout. Cuando estén todas, borra `public/fonts/_temp/`.

## Formularios

"Become a partner" y "¿Preguntas?" validan en el navegador. Para que envíen, pon la URL de tu
servicio (Formspree, Getform, API propia…) en `src/data/site.ts → forms`. Se envían por `POST`
como `FormData`.

## Pendientes marcados en el código (`// TODO`)

- Precios reales (el diseño trae `6.000.000,00 $` como ejemplo).
- Textos de "Especiales" y del claim de galería para Aspen 150/200, Metro 150 y Way 150
  (el diseño solo trae los de la Rush 150; están redactados como borrador).
- Aspen 200: la ficha técnica dice 149.4 cc; por diámetro × carrera (67 × 55.7 mm) son 196.4 cc.
- Rush/Way: la ficha dice "Espuma (foam)120/80-17" en filtro de aire (parece un error de copiado).
- `Imagery/Singles/way150@3x.png` es la misma foto que la Metro 150 (scooter).
- Página de **Servicios** (no está en el diseño; hoy el menú lleva al bloque de contacto).
# mtx-web
