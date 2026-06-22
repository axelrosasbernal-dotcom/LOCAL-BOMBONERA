import { useState } from 'react'
import { products, categories } from '../../data/products'
import ProductCard from '../ui/ProductCard'
import styles from './FeaturedProducts.module.css'

export default function FeaturedProducts({ filterCategory }) {
  const filtered = filterCategory
    ? products.filter(p => p.category === filterCategory)
    : products.filter(p => p.featured)

  const activeCat = categories.find(c => c.id === filterCategory)

  return (
    <section className={styles.section} id="destacados">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>
            {activeCat ? activeCat.icon + ' ' + activeCat.name : '⭐ Destacados'}
          </span>
          <h2 className={styles.title}>
            {activeCat ? activeCat.name : 'Productos Estrella'}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>Próximamente más productos en esta categoría.</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
