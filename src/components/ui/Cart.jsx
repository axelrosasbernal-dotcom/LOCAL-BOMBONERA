import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { businessInfo } from '../../data/products'
import styles from './Cart.module.css'

const INITIAL_FORM = { nombre: '', telefono: '', tipo: 'retiro', direccion: '', referencia: '' }

function buildWhatsAppMsg(items, total, form) {
  const lines = []
  lines.push('Hola! Quiero realizar el siguiente pedido 🍔')
  lines.push('')
  lines.push(`*Nombre:* ${form.nombre}`)
  lines.push(`*Teléfono:* ${form.telefono}`)
  lines.push('')
  lines.push(`*Tipo de entrega:* ${form.tipo === 'delivery' ? 'Delivery 🛵' : 'Retiro en el local 🏃'}`)
  if (form.tipo === 'delivery') {
    lines.push(`*Dirección:* ${form.direccion}`)
    if (form.referencia.trim()) lines.push(`*Referencia:* ${form.referencia}`)
  }
  lines.push('')
  lines.push('*Pedido:*')
  items.forEach(item => {
    lines.push(`• ${item.quantity}x ${item.product.name}`)
    const detalles = []
    if (item.customization.picante) detalles.push(item.customization.picante)
    if (item.customization.extras?.length) detalles.push(...item.customization.extras)
    if (detalles.length) lines.push(`  _${detalles.join(', ')}_`)
    if (item.customization.observaciones) lines.push(`  _Obs: ${item.customization.observaciones}_`)
  })
  lines.push('')
  lines.push(`*Total estimado: ${total} Bs.*`)
  lines.push('')
  lines.push('¡Gracias! 😊')
  return lines.join('\n')
}

export default function Cart() {
  const { items, total, count, isOpen, closeCart, removeItem, updateQty, clearCart } = useCart()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.nombre.trim())   e.nombre    = 'Requerido'
    if (!form.telefono.trim()) e.telefono  = 'Requerido'
    if (form.tipo === 'delivery' && !form.direccion.trim()) e.direccion = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSend() {
    if (items.length === 0 || !validate()) return
    const msg = buildWhatsAppMsg(items, total, form)
    window.open(`https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
    setTimeout(() => {
      clearCart()
      setForm(INITIAL_FORM)
      setSent(false)
      closeCart()
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.backdrop} onClick={closeCart} />
      <aside className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tu Pedido <span className={styles.count}>{count}</span></h2>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Cerrar carrito">✕</button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🛒</span>
              <p>Tu carrito está vacío</p>
              <button className={styles.emptyBtn} onClick={closeCart}>Ver Menú</button>
            </div>
          ) : (
            <>
              <ul className={styles.list}>
                {items.map(item => (
                  <li key={item.cartId} className={styles.item}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className={styles.itemImg}
                      onError={e => { e.target.src = '/images/hero-banner.jpg' }}
                    />
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.product.name}</p>
                      {item.customization.picante && (
                        <p className={styles.itemDetail}>🌶 {item.customization.picante}</p>
                      )}
                      {item.customization.extras?.length > 0 && (
                        <p className={styles.itemDetail}>{item.customization.extras.join(' · ')}</p>
                      )}
                      {item.customization.observaciones && (
                        <p className={styles.itemDetail}>📝 {item.customization.observaciones}</p>
                      )}
                      <div className={styles.itemControls}>
                        <div className={styles.qtyRow}>
                          <button className={styles.qtyBtn} onClick={() => updateQty(item.cartId, item.quantity - 1)}>−</button>
                          <span className={styles.qtyNum}>{item.quantity}</span>
                          <button className={styles.qtyBtn} onClick={() => updateQty(item.cartId, item.quantity + 1)}>+</button>
                        </div>
                        <span className={styles.itemPrice}>{item.product.price * item.quantity} Bs.</span>
                        <button className={styles.removeBtn} onClick={() => removeItem(item.cartId)} aria-label="Eliminar">🗑</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.totalRow}>
                <span>Total estimado</span>
                <span className={styles.totalAmt}>{total} Bs.</span>
              </div>

              <div className={styles.divider} />

              {/* Formulario */}
              <div className={styles.form}>
                <p className={styles.formTitle}>Tus datos</p>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Nombre *</label>
                    <input
                      className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={e => set('nombre', e.target.value)}
                    />
                    {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Teléfono *</label>
                    <input
                      className={`${styles.input} ${errors.telefono ? styles.inputError : ''}`}
                      placeholder="Tu número"
                      type="tel"
                      value={form.telefono}
                      onChange={e => set('telefono', e.target.value)}
                    />
                    {errors.telefono && <span className={styles.error}>{errors.telefono}</span>}
                  </div>
                </div>

                <div className={styles.tipoRow}>
                  <button
                    type="button"
                    className={`${styles.tipoBtn} ${form.tipo === 'retiro' ? styles.tipoActive : ''}`}
                    onClick={() => set('tipo', 'retiro')}
                  >
                    🏃 Retiro en local
                  </button>
                  <button
                    type="button"
                    className={`${styles.tipoBtn} ${form.tipo === 'delivery' ? styles.tipoActive : ''}`}
                    onClick={() => set('tipo', 'delivery')}
                  >
                    🛵 Delivery
                  </button>
                </div>

                {form.tipo === 'delivery' && (
                  <div className={styles.deliveryFields}>
                    <div className={styles.field}>
                      <label className={styles.label}>Dirección *</label>
                      <input
                        className={`${styles.input} ${errors.direccion ? styles.inputError : ''}`}
                        placeholder="Calle y número"
                        value={form.direccion}
                        onChange={e => set('direccion', e.target.value)}
                      />
                      {errors.direccion && <span className={styles.error}>{errors.direccion}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Referencia</label>
                      <input
                        className={styles.input}
                        placeholder="Frente al parque, color de casa..."
                        value={form.referencia}
                        onChange={e => set('referencia', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.sendWrap}>
            <button
              className={`${styles.sendBtn} ${sent ? styles.sendBtnSent : ''}`}
              onClick={handleSend}
              disabled={sent}
            >
              {sent ? '✓ Pedido enviado' : '📲 Enviar Pedido por WhatsApp'}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
