import { useDailyPromo } from '../context/DailyPromoContext'
import { usePrices } from '../context/PriceContext'
import { products, diasSemana } from '../data/products'

export function useTodayPromo() {
  const { promoMap } = useDailyPromo()
  const { priceMap } = usePrices()
  const today = new Date().getDay()
  const promo = promoMap[today]

  if (!promo?.activa || !promo.titulo.trim()) return null

  const productosIncluidos = promo.product_ids
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  const sumaPrecios = productosIncluidos.reduce((sum, p) => sum + (priceMap[p.id] ?? p.price), 0)
  const precioFinal = promo.precio_combo ?? (productosIncluidos.length > 0 ? sumaPrecios : null)
  const nombreDia = diasSemana.find(d => d.valor === today)?.nombre

  const comboProduct = precioFinal != null ? {
    id: `promo-${today}`,
    name: promo.titulo,
    category: 'promos',
    price: precioFinal,
    ingredients: productosIncluidos.length > 0
      ? productosIncluidos.map(p => p.name).join(' + ')
      : promo.descripcion,
    image: productosIncluidos[0]?.image ?? '/images/hero-banner.webp',
    featured: false,
    badge: `🔥 Promo de ${nombreDia}`,
    tienePicante: false,
  } : null

  return { promo, productosIncluidos, sumaPrecios, precioFinal, nombreDia, comboProduct }
}
