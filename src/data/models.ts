/**
 * Catálogo MTX — fuente única de datos para Home (carrusel) y páginas de producto.
 *
 * Fuentes:
 *  - Fichas técnicas: "2. INFORMACION TECNICA/MTX_Fichas_Tecnicas_Consolidado.pdf"
 *  - Titulares y textos de galería: "4. DETALLES DESCRIPCION/MTX_Textos_Web_Mejorados.docx"
 *  - Especiales (puntos y posiciones): "3. DETALLES PUNTO/DETALLES MTX.pptx"
 *
 * Los campos marcados con `// TODO` son borradores o datos pendientes de confirmar.
 */

export type ColorId = 'rojo' | 'naranja' | 'unico';

export interface ModelColor {
  id: ColorId;
  label: string;
  hex: string;
  /** número de fotos 360 en src/assets/models/<slug>/360/<id>/ */
  frames: number;
}

export interface SpecGroup {
  title: string;
  /** ancho de la píldora en px del diseño (1920) para respetar el diseño */
  pill?: number;
  rows: [string, string][];
}

export interface Model {
  slug: string;
  name: string;
  /** "ASPEN 150: LISTA PARA IR MÁS ALLÁ" -> "LISTA PARA IR MÁS ALLÁ" */
  headline: string;
  subtitle: string;
  category: string;
  seoDescription: string;
  /** TODO: precios reales (el diseño trae un valor de ejemplo) */
  price: string | null;
  priceNote: string;
  colors: ModelColor[];
  stats: { cc: string; kw: string; vel: string; peso: string };
  transmission?: string[];
  specs: SpecGroup[];
  especiales: {
    copy: string[];
    items: string[];
    /** posición de cada punto en % sobre la imagen especiales.webp */
    spots: { x: number; y: number }[];
    aspect: number;
  };
  claim: [string, string, string];
  gallery: string[];
  heroAlt: string;
  /** placa de desenfoque pre-renderizada para los triángulos del hero (solo los modelos del diseño) */
  heroBlur?: string;
}

const RED: ModelColor = { id: 'rojo', label: 'Rojo', hex: '#E21E28', frames: 8 };
const ORANGE: ModelColor = { id: 'naranja', label: 'Naranja', hex: '#FF2000', frames: 8 };

const PILL = { MOTOR: 203, DIM: 515, RF: 371, AE: 617.6 };

const rushLikeMotor: [string, string][] = [
  ['No de cilindros', '1'],
  ['Disposición', 'Vertical'],
  ['Diámetro × carrera', '62 mm × 49.5 mm'],
  ['Cilindrada', '149 cc'],
  ['Relación de compresión', '9.2 : 1'],
  ['Ralentí', '1400 rpm'],
  ['Potencia máx. neta', '8.4 kW @ 8 500 rpm ≈ 11.3 HP'],
  ['Par máx. neto', '11.4 N·m @ 6 000 rpm'],
  ['Refrigeración', 'Por aire'],
  ['Combustible', 'Gasolina 90#'],
];
const rushLikeAE: [string, string][] = [
  // TODO: la ficha dice "Espuma (foam)120/80-17"; parece un error de copiado de la medida de la llanta
  ['Filtro de aire', 'Espuma (foam)'],
  ['Arranque en frío', 'Automático'],
  ['Fabricante encendido', 'CDI'],
  ['Tipo de encendido', 'CDI'],
  ['Pot. absorbida', '3.64 kW'],
  ['Velocidad máxima', '95 km/h'],
];
const aspenDims: [string, string][] = [
  ['Longitud total', '2 100 mm'],
  ['Ancho total', '785 mm'],
  ['Altura total', '1170 mm'],
  ['Distancia entre ejes', '1360 mm'],
  ['Altura de asiento', '875 mm'],
  ['Despeje al suelo', '250 mm'],
  ['Peso en orden de marcha', '118 kg'],
  ['Capacidad de tanque', '12 L'],
];
const aspenRF: [string, string][] = [
  ['Llanta delantera', '90/90-19'],
  ['Llanta trasera', '110/90-17'],
  ['Freno delantero', 'Disco'],
  ['Freno trasero', 'Disco'],
];
const aspenSys: [string, string][] = [
  ['Sistema de combustible', 'Carburador'],
  ['Encendido', 'CDI'],
  ['Arranque', 'Eléctrico / Pedal'],
  ['Velocidad máxima', '90 km/h'],
];

