/** Configuración general del sitio. */
export const site = {
  name: 'MTX',
  url: 'https://www.mtxbikes.com', // TODO dominio definitivo (también en astro.config.mjs)
  locale: 'es',
  /**
   * Endpoints de formularios (Formspree, Getform, un API propio, etc.).
   * Si están vacíos, los formularios validan y muestran el mensaje de éxito sin enviar nada.
   */
  forms: {
    partner: '', // TODO p. ej. https://formspree.io/f/xxxxxxx
    contact: '', // TODO
  },
  nav: [
    { id: 'home', label: 'HOME', href: '/' },
    { id: 'productos', label: 'PRODUCTOS', href: '/#productos' },
    { id: 'garantia', label: 'GARANTÍA', href: '/garantia/' },
    { id: 'servicios', label: 'SERVICIOS', href: '#contacto' }, // TODO: página de servicios (no está en el diseño)
  ],
};
