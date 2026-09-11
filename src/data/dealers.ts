/** Puntos de venta — fuente: "5. PUNTOS DE VENTA/PUNTOS DE VENTA MTX NICARAGUA.xlsx" */
export interface Dealer {
  name: string;
  address: string;
  city: string;
  department: string;
  neighborhood: string;
  postalCode: string;
  phone: string;
  email: string;
}

export interface Country {
  name: string;
  dealers: Dealer[];
}

export const countries: Country[] = [
  {
    name: 'NICARAGUA',
    dealers: [
      { name: 'MTX Nicaragua', address: 'De los Semáforos del Colonial, 1/2c. al norte', city: 'Managua', department: 'Managua', neighborhood: 'Bello Horizonte', postalCode: '11003', phone: '+505 5754 3399', email: 'mtx.nicaragua@gmail.com' },
      { name: 'MTX Nicaragua', address: 'Costado sur semáforos de la Tenderí', city: 'Managua', department: 'Managua', neighborhood: 'Ciudad Jardín', postalCode: '11108', phone: '+505 5754 3399', email: 'mtx.nicaragua@gmail.com' },
      { name: 'MTX Nicaragua', address: 'Km. 14 Carretera a Masaya, Uniplaza Veracrúz', city: 'Nindirí', department: 'Masaya', neighborhood: 'Ciudad Jardín', postalCode: '42200', phone: '+505 5754 3399', email: 'mtx.nicaragua@gmail.com' },
      { name: 'MTX Nicaragua Tienda', address: 'De los semáforos de Claro Villa Fontana, 300 metros al sur', city: 'Managua', department: 'Managua', neighborhood: 'Villa Fontana Este', postalCode: '141165', phone: '+505 5754 3399', email: 'mtx.nicaragua@gmail.com' },
    ],
  },
];
