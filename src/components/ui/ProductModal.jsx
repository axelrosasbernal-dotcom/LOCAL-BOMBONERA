import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { extrasPorCategoria, nivelesPickante, cocaColaPrice } from '../../data/products'
import styles from './ProductModal.module.css'

export default function ProductModal({ product, editItem, onClose }) {
  const { addItem, updateItem } = useCart()
  const [qty, setQty] = useState(editItem?.quantity ?? 1)
  const [extras, setExtras] = useState(editItem?.customization.extras ?? [])
  const [picante, setPicante] = useState(editItem?.customization.picante ?? '')
  const [obs, setObs] = useState(editItem?.customization.observaciones ?? '')
  const [bebida, setBebida] = useState(editItem?.customization.bebida ?? false)

  const extrasDisponibles = extrasPorCategoria[product.category] ?? []

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function toggleExtra(e) {
    setExtras(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  function handleAdd() {
    const customization = { extras, picante, observaciones: obs.trim(), bebida }
    if (editItem) {
      updateItem(editItem.cartId, qty, customization)
    } else {
      addItem(product, qty, customization)
    }
    onClose()
  }

  const unitPrice = product.price + (bebida ? cocaColaPrice : 0)

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        <div className={styles.imgWrap}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.img}
            onError={e => { e.target.src = '/images/hero-banner.webp' }}
          />
          {product.badge && <span className={styles.badge}>{product.badge}</span>}
        </div>

        <div className={styles.body}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{product.name}</h2>
            <span className={styles.price}>{product.price} <small>Bs.</small></span>
          </div>
          <p className={styles.ingredients}>{product.ingredients}</p>

          {extrasDisponibles.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Personalizar</p>
              <div className={styles.chips}>
                {extrasDisponibles.map(e => (
                  <button
                    key={e}
                    type="button"
                    className={`${styles.chip} ${extras.includes(e) ? styles.chipActive : ''}`}
                    onClick={() => toggleExtra(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.tienePicante && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Nivel de picante</p>
              <div className={styles.chips}>
                {nivelesPickante.map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.chip} ${picante === n ? styles.chipActive : ''}`}
                    onClick={() => setPicante(prev => prev === n ? '' : n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <p className={styles.sectionLabel}>¿Agregás una bebida?</p>
            <div className={styles.chips}>
              <button
                type="button"
                className={`${styles.chip} ${bebida ? styles.chipActive : ''}`}
                onClick={() => setBebida(b => !b)}
              >
                🥤 Coca Cola +{cocaColaPrice} Bs.
              </button>
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>Observaciones</p>
            <textarea
              className={styles.textarea}
              placeholder="Ej: sin sal, bien cocido, aparte la salsa..."
              value={obs}
              onChange={e => setObs(e.target.value)}
              rows={2}
            />
          </div>

          <div className={styles.footer}>
            <div className={styles.qtyControl}>
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className={styles.qtyBtn}>−</button>
              <span className={styles.qtyNum}>{qty}</span>
              <button type="button" onClick={() => setQty(q => q + 1)} className={styles.qtyBtn}>+</button>
            </div>
            <button type="button" className={styles.addBtn} onClick={handleAdd}>
              {editItem ? 'Guardar cambios' : 'Agregar'} · {unitPrice * qty} Bs.
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
