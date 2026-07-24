import styles from './ContactFooter.module.css'

export default function ContactFooter() {
  return (
    <footer className={styles.footer} id="contacto">
      <div className={styles.container}>
        {/* Barra superior */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>🍔</span>
            <div>
              <p className={styles.logoName}>La Bombonera</p>
              <p className={styles.logoSub}>Burguer's · Oruro, Bolivia</p>
            </div>
          </div>
          <p className={styles.tagline}>
            Hermanos unidos por una <span>PASIÓN</span>
          </p>
        </div>

        {/* Divisor */}
        <div className={styles.divider} />

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.block}>
            <h4 className={styles.blockTitle}>📞 Teléfonos</h4>
            <a href="tel:75711571" className={styles.link}>75711571</a>
          </div>

          <div className={styles.block}>
            <h4 className={styles.blockTitle}>📍 Ubicación</h4>
            <p className={styles.text}>Tarapacá entre Sucre y Murguia</p>
          </div>

          <div className={styles.block}>
            <h4 className={styles.blockTitle}>📲 Seguinos</h4>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a>
          </div>

          <div className={styles.block}>
            <h4 className={styles.blockTitle}>🛵 Delivery</h4>
            <a
              href="https://wa.me/59175711571"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsapp}
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copy}>© 2025 Burguer's La Bombonera · Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  )
}
