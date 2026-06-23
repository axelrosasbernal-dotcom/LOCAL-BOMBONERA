import { useState } from 'react'
import ProductModal from './ProductModal'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onError={e => { e.target.src = '/images/hero-banner.jpg' }}
          />
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
        </div>

        <div className={styles.body}>
          <p className={styles.category}>{product.category}</p>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.ingredients}>{product.ingredients}</p>

          <div className={styles.footer}>
            <span className={styles.price}>
              <span className={styles.priceNum}>{product.price}</span>
              <span className={styles.priceCurrency}>Bs.</span>
            </span>
            <button
              className={styles.btn}
              onClick={() => setModalOpen(true)}
              type="button"
            >
              + Agregar
            </button>
          </div>
        </div>
      </article>

      {modalOpen && <ProductModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  )
}
