import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Patrón de fondo tipo camiseta */}
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.badge}>
          <span>🏆</span> Oruro · Bolivia
        </div>

        <h1 className={styles.heading}>
          <span className={styles.headingSmall}>Burguer's</span>
          <span className={styles.headingBig}>La Bombonera</span>
        </h1>

        <p className={styles.tagline}>
          Hermanos unidos por una <strong>PASIÓN</strong>
        </p>

        <div className={styles.actions}>
          <a href="#categorias" className={styles.btnPrimary}>
            🍔 Ver Menú Completo
          </a>
          <a href="tel:77289212" className={styles.btnSecondary}>
            📞 Pedir Ahora
          </a>
        </div>

        <div className={styles.phones}>
          <span>📍 Tarapacá esq. León</span>
          <span className={styles.dot}>·</span>
          <span>📍 Tarapacá entre Sucre y Murguia</span>
        </div>
      </div>

      <div className={styles.imageWrap}>
        <img
          src="/images/hero-banner.webp"
          alt="Hamburguesa La Bombonera"
          className={styles.heroImg}
        />
        <div className={styles.glowRing} aria-hidden="true" />
      </div>
    </section>
  )
}
