import { promos } from '../../data/products'
import styles from './Promos.module.css'

export default function Promos() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>🔥 Ofertas</span>
          <h2 className={styles.title}>Promociones del momento</h2>
        </div>
        <div className={styles.grid}>
          {promos.map(promo => (
            <div key={promo.id} className={styles.card}>
              <span className={styles.icon}>{promo.icon}</span>
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <h3 className={styles.cardTitle}>{promo.titulo}</h3>
                  <span className={styles.badge}>{promo.badge}</span>
                </div>
                <p className={styles.cardDesc}>{promo.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
