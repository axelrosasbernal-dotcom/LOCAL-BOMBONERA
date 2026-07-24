import { useState } from 'react'
import { useTodayPromo } from '../../hooks/useTodayPromo'
import ProductModal from '../ui/ProductModal'
import styles from './PromoDelDia.module.css'

export default function PromoDelDia() {
  const [ordering, setOrdering] = useState(false)
  const data = useTodayPromo()

  if (!data) return null
  const { promo, productosIncluidos, sumaPrecios, precioFinal, nombreDia, comboProduct } = data

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

        <div className={styles.footer}>
          {precioFinal != null && (
            <div className={styles.priceRow}>
              {promo.precio_combo != null && (
                <span className={styles.priceOld}>{sumaPrecios} Bs.</span>
              )}
              <span className={styles.priceNew}>{precioFinal} Bs.</span>
            </div>
          )}
          {comboProduct && (
            <button type="button" className={styles.orderBtn} onClick={() => setOrdering(true)}>
              🛒 Pedir esta promo
            </button>
          )}
        </div>
      </div>

      {ordering && comboProduct && (
        <ProductModal product={comboProduct} onClose={() => setOrdering(false)} />
      )}
    </section>
  )
}
