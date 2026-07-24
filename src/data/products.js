export const businessInfo = {
  name: "Burguer's La Bombonera",
  whatsapp: '59175711571',
  phones: ['75711571'],
  locations: ['Tarapacá entre Sucre y Murguia'],
  city: 'Oruro, Bolivia',
  mapsQuery: 'Tarapacá+entre+Sucre+y+Murguia+Oruro+Bolivia',
}

export const horario = {
  label: 'Lunes a Domingo',
  apertura: '18:00',
  cierre: '23:30',
  aperturaH: 18,
  aperturaM: 0,
  cierreH: 23,
  cierreM: 30,
}

export const extrasPorCategoria = {
  hamburguesas: ['Sin cebolla', 'Sin tomate', 'Sin lechuga', 'Extra salsa', 'Doble queso', 'Extra tocino'],
  lomitos:      ['Sin ensalada', 'Extra huevo', 'Con mayo', 'Extra jamón', 'Sin chorrellana'],
  picar:        ['Sin salsa', 'Extra provenzal', 'Extra limón'],
  especiales:   ['Sin cebolla', 'Sin tomate', 'Extra salsa', 'Doble queso', 'Extra tocino'],
}

export const nivelesPickante = ['Poco picante', 'Medio picante', 'Muy picante']

export const cocaColaPrice = 8

export const diasSemana = [
  { valor: 1, nombre: 'Lunes' },
  { valor: 2, nombre: 'Martes' },
  { valor: 3, nombre: 'Miércoles' },
  { valor: 4, nombre: 'Jueves' },
  { valor: 5, nombre: 'Viernes' },
  { valor: 6, nombre: 'Sábado' },
  { valor: 0, nombre: 'Domingo' },
]

export const categories = [
  { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔', description: 'Nuestras burgers icónicas' },
  { id: 'lomitos',      name: 'Lomitos',      icon: '🥖', description: 'El clásico que enamora' },
  { id: 'picar',        name: 'Para Picar',   icon: '🍖', description: 'Para compartir' },
  { id: 'especiales',   name: 'Especiales',   icon: '⭐', description: 'Lo mejor de la casa' },
]

export const products = [
  {
    id: 1,
    name: 'Hamburguesa del Pueblo',
    category: 'hamburguesas',
    price: 15,
    ingredients: 'Carne · Queso · Ensalada · Papas',
    image: '/images/burger-del-pueblo.webp',
    featured: true,
    badge: null,
    tienePicante: false,
  },
  {
    id: 2,
    name: 'Hamburguesa JR-10',
    category: 'hamburguesas',
    price: 25,
    ingredients: 'Carne · Tocino · Ensalada · Queso Cheddar · Papas',
    image: '/images/burger-jr10.webp',
    featured: true,
    badge: 'Popular',
    tienePicante: false,
  },
  {
    id: 3,
    name: 'Burger La Bombonera',
    category: 'especiales',
    price: 40,
    ingredients: '2 Carnes · Pepinillos · Ensalada · 2 Quesos Cheddar · Papas',
    image: '/images/burger-bombonera.webp',
    featured: true,
    badge: 'Estrella',
    tienePicante: true,
  },
  {
    id: 4,
    name: 'Lomito Simple',
    category: 'lomitos',
    price: 22,
    ingredients: 'Carne · Huevo · Ensalada · Papas',
    image: '/images/lomito-simple.webp',
    featured: true,
    badge: null,
    tienePicante: false,
  },
  {
    id: 5,
    name: 'Lomito Especial',
    category: 'lomitos',
    price: 25,
    ingredients: 'Carne · Huevo · Jamón · Chorrellana · Papas',
    image: '/images/lomito-especial.webp',
    featured: false,
    badge: 'Nuevo',
    tienePicante: false,
  },
  {
    id: 6,
    name: 'Picadito a la Scaloneta',
    category: 'picar',
    price: 40,
    ingredients: 'Carne de Res · Chorizo Parrillero · Papas Salteadas · Pan con Ajo y Queso',
    image: '/images/picadito-scaloneta.webp',
    featured: true,
    badge: 'Para 2',
    tienePicante: true,
  },
  {
    id: 7,
    name: 'Hamburguesa Goleadora',
    category: 'hamburguesas',
    price: 22,
    ingredients: 'Carne · Queso · Jamón · Huevo · Ensalada · Papas',
    image: '/images/burger-goleadora.webp',
    featured: false,
    badge: 'Nuevo',
    tienePicante: false,
  },
  {
    id: 8,
    name: 'Hamburguesa Maradona',
    category: 'especiales',
    price: 40,
    ingredients: 'Carne 180g · Piña · Salchicha · Queso Mozzarella · Barbacoa · Cebolla Caramelizada · Papas',
    image: '/images/burger-maradona.webp',
    featured: true,
    badge: 'Nuevo',
    tienePicante: false,
  },
  {
    id: 9,
    name: 'Hamburguesa Messi',
    category: 'especiales',
    price: 40,
    ingredients: 'Carne 180g · Queso Cheddar · Barbacoa · Chorizo Parrillero · Cebolla Caramelizada · Papas',
    image: '/images/burger-messi.webp',
    featured: true,
    badge: 'Nuevo',
    tienePicante: false,
  },
]

export const promos = [
  {
    id: 1,
    titulo: '2x1 los Martes',
    descripcion: 'Llevá 2 hamburguesas y pagá solo una. Válido todos los martes.',
    icon: '🍔',
    badge: 'Martes',
  },
  {
    id: 2,
    titulo: 'Combo Pareja',
    descripcion: '2 hamburguesas + 2 papas + 2 bebidas. El combo perfecto para dos.',
    icon: '💑',
    badge: 'Combo',
  },
  {
    id: 3,
    titulo: 'Delivery Gratis',
    descripcion: 'Pedidos mayores a 30 Bs. con delivery sin cargo.',
    icon: '🛵',
    badge: '¡Gratis!',
  },
]

export const featured = products.filter(p => p.featured)
