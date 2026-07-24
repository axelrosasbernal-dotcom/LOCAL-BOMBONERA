import { useState } from 'react'
import ProductModal from './ProductModal'
import { useStock } from '../../context/StockContext'
import { usePrices } from '../../context/PriceContext'
import { useSettings } from '../../context/SettingsContext'
import styles from './ProductCard.module.css'

export default function ProductCard({ product: baseProduct }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { stockMap } = useStock()
  const { priceMap } = usePrices()
  const { settings } = useSettings()
  const stockOk = stockMap[baseProduct.id] !== false
  const closed = settings.manual_closed
  const canOrder = stockOk && !closed
  const price = priceMap[baseProduct.id] ?? baseProduct.price
  const product = { ...baseProduct, price }

  return (
    <>
      <article className={`${styles.card} ${!canOrder ? styles.cardOutOfStock : ''}`}>
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onError={e => { e.target.src = '/images/hero-banner.webp' }}
          />
          {!stockOk && (
            <div className={styles.imageOverlay}>
              <span className={styles.imageOverlayText}>Agotado</span>
            </div>
          )}
          {canOrder && product.badge && <span className={styles.badge}>{product.badge}</span>}
        </div>

        <div className={styles.body}>
          <p className={styles.category}>{product.category}</p>
          <h3 className={`${styles.name} ${!canOrder ? styles.nameOutOfStock : ''}`}>{product.name}</h3>
          <p className={styles.ingredients}>{product.ingredients}</p>

          <div className={styles.footer}>
            <span className={`${styles.price} ${!canOrder ? styles.priceOutOfStock : ''}`}>
              <span className={styles.priceNum}>{product.price}</span>
              <span className={styles.priceCurrency}>Bs.</span>
            </span>
            <button
              className={`${styles.btn} ${!canOrder ? styles.btnDisabled : ''}`}
              onClick={() => canOrder && setModalOpen(true)}
              type="button"
              disabled={!canOrder}
            >
              {canOrder ? '+ Agregar' : closed ? 'Local cerrado' : 'No disponible'}
            </button>
          </div>
        </div>
      </article>

      {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  )
}
