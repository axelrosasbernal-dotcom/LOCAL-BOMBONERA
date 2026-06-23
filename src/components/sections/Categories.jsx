import { categories } from '../../data/products'
import styles from './Categories.module.css'

export default function Categories({ activeCategory, onSelect }) {
  return (
    <section className={styles.section} id="categorias">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Nuestro Menú</span>
          <h2 className={styles.title}>¿Qué se te antoja?</h2>
        </div>

        <div className={styles.grid}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.card} ${activeCategory === cat.id ? styles.active : ''}`}
              onClick={() => onSelect(cat.id === activeCategory ? null : cat.id)}
            >
              <span className={styles.icon}>{cat.icon}</span>
              <span className={styles.name}>{cat.name}</span>
              <span className={styles.desc}>{cat.description}</span>
              <span className={styles.arrow}>→</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