export const models: Model[] = [
  {
    slug: 'aspen-150',
    name: 'ASPEN 150',
    headline: 'LISTA PARA IR MÁS ALLÁ',
    subtitle: 'Doble propósito con el equilibrio perfecto entre ciudad y aventura.',
    category: 'Enduro · Doble Propósito · 150 cc',
    seoDescription: 'MTX Aspen 150: enduro doble propósito con el equilibrio perfecto entre ciudad y aventura. Ficha técnica, vista 360° y especiales.',
    price: '6.000.000,00 $', // TODO precio real
    priceNote: 'IMPUESTOS Y ENVIOS NO INCLUIDOS',
    colors: [RED, ORANGE],
    stats: { cc: '149 CC', kw: '8,5KW', vel: '90KM/H', peso: '118KG' },
    specs: [
      { title: 'MOTOR', pill: PILL.MOTOR, rows: [
        ['No de cilindros', '1'],
        ['Ciclo · refrigeración', '4T · Aire'],
        ['Distribución', 'Árbol de levas descendente'],
        ['Cilindrada', '149.4 cc'],
        ['Diámetro × carrera', '62 × 49.5 mm'],
        ['Relación de compresión', '9.2 : 1'],
        ['Potencia máx.', '8.5 kW @ 8 000 rpm ≈ 11.4 HP'],
        ['Par máx.', '10.0 N·m @ 7 500 rpm'],
      ] },
      { title: 'DIMENSIONES Y PESOS', pill: PILL.DIM, rows: aspenDims },
      { title: 'RUEDAS·FRENOS', pill: PILL.RF, rows: aspenRF },
      { title: 'SISTEMAS', rows: aspenSys },
    ],
    especiales: {
      // TODO: texto borrador (el diseño solo trae el de la Rush 150)
      copy: [
        'La MTX Aspen 150 es una enduro de doble propósito pensada para quienes se mueven entre la ciudad y la aventura. Su despeje de 250 mm y su rin delantero de 19" le permiten salir del asfalto con confianza.',
        'Tablero digital y análogo, cargador USB protegido de la lluvia, iluminación LED y baúl de amplia capacidad la convierten en una compañera lista para el día a día y para ir más allá.',
      ],
      items: ['Tablero digital y análogo', 'Baúl y parrilla trasera', 'Cargador USB', 'Soporte para celular', 'Guardamanos con luces integrada', 'Freno de disco delantero', 'Barras invertidas', 'Asiento ergonómico', 'Suspensión trasera Monoshock'],
      spots: [{x:70.38,y:30.2},{x:20.76,y:30.98},{x:60.51,y:26.92},{x:63.73,y:14.37},{x:65.66,y:24.03},{x:83.77,y:70.37},{x:75.78,y:62.14},{x:41.16,y:41.6},{x:40.95,y:58.88}],
      aspect: 3715 / 2476,
    },
    claim: ['LISTA PARA IR MÁS ALLÁ,', 'ENTRE CIUDAD Y AVENTURA,', 'SIENTE LA ASPEN 150.'], // TODO validar
    gallery: [
      'Tablero digital y análogo: tu información, siempre clara',
      'Cargador USB de fácil acceso, protegido de la lluvia',
      'Asiento ergonómico para largas jornadas de aventura',
      'Protector de mofle de lujo y calapiés estriados de mayor agarre',
      'Iluminación LED que te acompaña hasta en la noche más oscura',
      'Baúl de amplia capacidad: espacio de sobra para todo',
    ],
    heroAlt: 'Piloto en una MTX Aspen 150 por un camino destapado',
  },
  {
    slug: 'aspen-200',
    name: 'ASPEN 200',
    headline: 'MÁS POTENCIA, MISMA ACTITUD',
    subtitle: 'Más cilindraje y carácter para llegar siempre un paso más allá.',
    category: 'Enduro · Doble Propósito · 196.4 cc',
    seoDescription: 'MTX Aspen 200: más potencia, misma actitud. Enduro doble propósito de 196.4 cc. Ficha técnica, vista 360° y especiales.',
    price: '6.000.000,00 $', // TODO precio real
    priceNote: 'IMPUESTOS Y ENVIOS NO INCLUIDOS',
    colors: [RED, ORANGE],
    // TODO: la ficha trae cilindrada 149.4 cc (parece copiada de la 150); 67 × 55.7 mm = 196.4 cc
    stats: { cc: '196 CC', kw: '10KW', vel: '90KM/H', peso: '118KG' },
    specs: [
      { title: 'MOTOR', pill: PILL.MOTOR, rows: [
        ['No de cilindros', '1'],
        ['Ciclo · refrigeración', '4T · Aire'],
        ['Distribución', 'Árbol de levas desc. · eje balanceador'],
        ['Cilindrada', '196.4 cc'],
        ['Diámetro × carrera', '67 × 55.7 mm'],
        ['Relación de compresión', '9.2 : 1'],
        ['Potencia máx.', '10 kW @ 7 000 rpm ≈ 13.4 HP'],
        ['Par máx.', '13 N·m @ 5 500 rpm'],
      ] },
      { title: 'DIMENSIONES Y PESOS', pill: PILL.DIM, rows: aspenDims },
      { title: 'RUEDAS·FRENOS', pill: PILL.RF, rows: aspenRF },
      { title: 'SISTEMAS', rows: aspenSys },
    ],
    especiales: {
      // TODO: texto borrador
      copy: [
        'La MTX Aspen 200 lleva la fórmula de la Aspen a otro nivel: más cilindraje y más carácter para quienes quieren llegar siempre un paso más allá.',
        'Suspensión delantera invertida, soporte para celular, tablero digital y análogo e iluminación LED completan una doble propósito preparada para cualquier terreno.',
      ],
      items: ['Tablero digital y análogo', 'Baúl y parrilla trasera', 'Cargador USB', 'Soporte para celular', 'Guardamanos con luces integrada', 'Freno de disco delantero', 'Barras invertidas', 'Asiento ergonómico', 'Suspensión trasera Monoshock'],
      spots: [{x:70.41,y:31.89},{x:22.28,y:32.64},{x:60.84,y:28.7},{x:63.96,y:16.53},{x:65.83,y:25.89},{x:83.39,y:70.84},{x:75.65,y:62.86},{x:42.07,y:42.93},{x:41.87,y:59.69}],
      aspect: 3715 / 2476,
    },
    claim: ['MÁS POTENCIA,', 'MISMA ACTITUD,', 'SIENTE LA ASPEN 200.'], // TODO validar
    gallery: [
      'Soporte para celular, para nunca perder el rumbo',
      'Suspensión invertida que absorbe cualquier terreno',
      'Tablero digital y análogo, información siempre clara',
      'Protector de mofle de lujo y calapiés estriados de mayor agarre',
      'Iluminación LED que te acompaña hasta en la noche más oscura',
      'Baúl de amplia capacidad: espacio de sobra para todo',
    ],
    heroAlt: 'Piloto en una MTX Aspen 200 por un camino de montaña',
  },
  {
    slug: 'metro-150',
    name: 'METRO 150',
    headline: 'TU MEJOR ALIADA EN LA CIUDAD',
    subtitle: 'Practicidad, tecnología y estilo para moverte a diario.',
    category: 'Scooter Urbano · Motor 4T 157QMJ · 150 cc',
    seoDescription: 'MTX Metro 150: scooter urbano de 150 cc, tu mejor aliada en la ciudad. Ficha técnica, vista 360° y especiales.',
    price: '6.000.000,00 $', // TODO precio real
    priceNote: 'IMPUESTOS Y ENVIOS NO INCLUIDOS',
    colors: [{ id: 'unico', label: 'Gris', hex: '#A8AAAD', frames: 8 }],
    stats: { cc: '150 CC', kw: '7KW', vel: '85KM/H', peso: '94,5KG' },
    specs: [
      { title: 'MOTOR', pill: PILL.MOTOR, rows: [
        ['Tipo de motor', '157QMJ · monocilíndrico, 4T, refrigerado por aire'],
        ['Cilindrada', '150 cc'],
        ['Diámetro × carrera', '57,4 × 57,8 mm'],
        ['Relación de compresión', '9,2 : 1'],
        ['Potencia máxima', '7,0 kW (≈ 9,4 HP) @ 7.500 rpm'],
        ['Consumo', '2,9 L / 100 km'],
        ['Tanque de combustible', '6,8 L'],
      ] },
      { title: 'DIMENSIONES Y PESOS', pill: PILL.DIM, rows: [
        ['Dimensiones (L×An×Al)', '1.880 × 700 × 1.150 mm'],
        ['Distancia entre ejes', '1.300 mm'],
        ['Despeje al suelo', '110 mm'],
        ['Peso neto', '94,5 kg'],
        ['Carga máxima', '150 kg'],
      ] },
      { title: 'SUSPENSIÓN Y FRENOS', rows: [
        ['Suspensión delantera', 'Telescópica (doble)'],
        ['Suspensión trasera', 'Monoamortiguador'],
        ['Freno delantero', 'Disco'],
        ['Freno trasero', 'Tambor'],
      ] },
      { title: 'RENDIMIENTO', rows: [
        ['Velocidad máxima', '85 km/h'],
        ['Autonomía estimada', '≈ 234 km'],
      ] },
      { title: 'NEUMÁTICOS', rows: [
        ['Neumático delantero', '90/90-12'],
        ['Neumático trasero', '3.50-10'],
      ] },
    ],
    especiales: {
      // TODO: texto borrador
      copy: [
        'La MTX Metro 150 es un scooter urbano pensado para moverse a diario con practicidad, tecnología y estilo. Su motor 4T de 150 cc ofrece un consumo de 2,9 L/100 km y una autonomía estimada de unos 234 km.',
        'Tablero digital, baúl trasero con espaldar, soporte para celular y espejos con punto ciego hacen de la Metro 150 tu mejor aliada en la ciudad.',
      ],
      items: ['Pantalla digital', 'Soporte de celular', 'Baúl trasero con espaldar', 'Farola y direccionales LED', 'Freno de disco delantero', 'Suspensión trasera Monoshock', 'Espejos de punto ciego'],
      spots: [{x:68.11,y:32.18},{x:64.26,y:28.33},{x:15.61,y:36.03},{x:83.05,y:49.47},{x:84.98,y:67.54},{x:39.5,y:65.61},{x:62.33,y:23.04}],
      aspect: 1,
    },
    claim: ['MUÉVETE CON ESTILO,', 'RECORRE LA CIUDAD,', 'SIENTE LA METRO 150.'], // TODO validar
    gallery: [
      'Tablero digital con información clara y de calidad',
      'Baúl de amplia capacidad: espacio de sobra para todo',
      'Soporte para celular y espejos con punto ciego, para una conducción más segura',
      'Farola LED de estilo moderno que se roba las miradas',
      'Freno de disco delantero: frenado seguro en toda condición',
    ],
    heroAlt: 'Piloto en un scooter MTX Metro 150 por una calle mojada',
  },
  {
    slug: 'rush-150',
    name: 'RUSH 150',
    headline: 'DOMINA CADA CURVA',
    subtitle: 'Una 150 ágil y dinámica, creada para disfrutar cada recorrido.',
    category: 'Street · Naked · 149 cc',
    seoDescription: 'MTX Rush 150: una 150 ágil y dinámica, creada para disfrutar cada recorrido. Ficha técnica, vista 360° y especiales.',
    price: '6.000.000,00 $', // TODO precio real (valor de ejemplo del diseño)
    priceNote: 'IMPUESTOS Y ENVIOS NO INCLUIDOS',
    colors: [{ ...RED, frames: 6 }, { ...ORANGE, frames: 7 }],
    stats: { cc: '149 CC', kw: '8,4KW', vel: '95KM/H', peso: '120KG' },
    transmission: ['3.083', '1.882', '1.400', '1.174', '1.000'],
    specs: [
      { title: 'MOTOR', pill: PILL.MOTOR, rows: rushLikeMotor },
      { title: 'DIMENSIONES Y PESOS', pill: PILL.DIM, rows: [
        ['Longitud total', '2060 mm'],
        ['Ancho total', '750 mm'],
        ['Altura total', '1010 mm'],
        ['Distancia entre ejes', '1340 mm'],
        ['Peso húmedo', '120 kg'],
        ['Capacidad de tanque', '13 L'],
        ['Material de tanque', 'Metal'],
      ] },
      { title: 'RUEDAS·FRENOS', pill: PILL.RF, rows: [
        ['Llanta delantera', '90/90-17'],
        ['Llanta trasera', '120/80-17'],
        ['Presión delantera', '225 kPa'],
        ['Presión trasera', '225 kPa'],
        ['Freno delantero', 'Disco'],
        ['Freno trasero', 'Tambor'],
        ['Contiene asbesto', 'No'],
      ] },
      { title: 'ALIMENTACIÓN·ENCENDIDO', pill: PILL.AE, rows: rushLikeAE },
    ],
    especiales: {
      copy: [
        'La MTX Rush 150 está pensada para quienes buscan una conducción más dinámica dentro de la movilidad diaria. Su carácter combina agilidad, energía y una presencia visual marcada, ofreciendo una experiencia orientada al movimiento, la respuesta y el disfrute sobre el asfalto.',
        'Sin entrar en el territorio de la competición, la Rush 150 expresa una actitud más deportiva dentro de la gama MTX y propone una motocicleta con personalidad para quienes quieren algo más que simplemente desplazarse.',
      ],
      items: ['Tablero digital', 'Baúl y parrilla trasera', 'Cargador USB', 'Espejos de punto ciego', 'Protector de motor', 'Freno de disco delantero', 'Farola LED', 'Asiento ergonómico', 'Escape deportivo'],
      spots: [{x:72.3,y:23.18},{x:15.68,y:15.54},{x:66.94,y:23.18},{x:61.71,y:11.76},{x:60.61,y:48.96},{x:82.2,y:73.27},{x:77.46,y:36.41},{x:44.26,y:36.83},{x:23.84,y:57.26}],
      aspect: 2000 / 1333,
    },
    claim: ['POTENCIA TU CAMINO,', 'DOMINA CADA CURVA,', 'SIENTE LA RUSH 150.'],
    gallery: [
      'Protector lateral de motor para mayor seguridad',
      'Freno de disco con barras invertidas: máxima seguridad en cada frenada',
      'Puntera de escape deportiva, con actitud',
      'Espejos con punto ciego para mayor visibilidad',
      'Asiento ergonómico con costuras bicolor, puro estilo',
      'Faro LED delantero para ver mejor en la oscuridad',
      'Suspensión monoshock trasera: confort en cada curva',
    ],
    heroAlt: 'Piloto en una MTX Rush 150 por una avenida',
    heroBlur: 'img/rush-hero-tri.webp',
  },
  {
    slug: 'way-150',
    name: 'WAY 150',
    headline: 'TU CAMINO, SIN LÍMITES',
    subtitle: 'Diseño moderno y actitud aventurera para todo terreno.',
    category: 'Trail · Doble Propósito · 149 cc',
    seoDescription: 'MTX Way 150: diseño moderno y actitud aventurera para todo terreno. Ficha técnica, vista 360° y especiales.',
    price: '6.000.000,00 $', // TODO precio real
    priceNote: 'IMPUESTOS Y ENVIOS NO INCLUIDOS',
    colors: [RED, ORANGE],
    stats: { cc: '149 CC', kw: '8,4KW', vel: '95KM/H', peso: '120KG' },
    transmission: ['3.083', '1.882', '1.400', '1.174', '1.000'],
    specs: [
      { title: 'MOTOR', pill: PILL.MOTOR, rows: rushLikeMotor },
      { title: 'DIMENSIONES Y PESOS', pill: PILL.DIM, rows: [
        ['Longitud total', '2000 mm'],
        ['Ancho total', '750 mm'],
        ['Altura total', '1170 mm'],
        ['Distancia entre ejes', '1280 mm'],
        ['Peso húmedo', '120 kg'],
        ['Capacidad de tanque', '13 L'],
        ['Material de tanque', 'Metal'],
      ] },
      { title: 'RUEDAS·FRENOS', pill: PILL.RF, rows: [
        ['Llanta delantera', '2.75-18'],
        ['Llanta trasera', '3.00-18'],
        ['Presión delantera', '225 kPa'],
        ['Presión trasera', '225 kPa'],
        ['Freno delantero', 'Disco'],
        ['Freno trasero', 'Tambor'],
        ['Contiene asbesto', 'No'],
      ] },
      { title: 'ALIMENTACIÓN·ENCENDIDO', pill: PILL.AE, rows: rushLikeAE },
    ],
    especiales: {
      // TODO: texto borrador
      copy: [
        'La MTX Way 150 combina diseño moderno y actitud aventurera en una motocicleta pensada para recorrer todo terreno con estilo.',
        'Luces LED, cargador USB protegido de la lluvia, tablero digital y un tanque de hasta 13 litros para más autonomía: la Way 150 está hecha para que tu camino no tenga límites.',
      ],
      items: ['Tablero digital', 'Baúl y parrilla trasera', 'Cargador USB', 'Espejos de punto ciego', 'Freno de disco delantero', 'Farola LED', 'Asiento ergonómico', 'Escape deportivo', 'Suspensión trasera Dualshock'],
      spots: [{x:69.9,y:22.46},{x:12.7,y:28.17},{x:64.94,y:27.1},{x:59.1,y:11.31},{x:84.34,y:69.01},{x:77.19,y:33.98},{x:32.53,y:40.26},{x:27.07,y:69.17},{x:29.37,y:56.35}],
      aspect: 2000 / 1333,
    },
    claim: ['TU CAMINO,', 'SIN LÍMITES,', 'SIENTE LA WAY 150.'], // TODO validar
    gallery: [
      'Estética moderna con luces LED que enamoran a primera vista',
      'Cargador USB a la mano, protegido de la lluvia',
      'Motor de 149 cc con estilo que impone presencia',
      'Tablero digital con información clara y de calidad',
      'Puntera de escape deportiva',
      'Tanque con capacidad de hasta 13 litros, para más autonomía',
    ],
    heroAlt: 'Piloto en una MTX Way 150 por una calle de la ciudad',
  },
];

/** orden y color de la barra de modelos del carrusel del Home */
export const carouselBar = ['var(--red)', 'var(--blue)', 'var(--bronze)', 'var(--silver)', 'var(--steel)'];
/** modelo que se muestra primero (el diseño muestra la Rush 150) */
export const featuredSlug = 'rush-150';

export const getModel = (slug: string) => models.find((m) => m.slug === slug)!;
