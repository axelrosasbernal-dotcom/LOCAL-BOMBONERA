import { useDailyPromo } from '../../context/DailyPromoContext'
import { usePrices } from '../../context/PriceContext'
import { products, diasSemana } from '../../data/products'
import styles from './PromoDelDia.module.css'

export default function PromoDelDia() {
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

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <span className={styles.dayBadge}>🔥 Promo de {nombreDia}</span>
        <h2 className={styles.title}>{promo.titulo}</h2>
        {promo.descripcion && <p className={styles.desc}>{promo.descripcion}</p>}

        {productosIncluidos.length > 0 && (
          <div className={styles.products}>
            {productosIncluidos.map(p => (
              <div key={p.id} className={styles.product}>
                <img
                  src={p.image}
                  alt={p.name}
                  className={styles.productImg}
                  onError={e => { e.target.src = '/images/hero-banner.webp' }}
                />
                <span className={styles.productName}>{p.name}</span>
              </div>
            ))}
          </div>
        )}

        {precioFinal != null && (
          <div className={styles.priceRow}>
            {promo.precio_combo != null && (
              <span className={styles.priceOld}>{sumaPrecios} Bs.</span>
            )}
            <span className={styles.priceNew}>{precioFinal} Bs.</span>
          </div>
        )}
      </div>
    </section>
  )
}
