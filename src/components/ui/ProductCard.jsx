import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const whatsappMsg = encodeURIComponent(`Hola! Quiero pedir: ${product.name} (${product.price} Bs.)`)
  const whatsappUrl = `https://wa.me/59175711571?text=${whatsappMsg}`

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.ingredients}>{product.ingredients}</p>

        <div className={styles.footer}>
          <span className={styles.price}>
            <span className={styles.priceNum}>{product.price}</span>
            <span className={styles.priceCurrency}>Bs.</span>
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btn}
          >
            Pedir 🛒
          </a>
        </div>
      </div>
    </article>
  )
}
