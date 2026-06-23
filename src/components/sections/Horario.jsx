import { horario, businessInfo } from '../../data/products'
import styles from './Horario.module.css'

function getEstado() {
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  const apertura = horario.aperturaH * 60 + horario.aperturaM
  const cierre   = horario.cierreH   * 60 + horario.cierreM
  return mins >= apertura && mins <= cierre
}

export default function Horario() {
  const abierto = getEstado()

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.statusRow}>
            <span className={`${styles.dot} ${abierto ? styles.dotOpen : styles.dotClosed}`} />
            <span className={`${styles.status} ${abierto ? styles.statusOpen : styles.statusClosed}`}>
              {abierto ? 'Abierto ahora' : 'Cerrado ahora'}
            </span>
          </div>

          <h2 className={styles.title}>Horario de atención</h2>

          <div className={styles.info}>
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>📅</span>
              <span>{horario.label}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>⏰</span>
              <span>{horario.apertura} – {horario.cierre}</span>
            </div>
          </div>

          <div className={styles.phones}>
            {businessInfo.phones.map(p => (
              <a key={p} href={`tel:${p}`} className={styles.phone}>
                📞 {p}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
