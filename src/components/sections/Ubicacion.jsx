import { businessInfo } from '../../data/products'
import styles from './Ubicacion.module.css'

export default function Ubicacion() {
  const mapSrc = `https://maps.google.com/maps?q=${businessInfo.mapsQuery}&output=embed`

  return (
    <section className={styles.section} id="ubicacion">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>📍 Dónde estamos</span>
          <h2 className={styles.title}>Ubicación</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <h3 className={styles.infoTitle}>Sucursales</h3>
            {businessInfo.locations.map((loc, i) => (
              <div key={i} className={styles.loc}>
                <span className={styles.locIcon}>📍</span>
                <span>{loc}</span>
              </div>
            ))}
            <div className={styles.loc}>
              <span className={styles.locIcon}>🏙</span>
              <span>{businessInfo.city}</span>
            </div>

            <div className={styles.divider} />

            <h3 className={styles.infoTitle}>Contacto</h3>
            {businessInfo.phones.map(p => (
              <a key={p} href={`tel:${p}`} className={styles.phone}>📞 {p}</a>
            ))}
            <a
              href={`https://wa.me/${businessInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waLink}
            >
              📲 Escribir por WhatsApp
            </a>
          </div>

          <div className={styles.mapWrap}>
            <iframe
              title="Ubicación La Bombonera"
              src={mapSrc}
              className={styles.map}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
