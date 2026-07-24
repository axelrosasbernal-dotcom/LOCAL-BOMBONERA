import { products, categories } from '../../data/products'
import { useTodayPromo } from '../../hooks/useTodayPromo'
import ProductCard from '../ui/ProductCard'
import styles from './FeaturedProducts.module.css'

export default function FeaturedProducts({ filterCategory }) {
  const filtered = filterCategory
    ? products.filter(p => p.category === filterCategory)
    : products

  const activeCat = categories.find(c => c.id === filterCategory)
  const todayPromo = useTodayPromo()
  const comboProduct = !filterCategory ? todayPromo?.comboProduct : null

  return (
    <section className={styles.section} id="menu">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>
            {activeCat ? `${activeCat.icon} ${activeCat.name}` : '🍔 Menú completo'}
          </span>
          <h2 className={styles.title}>
            {activeCat ? activeCat.name : 'Todo el Menú'}
          </h2>
          <p className={styles.subtitle}>
            Seleccioná lo que querés y armá tu pedido
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>Próximamente más productos en esta categoría.</p>
        ) : (
          <div className={styles.grid}>
            {comboProduct && <ProductCard key={comboProduct.id} product={comboProduct} />}
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
