import { businessInfo } from '../../data/products'
import { useSettings } from '../../context/SettingsContext'
import styles from './Horario.module.css'

function getEstado(apertura, cierre) {
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  const [aH, aM] = apertura.split(':').map(Number)
  const [cH, cM] = cierre.split(':').map(Number)
  return mins >= aH * 60 + aM && mins <= cH * 60 + cM
}

export default function Horario() {
  const { settings } = useSettings()
  const abierto = !settings.manual_closed && getEstado(settings.apertura, settings.cierre)

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.statusRow}>
            <span className={`${styles.dot} ${abierto ? styles.dotOpen : styles.dotClosed}`} />
            <span className={`${styles.status} ${abierto ? styles.statusOpen : styles.statusClosed}`}>
              {settings.manual_closed ? 'Cerrado hoy' : abierto ? 'Abierto ahora' : 'Cerrado ahora'}
            </span>
          </div>

          <h2 className={styles.title}>Horario de atención</h2>

          <div className={styles.info}>
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>📅</span>
              <span>{settings.horario_label}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>⏰</span>
              <span>{settings.apertura} – {settings.cierre}</span>
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
